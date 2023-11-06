using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Askebakken.GraphQL.Services.ImageGeneration.OpenAPI;

public class OpenApiImageGenerationService : IImageGenerationService, IDisposable
{
    private const string BaseUrl = "https://api.openai.com/v1/images/generations";
    private readonly JsonSerializerOptions _openApiJsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };
    
    private readonly HttpClient _httpClient;

    public OpenApiImageGenerationService(IHttpClientFactory httpClientFactory, IOptions<OpenApiImageGenerationOptions> options)
    {
        _httpClient = httpClientFactory.CreateClient(nameof(OpenApiImageGenerationService) + "HttpClient");
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Askebakken.GraphQL");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", options.Value.ApiKey);
    }

    public async Task<MemoryStream[]> GenerateImageAsync(string text, int noImages = 1, ImageDimensions? dimensions = null,
        CancellationToken cancellationToken = default)
    {
        dimensions ??= ImageDimensions.Default;
        
        var openApiRequestBody = new OpenApiImageRequest()
        {
            Prompt = text,
            N = noImages,
            Size = dimensions.ToString(),
            ResponseFormat = "b64_json",
        };

        using var response = await SendRequest(openApiRequestBody, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new ApplicationException($"Could not generate image. Status code: {response.StatusCode} - {error}");
        }

        var content = await response.Content.ReadAsStreamAsync(cancellationToken);
        var result = await JsonSerializer.DeserializeAsync<OpenApiResponse<OpenApiImage[]>>(content, _openApiJsonSerializerOptions, cancellationToken: cancellationToken);

        if (result is null)
        {
            throw new ApplicationException("Could not deserialize response from OpenAI");
        }
        
        return result.Data.Select(i => new MemoryStream(Convert.FromBase64String(i.Base64Image))).ToArray();
    }

    private async Task<HttpResponseMessage> SendRequest(OpenApiImageRequest request, CancellationToken cancellationToken = default)
    {
        var json = JsonSerializer.Serialize(request, _openApiJsonSerializerOptions);
        using var content = new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes(json)));
        content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/json");

        return await _httpClient.PostAsync(BaseUrl, content, cancellationToken);
    }

    public void Dispose()
    {
        _httpClient.Dispose();
    }
}