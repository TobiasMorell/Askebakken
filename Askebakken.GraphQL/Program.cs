using System.Text;
using Askebakken.GraphQL.Extensions;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Repository.MenuPlan;
using Askebakken.GraphQL.Repository.Recipe;
using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Services.PasswordHasher;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var mongoOptions = builder.Configuration.GetSection(nameof(MongoDbConnectionOptions)).Get<MongoDbConnectionOptions>();
if (mongoOptions is null)
{
    throw new ApplicationException("MongoDbConnectionOptions is null. Please set them via appsettings");
}

var authOptions = builder.Configuration.GetSection(nameof(JwtAuthenticationOptions)).Get<JwtAuthenticationOptions>();
if (authOptions is null)
{
    throw new ApplicationException("JwtAuthenticationOptions is null. Please set them via appsettings");
}

builder.Services.AddSingleton(authOptions);
var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authOptions.Secret));

builder.Services.AddCors();

builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(nameof(EmailOptions))).AddTransient<IEmailService, EmailService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.IncludeErrorDetails = builder.Environment.IsDevelopment();
    options.TokenValidationParameters = new()
    {
        ValidIssuer = authOptions.Issuer,
        ValidateIssuer = true,
        ValidAudience = authOptions.Audience,
        ValidateAudience = true,
        IssuerSigningKey = authSigningKey,
        ValidateIssuerSigningKey = authOptions.ValidateSigningKey,
    };
});
builder.Services.AddAuthorization()
    .AddSingleton<IPasswordHasher, DefaultPasswordHasher>()
    .AddHttpContextAccessor()
    .AddTransient<IUserService, UserService>();

builder.Services
    .AddSingleton<IRecipeRepository, MongoRecipeRepository>()
    .AddSingleton<IResidentRepository, MongoResidentRepository>()
    .AddSingleton<IMenuPlanRepository, MongoMenuPlanRepository>()
    .AddSingleton<IMenuPlannerService, MenuPlannerService>()
    .AddMongoDb(mongoOptions)
    .AddGraphQLServer().AddMongoDbPagingProviders().AddMongoQueryProviders().AddInMemorySubscriptions()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment()).AddAuthorization();

var app = builder.Build();

app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseWebSockets();
app.UseAuthentication();
app.UseAuthorization();
app.MapGraphQL();

app.Run();