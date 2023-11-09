namespace Askebakken.GraphQL.Schema.Errors;

public class NoCommonDinnerOnWeekendsError : Exception
{
    public NoCommonDinnerOnWeekendsError()
    {
    }

    public NoCommonDinnerOnWeekendsError(string message) : base(message)
    {
    }

    public NoCommonDinnerOnWeekendsError(string message, Exception inner) : base(message, inner)
    {
    }
}