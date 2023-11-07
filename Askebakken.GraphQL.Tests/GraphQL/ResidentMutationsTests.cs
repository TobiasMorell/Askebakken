using System.Security.Authentication;
using Askebakken.GraphQL.Options;
using Askebakken.GraphQL.Schema;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Schema.Inputs;
using Askebakken.GraphQL.Schema.Mutations;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Services.PasswordHasher;
using Askebakken.GraphQL.Tests.Fakes;
using Microsoft.Extensions.Logging.Abstractions;

namespace Askebakken.GraphQL.Tests;

public class ResidentMutationsTests
{
    private readonly ResidentMutations _mutations;

    private readonly FakeResidentRepository _residentRepository = new();
    private readonly IAuthenticationService _authenticationService;
    private readonly IPasswordHasher _passwordHasher = new DefaultPasswordHasher();
    private readonly FakeEmailService _emailService = new();

    public ResidentMutationsTests()
    {
        _authenticationService = new AuthenticationService(_residentRepository, _passwordHasher);

        _mutations = new ResidentMutations(_residentRepository, _authenticationService, _passwordHasher);
    }

    [Fact]
    public async Task CreateResident_creates_resident_if_username_is_not_taken()
    {
        // Arrange
        var resident = SampleCreateUserInput();

        // Act
        var result = await _mutations.CreateResident(_emailService, resident);

        // Assert
        _residentRepository.CreatedResidents.ShouldHaveSingleItem().Username.ShouldBe(result.Username);
    }

    [Fact]
    public async Task CreateResident_returns_newly_created_resident_information()
    {
        // Arrange
        var resident = SampleCreateUserInput();

        // Act
        var result = await _mutations.CreateResident(_emailService, resident);

        // Assert
        result.ShouldNotBeNull();
        result.FirstName.ShouldBe(resident.FirstName);
        result.LastName.ShouldBe(resident.LastName);
        result.Username.ShouldBe(resident.Username);
        result.HouseNumber.ShouldBe(resident.HouseNumber);
        result.CreatedAt.ShouldBe(DateTime.UtcNow, TestConstants.DateTimeTolerance);
        result.ModifiedAt.ShouldBe(DateTime.UtcNow, TestConstants.DateTimeTolerance);
    }

    [Fact]
    public async Task CreateResident_throws_UsernameAlreadyTakenError_if_username_is_taken()
    {
        // Arrange
        var resident = SampleCreateUserInput();
        _residentRepository.AddMockData(new Resident()
        {
            Username = resident.Username,
            HouseNumber = resident.HouseNumber,
            PasswordHash = "1234"
        });

        // Act & Assert
        await Should.ThrowAsync<UsernameAlreadyTakenError>(() => _mutations.CreateResident(_emailService, resident));
    }

    [Fact]
    public async Task CreateResident_does_not_send_welcome_email_if_SendWelcomeEmail_is_false()
    {
        // Arrange
        var resident = SampleCreateUserInput();

        // Act
        await _mutations.CreateResident(_emailService, resident);

        // Assert
        _emailService.SentEmails.ShouldBeEmpty();
    }

    [Fact]
    public async Task CreateResident_sends_welcome_email_if_SendWelcomeEmail_is_true()
    {
        // Arrange
        var resident = SampleCreateUserInput(true);

        // Act
        var result = await _mutations.CreateResident(_emailService, resident);

        // Assert
        var email = _emailService.SentEmails.ShouldHaveSingleItem();
        email.Address.ShouldBe(result.Username);
        email.EmailToName.ShouldBe("Test Testesen");
    }

    [Fact]
    public async Task Authenticate_returns_AuthenticateResult_if_username_and_password_is_correct()
    {
        // Arrange
        const string password = "this is a password for the test";
        var resident = CreateSampleResident(password);
        _residentRepository.AddMockData(resident);
        var authenticateInput = new AuthenticateInput()
        {
            Username = resident.Username,
            Password = password
        };
        var tokenService = GetTokenService();

        // Act
        var result = await _mutations.Authenticate(tokenService, authenticateInput);

        // Assert
        result.ShouldNotBeNull();
        result.Token.ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Authenticate_throws_AuthenticationException_if_username_is_not_found()
    {
        // Arrange
        const string password = "this is a password for the test";
        var resident = CreateSampleResident(password);
        _residentRepository.AddMockData(resident);
        var authenticateInput = new AuthenticateInput()
        {
            Username = "this username does not exist",
            Password = password
        };
        var tokenService = GetTokenService();

        // Act & Assert
        await Should.ThrowAsync<AuthenticationException>(() =>
            _mutations.Authenticate(tokenService, authenticateInput));
    }

    [Fact]
    public async Task Authenticate_throws_AuthenticationException_if_password_is_incorrect()
    {
        // Arrange
        const string password = "this is a password for the test";
        var resident = CreateSampleResident(password);
        _residentRepository.AddMockData(resident);
        var authenticateInput = new AuthenticateInput()
        {
            Username = resident.Username,
            Password = "this is not the correct password"
        };
        var tokenService = GetTokenService();

        // Act & Assert
        await Should.ThrowAsync<AuthenticationException>(() =>
            _mutations.Authenticate(tokenService, authenticateInput));
    }

    [Fact]
    public async Task ForgotPassword_returns_success_when_username_is_not_found()
    {
        // Arrange
        var forgotPasswordInput = new ForgotPasswordInput("this username does not exist");

        // Act
        var result = await _mutations.ForgotPassword(_emailService, forgotPasswordInput);

        // Assert
        result.Success.ShouldBeTrue();
    }

    [Fact]
    public async Task ForgotPassword_sends_email_with_new_password_if_username_is_valid()
    {
        // Arrange
        var resident = CreateSampleResident("this is a password for the test");
        _residentRepository.AddMockData(resident);
        var forgotPasswordInput = new ForgotPasswordInput(resident.Username);

        // Act
        var result = await _mutations.ForgotPassword(_emailService, forgotPasswordInput);

        // Assert
        result.Success.ShouldBeTrue();
        var email = _emailService.SentEmails.ShouldHaveSingleItem();
        email.Address.ShouldBe(resident.Username);
        email.EmailToName.ShouldBe("Test Testesen");
    }

    [Fact]
    public async Task ChangePassword_throws_AuthenticationException_if_old_password_is_incorrect()
    {
        // Arrange
        const string password = "this is a password for the test";
        var resident = CreateSampleResident(password);
        _residentRepository.AddMockData(resident);
        var changePasswordInput = new ChangePasswordInput(resident.Username, "this is not the correct password",
            "this is the new password");

        // Act & Assert
        await Should.ThrowAsync<AuthenticationException>(() =>
            _mutations.ChangePassword(_emailService, changePasswordInput));
    }

    [Fact]
    public async Task ChangePassword_changes_password_if_old_password_is_correct()
    {
        // Arrange
        const string password = "this is a password for the test";
        const string newPassword = "this is the new password";
        var resident = CreateSampleResident(password);
        _residentRepository.AddMockData(resident);
        var changePasswordInput = new ChangePasswordInput(resident.Username, password, newPassword);

        // Act
        var result = await _mutations.ChangePassword(_emailService, changePasswordInput);

        // Assert
        result.Success.ShouldBeTrue();
        var updatedResident = _residentRepository.UpdatedResidents.ShouldHaveSingleItem();
        updatedResident.PasswordHash.ShouldNotBe(password);
        updatedResident.PasswordHash.ShouldNotBe(newPassword);
    }

    [Fact]
    public async Task ChangePassword_sends_email_notification_to_resident()
    {
        // Arrange
        const string password = "this is a password for the test";
        const string newPassword = "this is the new password";
        var resident = CreateSampleResident(password);
        _residentRepository.AddMockData(resident);
        var changePasswordInput = new ChangePasswordInput(resident.Username, password, newPassword);

        // Act
        var result = await _mutations.ChangePassword(_emailService, changePasswordInput);

        // Assert
        result.Success.ShouldBeTrue();
        var email = _emailService.SentEmails.ShouldHaveSingleItem();
        email.Address.ShouldBe(resident.Username);
        email.EmailToName.ShouldBe("Test Testesen");
    }

    private CreateResidentInput SampleCreateUserInput(bool sendWelcomeEmail = false)
    {
        return new CreateResidentInput
        {
            FirstName = "Test",
            LastName = "Testesen",
            Username = "test-user",
            HouseNumber = "1A",
            SendWelcomeEmail = sendWelcomeEmail
        };
    }

    private Resident CreateSampleResident(string password)
    {
        return new Resident
        {
            Id = Guid.NewGuid(),
            FirstName = "Test",
            LastName = "Testesen",
            Username = "test-user",
            HouseNumber = "1A",
            PasswordHash = _passwordHasher.Hash(password)
        };
    }

    private ITokenService GetTokenService()
    {
        return new JwtTokenService(new JwtAuthenticationOptions()
        {
            Secret = "this-is-very-very-secret",
            Audience = "https://unit.tests",
            Issuer = "https://unit.tests",
            ExpirationMinutes = 60,
            ValidateSigningKey = true
        }, new NullLoggerFactory());
    }
}