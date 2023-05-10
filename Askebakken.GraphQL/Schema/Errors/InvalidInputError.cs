namespace Askebakken.GraphQL.Schema.Errors;

public class InvalidInputError : Exception
{
    public string FieldName { get; set; }

    public InvalidInputError(string fieldName)
    {
        FieldName = fieldName;
    }
}