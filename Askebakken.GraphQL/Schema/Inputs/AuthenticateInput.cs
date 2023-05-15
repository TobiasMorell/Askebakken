using System.ComponentModel.DataAnnotations;

namespace Askebakken.GraphQL.Schema.Inputs;

public class AuthenticateInput
{
    [Required]
    public required string Username { get; set; }
    [Required]
    public required string Password { get; set; }
}