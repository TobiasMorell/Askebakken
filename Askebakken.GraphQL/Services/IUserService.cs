using System.Security.Claims;
using Askebakken.GraphQL.Schema;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Services;

public interface IUserService
{
    Task<Resident?> GetAuthenticatedUser(CancellationToken cancellationToken = default);
}

public class UserService : IUserService
{
    private readonly IMongoCollection<Resident> _collection;
    private readonly IHttpContextAccessor _claims;

    public UserService(IMongoCollection<Resident> collection, IHttpContextAccessor claims)
    {
        _collection = collection;
        _claims = claims;
    }

    public async Task<Resident?> GetAuthenticatedUser(CancellationToken cancellationToken = default)
    {
        var idClaim = _claims.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
        if (idClaim == null)
        {
            return null;
        }

        if (!Guid.TryParse(idClaim.Value, out var id))
        {
            return null;
        }
        
        var cursor = await _collection.FindAsync(r => r.Id == id, cancellationToken: cancellationToken);
        return await cursor.FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }
}