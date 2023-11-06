using Askebakken.GraphQL.Extensions;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Repository.MenuPlan;
using Askebakken.GraphQL.Repository.Recipe;
using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.StartupTasks;

var builder = WebApplication.CreateBuilder(args);

var authOptions = GetRequiredOptions<JwtAuthenticationOptions>(builder.Configuration);
if (string.IsNullOrEmpty(authOptions.Secret))
    throw new ApplicationException("JwtAuthenticationOptions.Secret is null. Please set them via appsettings");

builder.Services.AddJwtAuthentication(authOptions);
builder.Services.AddLogging(o => o.AddDebug().AddConsole().AddConfiguration(builder.Configuration.GetSection("Logging"))
    .SetMinimumLevel(LogLevel.Information)
);

var corsOptions = GetRequiredOptions<CorsOptions>(builder.Configuration);
builder.Services.AddCors(cors =>
{
    Console.WriteLine("Allowed origins: " + string.Join(", ", corsOptions.AllowedOrigins));
    if (!corsOptions.AllowedOrigins.Any())
        cors.AddDefaultPolicy(corsBuilder => { corsBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); });
    else
        cors.AddDefaultPolicy(
            corsBuilder =>
            {
                corsBuilder.WithOrigins(corsOptions.AllowedOrigins).AllowAnyHeader().AllowAnyMethod()
                    .AllowCredentials();
            });
});

builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(nameof(EmailOptions)))
    .AddTransient<IEmailService, EmailService>();

var mongoOptions = GetRequiredOptions<MongoDbConnectionOptions>(builder.Configuration);
builder.Services.AddSingleton<IRecipeRepository, MongoRecipeRepository>()
    .AddSingleton<IResidentRepository, MongoResidentRepository>()
    .AddSingleton<IMenuPlanRepository, MongoMenuPlanRepository>()
    .AddSingleton<IMenuPlannerService, MenuPlannerService>().AddMongoDb(mongoOptions);

builder.Services.AddGraphQLServer().AddMongoDbPagingProviders().AddMongoQueryProviders().AddInMemorySubscriptions()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment()).AddAuthorization();

try
{
    var adminOptions = GetRequiredOptions<AdminUserOptions>(builder.Configuration);
    builder.Services.AddSingleton(adminOptions).AddStartupTask<SeedAdminUserStartupTask>();
}
catch (ApplicationException)
{
    // Ignore
}

var app = builder.Build();

app.UseCors();

app.UseWebSockets();
app.UseAuthentication();
app.UseAuthorization();
app.MapGraphQL();

await app.Services.ExecuteStartupTasks();

app.Run();

TOptions GetRequiredOptions<TOptions>(IConfiguration configuration)
{
    var optionsName = typeof(TOptions).Name;
    var options = configuration.GetSection(optionsName).Get<TOptions>();
    if (options is null) throw new ApplicationException($"{optionsName} is null. Please set them via appsettings");

    return options;
}