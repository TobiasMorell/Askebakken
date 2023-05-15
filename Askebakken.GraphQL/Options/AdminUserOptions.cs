namespace Askebakken.GraphQL.Options;

public class AdminUserOptions
{
    public bool SeedAdminUser { get; set; }
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string HouseNumber { get; set; } = "";
    public DateTime DateOfBirth { get; set; }
}