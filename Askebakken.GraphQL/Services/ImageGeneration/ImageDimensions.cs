namespace Askebakken.GraphQL.Services.ImageGeneration;

public record ImageDimensions(int Width, int Height)
{
    public static ImageDimensions Default => new(1024, 1024);

    public override string ToString()
    {
        return $"{Width}x{Height}";
    }
}