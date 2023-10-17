using System.ComponentModel.DataAnnotations;

namespace Askebakken.GraphQL.Schema.Inputs;

public class CreateResidentInput
{
    [EmailAddress]
    [Required]
    [MaxLength(100)]
    public required string Username { get; set; }
    [MaxLength(50)]
    public string? FirstName { get; set; }
    [MaxLength(50)]
    public string? LastName { get; set; }
    [Required]
    [MinLength(1)]
    [MaxLength(6)]
    public required string HouseNumber { get; set; }

    public bool SendWelcomeEmail { get; set; } = false;
}