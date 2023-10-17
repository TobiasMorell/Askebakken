using System.Security.Authentication;
using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Services.PasswordHasher;

namespace Askebakken.GraphQL.Services;

public interface IAuthenticationService
{
    Task<Resident> GetResidentByUsernameAndPassword(string username,
        string password,
        CancellationToken cancellationToken = default);
}

public class AuthenticationService : IAuthenticationService
{
    private readonly IResidentRepository _residentRepository;
    private readonly IPasswordHasher _passwordHasher;

    public AuthenticationService(IResidentRepository residentRepository, IPasswordHasher passwordHasher)
    {
        _residentRepository = residentRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Resident> GetResidentByUsernameAndPassword(string username, string password, CancellationToken cancellationToken = default)
    {
        var existingUser = await _residentRepository.GetResidentByUsername(username, cancellationToken);
        if (existingUser is null)
        {
            throw new AuthenticationException("Username or password is invalid");
        }
        
        var passwordHash = existingUser.PasswordHash ?? string.Empty;
        if (!_passwordHasher.Verify(password, passwordHash))
        {
            throw new AuthenticationException("Username or password is invalid");
        }

        return existingUser;
    }
}