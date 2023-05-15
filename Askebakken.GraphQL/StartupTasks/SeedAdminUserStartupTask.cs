using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Services.PasswordHasher;

namespace Askebakken.GraphQL.StartupTasks;

public class SeedAdminUserStartupTask : IStartupTask
{
    private readonly AdminUserOptions _options;
    private readonly IResidentRepository _residentRepository;
    private readonly IPasswordHasher _passwordHasher;

    public SeedAdminUserStartupTask(AdminUserOptions options, IResidentRepository residentRepository, IPasswordHasher passwordHasher)
    {
        _options = options;
        _residentRepository = residentRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var existingAdmin = await _residentRepository.GetResidentByUsername(_options.Username, cancellationToken);
        if (existingAdmin is not null)
        {
            return;
        }
        
        var passwordHash = _passwordHasher.Hash(_options.Password);
        var admin = new Resident()
        {
            Username = _options.Username,
            PasswordHash = passwordHash,
            FirstName = _options.FirstName,
            LastName = _options.LastName,
            HouseNumber = _options.HouseNumber,
            BirthDate = _options.DateOfBirth,
            Roles = new[] { "Admin" }
        };
        await _residentRepository.Create(admin, cancellationToken);
    }
}