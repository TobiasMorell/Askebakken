using Askebakken.GraphQL.Services;
using HotChocolate.Authorization;
using HotChocolate.Data;
using MongoDB.Driver;

namespace Askebakken.GraphQL.Schema.Queries;

[ExtendObjectType("Query")]
public class ResidentQuery
{
    [Authorize]
    public async Task<Resident> GetMe([Service] IUserService userService)
    {
        var user = await userService.GetAuthenticatedUser();
        if (user is null)
        {
            throw new UnauthorizedAccessException();
        }
        
        return user;
    }
    
    [Authorize]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IExecutable<Resident> GetResidents([Service] IMongoCollection<Resident> collection)
    {
        return collection.AsExecutable();
    }

    [Authorize]
    [UseFirstOrDefault]
    public IExecutable<Resident> GetResidentById(
        [Service] IMongoCollection<Resident> collection,
        Guid id)
    {
        return collection.Find(x => x.Id == id).AsExecutable();
    }
}