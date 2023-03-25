namespace Askebakken.GraphQL.Schema.Errors;

public class UsernameAlreadyTakenError : Exception
{
    public UsernameAlreadyTakenError()
    {
    }

    public UsernameAlreadyTakenError(string message) : base(message)
    {
    }

    public UsernameAlreadyTakenError(string message, Exception inner) : base(message, inner)
    {
    }
}