using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Services.PasswordHasher;
using HotChocolate.Authorization;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Mutations;

public class CreateResidentInput
{
    [EmailAddress]
    public string Username { get; set; }
    public string Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string HouseNumber { get; set; }
}

public class AuthenticateInput
{
    public string Username { get; set; }
    public string Password { get; set; }
}

[ExtendObjectType("Mutation")]
public class ResidentMutations
{
    [Error<UsernameAlreadyTakenError>]
    [Authorize(Roles = new [] { "Admin"})]
    public async Task<Resident> CreateResident([Service] IMongoCollection<Resident> collection, [Service] IPasswordHasher passwordHasher, CreateResidentInput resident)
    {
        var existingUser = await collection.FindAsync(u => u.Username == resident.Username);
        if (await existingUser.AnyAsync())
        {
            throw new UsernameAlreadyTakenError(resident.Username);
        }
        
        var actualResident = new Resident
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow,
            Username = resident.Username,
            PasswordHash = passwordHasher.Hash(resident.Password),
            FirstName = resident.FirstName,
            LastName = resident.LastName,
            HouseNumber = resident.HouseNumber,
            WeekPlanIds = new List<Guid>(),
            ParticipatesInIds = new List<Guid>(),
        };
        await collection.InsertOneAsync(actualResident);
        return actualResident;
    }

    [Error<AuthenticationException>]
    public async Task<string> Authenticate([Service] IMongoCollection<Resident> collection, [Service] IPasswordHasher passwordHasher, [Service] JwtAuthenticationOptions options,
        AuthenticateInput authenticateInput)
    {
        var existingUser = await (await collection.FindAsync(u => u.Username == authenticateInput.Username)).FirstOrDefaultAsync();
        var passwordHash = existingUser?.PasswordHash ?? string.Empty;
        if (!passwordHasher.Verify(authenticateInput.Password, passwordHash))
        {
            throw new AuthenticationException("Username or password is invalid");
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.UTF8.GetBytes(options.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, existingUser!.Username),
                new Claim(ClaimTypes.NameIdentifier, existingUser.Id.ToString()),
            }.Concat(existingUser.Roles.Select(r => new Claim(ClaimTypes.Role, r)))),
            //Expires = DateTime.UtcNow.AddMinutes(options.ExpirationMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature),
            Issuer = options.Issuer,
            Audience = options.Audience,
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}