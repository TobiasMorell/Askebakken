using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Schema;
using Microsoft.IdentityModel.Tokens;

namespace Askebakken.GraphQL.Services;

public interface ITokenService
{
    string GetToken(Resident user);
}

public class JwtTokenService : ITokenService
{
    private readonly JwtAuthenticationOptions _options;

    public JwtTokenService(JwtAuthenticationOptions options)
    {
        _options = options;
    }

    public string GetToken(Resident user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.UTF8.GetBytes(_options.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            }.Concat(user.Roles.Select(r => new Claim(ClaimTypes.Role, r)))),
            Expires = DateTime.UtcNow.AddMinutes(_options.ExpirationMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _options.Issuer,
            Audience = _options.Audience,
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new(tokenHandler.WriteToken(token));
    }
}