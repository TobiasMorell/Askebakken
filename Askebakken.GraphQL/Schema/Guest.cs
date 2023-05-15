namespace Askebakken.GraphQL.Schema;

public class Guest
{
    public required string HouseNumber { get; set; }
    public int NumberOfAdultGuests { get; set; }
    public int NumberOfChildGuests { get; set; }
}