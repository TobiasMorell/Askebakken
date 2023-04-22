namespace Askebakken.GraphQL.Schema.Mutations;

public class AuthenticateInput
{
    public string Username { get; set; }
    public string Password { get; set; }
}