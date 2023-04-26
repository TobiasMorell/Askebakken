using System.ComponentModel.DataAnnotations;

namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateResidentInput
{
    [EmailAddress]
    public string Username { get; set; }
    public string Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string HouseNumber { get; set; }
}