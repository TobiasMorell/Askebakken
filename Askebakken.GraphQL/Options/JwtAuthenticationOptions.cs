namespace Askebakken.GraphQL.Options;

public class JwtAuthenticationOptions
{
    public string Secret { get; set; } = ""; // Validated in Program.cs
    public string? Issuer { get; set; }
    public string? Audience { get; set; }
    public bool ValidateSigningKey { get; set; }
    public int ExpirationMinutes { get; set; }
}