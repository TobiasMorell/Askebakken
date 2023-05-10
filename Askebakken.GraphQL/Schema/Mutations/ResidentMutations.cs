using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Schema.Inputs;
using Askebakken.GraphQL.Schema.Results;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Services.PasswordHasher;
using HotChocolate.Authorization;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Mutations;

public record AuthenticateResult(string Token);

[ExtendObjectType("Mutation")]
public class ResidentMutations
{
    [Error<UsernameAlreadyTakenError>]
    [Authorize(Roles = new [] { "Admin"})]
    public async Task<Resident> CreateResident([Service] IMongoCollection<Resident> collection, [Service] IPasswordHasher passwordHasher, CreateResidentInput resident, CancellationToken cancellationToken = default)
    {
        var existingUser = await collection.FindAsync(u => u.Username == resident.Username, cancellationToken: cancellationToken);
        if (await existingUser.AnyAsync(cancellationToken: cancellationToken))
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
            ParticipatesInIds = new List<Guid>(),
        };
        await collection.InsertOneAsync(actualResident, cancellationToken: cancellationToken);
        return actualResident;
    }

    [Error<AuthenticationException>]
    public async Task<AuthenticateResult> Authenticate([Service] IMongoCollection<Resident> collection, [Service] IPasswordHasher passwordHasher, [Service] JwtAuthenticationOptions options,
        AuthenticateInput authenticateInput, CancellationToken cancellationToken = default)
    {
        var existingUser = await GetResidentByUsernameAndPassword(authenticateInput.Username, authenticateInput.Password, collection, passwordHasher, cancellationToken);
        
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

        return new(tokenHandler.WriteToken(token));
    }
    
    public async Task<SuccessResult> ForgotPassword([Service] IMongoCollection<Resident> collection, [Service] IPasswordHasher passwordHasher, [Service] IEmailService emailService, ForgotPasswordInput forgotPasswordInput, CancellationToken cancellationToken)
    {
        var existingUser = await (await collection.FindAsync(u => u.Username == forgotPasswordInput.Username, cancellationToken: cancellationToken)).FirstOrDefaultAsync(cancellationToken: cancellationToken);
        if (existingUser is null)
        {
            await Task.Delay(TimeSpan.FromMilliseconds(RandomNumberGenerator.GetInt32(200, 1000)), cancellationToken);
            return new(true);
        }

        var newPassword = Guid.NewGuid().ToString("N")[..8];
        var passwordHash = passwordHasher.Hash(newPassword);
        var update = Builders<Resident>.Update.Set(u => u.PasswordHash, passwordHash);
        await collection.UpdateOneAsync(u => u.Id == existingUser.Id, update, cancellationToken: cancellationToken);
        
        await emailService.Send(new Email(existingUser.Username, $"{existingUser.FirstName} {existingUser.LastName}",
            "Ny kodeord til Askebakkens beboerportal",
            GetPasswordResetEmailTemplate(existingUser.FirstName, existingUser.LastName, newPassword)) 
        {
            Preview = $"Din nye kode er {newPassword}",
        }, cancellationToken);
        
        return new(true);
    }
    
    [Error<AuthenticationException>]
    public async Task<SuccessResult> ChangePassword([Service] IMongoCollection<Resident> collection, [Service] IPasswordHasher passwordHasher, [Service] IEmailService emailService, ChangePasswordInput input, CancellationToken cancellationToken = default)
    {
        var user = await GetResidentByUsernameAndPassword(input.Username, input.OldPassword, collection, passwordHasher,
            cancellationToken);
        
        var passwordHash = passwordHasher.Hash(input.NewPassword);
        var update = Builders<Resident>.Update.Set(u => u.PasswordHash, passwordHash);
        await collection.UpdateOneAsync(u => u.Id == user.Id, update, cancellationToken: cancellationToken);
        
        await emailService.Send(new Email(user.Username, $"{user.FirstName} {user.LastName}",
            "Dit kodeord til Askebakkens beboerportal er blevet ændret",
            $"""
            <h1>Hej {user.FirstName} {user.LastName}</h1>

            <p>Du har bedt om at få ændret dit kodeord til Askebakkens beboerportal.</p>

            <p>Hvis du ikke har bedt om dette, så kontakt venligst en administrator.</p>
            """)
        {
            Preview = "Dit kodeord er blevet ændret",
        }, cancellationToken);
        
        return new(true);
    }

    private async Task<Resident> GetResidentByUsernameAndPassword(string username, string password, IMongoCollection<Resident> collection, IPasswordHasher passwordHasher, CancellationToken cancellationToken = default)
    {
        var existingUser = await (await collection.FindAsync(u => u.Username == username, cancellationToken: cancellationToken)).FirstOrDefaultAsync(cancellationToken: cancellationToken);
        var passwordHash = existingUser?.PasswordHash ?? string.Empty;
        if (!passwordHasher.Verify(password, passwordHash))
        {
            throw new AuthenticationException("Username or password is invalid");
        }

        return existingUser;
    }
    
    private string GetPasswordResetEmailTemplate(string firstName, string lastName, string newPassword) => $"""
    <h1>Hej {firstName} {lastName}</h1>

    <p>Du har bedt om at få nulstillet dit kodeord til Askebakkens beboerportal.</p>

    <p>Dit nye kodeord er: <strong>{newPassword}</strong></p>

    <p>Vi anbefaler at du skifter dit kodeord, når du har logget ind.</p>

    <p>Med venlig hilsen</p>

    <p>Askebakkens beboerportal</p>
    """; 
}