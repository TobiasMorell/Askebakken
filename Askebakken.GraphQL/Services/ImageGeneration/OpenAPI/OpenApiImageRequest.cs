using System.Text.Json.Serialization;

namespace Askebakken.GraphQL.Services.ImageGeneration.OpenAPI;

public class OpenApiResponse<TData>
{
    public TData Data { get; set; }
}

public class OpenApiImageRequest
{
    public string Prompt { get; set; }
    public int N { get; set; }
    public string Size { get; set; }
    [JsonPropertyName("response_format")]
    public string ResponseFormat { get; set; }
}