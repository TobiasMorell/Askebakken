using System.Text;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Services.PasswordHasher;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Askebakken.GraphQL.Extensions;

public static class AuthenticationServiceCollectionExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection serviceCollection, JwtAuthenticationOptions authOptions)
    {
        serviceCollection.AddSingleton(authOptions);
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authOptions.Secret));

        serviceCollection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new()
            {
                ValidIssuer = authOptions.Issuer,
                ValidateIssuer = true,
                ValidAudience = authOptions.Audience,
                ValidateAudience = true,
                IssuerSigningKey = authSigningKey,
                ValidateIssuerSigningKey = authOptions.ValidateSigningKey,
            };
        });
        serviceCollection.AddAuthorization().AddSingleton<IPasswordHasher, DefaultPasswordHasher>().AddHttpContextAccessor()
            .AddTransient<IUserService, UserService>().AddSingleton<ITokenService, JwtTokenService>()
            .AddSingleton<IAuthenticationService, AuthenticationService>();

        return serviceCollection;
    }
}