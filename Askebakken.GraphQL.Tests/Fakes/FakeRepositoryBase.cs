namespace Askebakken.GraphQL.Tests.Fakes;

public abstract class FakeRepositoryBase<TData>
{
    protected readonly List<TData> MockData = new();
    
    public void AddMockData(params TData[] data)
    {
        MockData.AddRange(data);
    }
}