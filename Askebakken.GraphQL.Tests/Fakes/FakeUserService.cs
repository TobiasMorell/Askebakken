using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Services;

namespace Askebakken.GraphQL.Tests.Fakes;

public class FakeUserService : IUserService
{
    private Resident? _mockAuthenticatedUser;
    
    public void MockAuthenticatedUser(Resident user)
    {
        _mockAuthenticatedUser = user;
    }

    public Task<Resident?> GetAuthenticatedUser(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_mockAuthenticatedUser);
    }
}