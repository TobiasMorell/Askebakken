namespace Askebakken.GraphQL.Schema.Errors;

public class MenuPlanAlreadyExistsErrors : Exception
{
    private readonly DateTime _date;
    
    public MenuPlanAlreadyExistsErrors(DateTime date) : this($"A menu plan for date '{date}' already exists.")
    {
        _date = date;
    }

    private MenuPlanAlreadyExistsErrors(string message) : base(message)
    {
    }
}