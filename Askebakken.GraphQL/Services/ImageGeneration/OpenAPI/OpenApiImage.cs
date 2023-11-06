using System.Text.Json.Serialization;

namespace Askebakken.GraphQL.Services.ImageGeneration.OpenAPI;

public class OpenApiImage
{
    [JsonPropertyName("b64_json")]
    public string Base64Image { get; set; }
}