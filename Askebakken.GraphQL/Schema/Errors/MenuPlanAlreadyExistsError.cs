namespace Askebakken.GraphQL.Schema.Errors;

public class MenuPlanAlreadyExistsError : Exception
{
    public DateTime Date { get; private set; }
    
    public MenuPlanAlreadyExistsError(DateTime date) : this($"A menu plan for date '{date}' already exists.")
    {
        Date = date;
    }

    private MenuPlanAlreadyExistsError(string message) : base(message)
    {
    }
}