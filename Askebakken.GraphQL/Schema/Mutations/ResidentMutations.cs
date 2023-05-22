using System.Security.Authentication;
using System.Security.Cryptography;
using Askebakken.GraphQL.Repository.Resident;
using Askebakken.GraphQL.Schema.Errors;
using Askebakken.GraphQL.Schema.Inputs;
using Askebakken.GraphQL.Schema.Results;
using Askebakken.GraphQL.Services;
using Askebakken.GraphQL.Services.PasswordHasher;
using HotChocolate.Authorization;

namespace Askebakken.GraphQL.Schema.Mutations;

public record AuthenticateResult(string Token);

[ExtendObjectType("Mutation")]
public class ResidentMutations
{
    private readonly IResidentRepository _residentRepository;
    private readonly IAuthenticationService _authenticationService;
    private readonly IPasswordHasher _passwordHasher;

    public ResidentMutations(IResidentRepository residentRepository,
        IAuthenticationService authenticationService,
        IPasswordHasher passwordHasher)
    {
        _residentRepository = residentRepository;
        _authenticationService = authenticationService;
        _passwordHasher = passwordHasher;
    }

#if DEBUG
    [Authorize(Roles = new[] { "Admin" })]
    public async Task<SuccessResult> TestEmail([Service] IEmailService emailService,
        [Service] IUserService userService,
        string template,
        CancellationToken cancellationToken = default)
    {
        var user = await userService.GetAuthenticatedUser(cancellationToken);
        if (user is null)
        {
            throw new AuthenticationException();
        }

        var email = template.ToUpperInvariant() switch
        {
            "FORGOT_PASSWORD" => GetPasswordResetEmailTemplate(user, "{NEW_PASSWORD}"),
            "WELCOME" => GetResidentWelcomeEmailTemplate(user, "{PASSWORD}", user),
            "CHANGE_PASSWORD" => GetChangePasswordEmailTemplate(user),
            _ => throw new ArgumentOutOfRangeException(nameof(template), template, "Unknown template")
        };

        await emailService.Send(
            new Email(user.Username, $"{user.FirstName} {user.LastName}", $"Test af '{template}'", email),
            cancellationToken);
        return new(true);
    }
#endif

    [Error<UsernameAlreadyTakenError>]
    [Authorize(Roles = new[] { "Admin" })]
    public async Task<Resident> CreateResident(CreateResidentInput resident,
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _residentRepository.GetResidentByUsername(resident.Username, cancellationToken);
        if (existingUser is not null)
        {
            throw new UsernameAlreadyTakenError(resident.Username);
        }

        var actualResident = new Resident
        {
            Username = resident.Username,
            PasswordHash = _passwordHasher.Hash(Guid.NewGuid().ToString("N")),
            FirstName = resident.FirstName,
            LastName = resident.LastName,
            HouseNumber = resident.HouseNumber,
        };
        return await _residentRepository.Create(actualResident, cancellationToken: cancellationToken);
    }

    [Error<AuthenticationException>]
    public async Task<AuthenticateResult> Authenticate([Service] ITokenService tokenService,
        AuthenticateInput authenticateInput,
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _authenticationService.GetResidentByUsernameAndPassword(authenticateInput.Username,
            authenticateInput.Password, cancellationToken);

        return new(tokenService.GetToken(existingUser));
    }

    public async Task<SuccessResult> ForgotPassword([Service] IEmailService emailService,
        ForgotPasswordInput forgotPasswordInput,
        CancellationToken cancellationToken)
    {
        var existingUser =
            await _residentRepository.GetResidentByUsername(forgotPasswordInput.Username, cancellationToken);
        if (existingUser is null)
        {
            await Task.Delay(TimeSpan.FromMilliseconds(RandomNumberGenerator.GetInt32(200, 1000)), cancellationToken);
            return new(true);
        }

        var newPassword = Guid.NewGuid().ToString("N")[..8];
        existingUser.PasswordHash = _passwordHasher.Hash(newPassword);
        await _residentRepository.Update(existingUser, cancellationToken);

        await emailService.Send(
            new Email(existingUser.Username, $"{existingUser.FirstName} {existingUser.LastName}",
                "Nyt kodeord til Askebakkens beboerportal", GetPasswordResetEmailTemplate(existingUser, newPassword))
            {
                Preview = $"Din nye kode er {newPassword}",
            }, cancellationToken);

        return new(true);
    }

    [Error<AuthenticationException>]
    public async Task<SuccessResult> ChangePassword([Service] IEmailService emailService,
        ChangePasswordInput input,
        CancellationToken cancellationToken = default)
    {
        var user = await _authenticationService.GetResidentByUsernameAndPassword(input.Username, input.OldPassword,
            cancellationToken);

        user.PasswordHash = _passwordHasher.Hash(input.NewPassword);
        await _residentRepository.Update(user, cancellationToken);

        await emailService.Send(
            new Email(user.Username, $"{user.FirstName} {user.LastName}",
                "Dit kodeord til Askebakkens beboerportal er blevet ændret", GetChangePasswordEmailTemplate(user))
            {
                Preview = "Dit kodeord er blevet ændret",
            }, cancellationToken);

        return new(true);
    }

    private string GetChangePasswordEmailTemplate(Resident user) =>
        $"""
{EmailHeader(user)}

<p>Du har bedt om at få ændret dit kodeord til Askebakkens beboerportal.</p>

<p>Hvis du ikke har bedt om dette, så kontakt venligst en administrator.</p>
""";

    private string GetPasswordResetEmailTemplate(Resident resident, string newPassword) =>
        $"""
{EmailHeader(resident)}

<p>Du har bedt om at få nulstillet dit kodeord til Askebakkens beboerportal.</p>

<p>Dit nye kodeord er: <strong>{newPassword}</strong></p>

<p><i>Vi anbefaler at du skifter dit kodeord, når du har logget ind.</i></p>

<a href="https://beboer.askebakken.dk" style="padding: 16px;color: white;background-color: #38A169;border-radius: 8px;">Åben Askebakkens beboerportal</a>

<p>Med venlig hilsen</p>

<p>Askebakkens beboerportal</p>
""";

    private string GetResidentWelcomeEmailTemplate(Resident resident, string password, Resident creator) => $"""
{EmailHeader(resident)}
<table border=0 cellspacing="0" cellpadding="0" style="background-color: white">
    <tr>
        <td>
            <p>Velkommen til Askebakkens beboerportal. Du er blevet oprettet som bruger af {creator.FirstName}.</p>

            <p>Du kan logge ind med følgende oplysninger<br />Brugernavn: {resident.Username}<br/>Kodeord: <strong>{password}</strong></p>
            <p><i>Vi anbefaler at du skifter dit kodeord, når du har logget ind.</i></p>

            <br />
            <a href="https://beboer.askebakken.dk" style="padding: 16px;color: white;background-color: #38A169;border-radius: 8px;">Åben Askebakkens beboerportal</a>
            <br />

            <p>På Askebakkens beboerportal kan du:</p>
            <ul>
                <li>Oprette madplaner</li>
                <li>Tilmelde dig til spisning</li>
                <li>Se hvem der er tilmeldt til spisning</li>
                <li>Tilmelde dig til madlavning</li>
            </ul>

            <p>På sigt er det planen at Askebakkens beboerportal automatisk skal kunne:</p>
            <ul>
                <li>Udregne det månedlige madbudget pr. beboer</li>
                <li>Lave optælling af madlavning</li>
                <li>Planlægge hvem der laver madplan</li>
                <li>Samt meget andet, hvis der er interesse for det</li>
            </ul>

            <p>Vi håber at du vil tage godt imod Askebakkens beboerportal.</p>

            <p>Med venlig hilsen<br>Tobias Morell</p>
        </td>
    </tr>
</table>
""";
    
    private static string EmailHeader(Resident resident) => $"""
<table border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td align="center">
            <img src="https://askebakken.dk/wp-content/uploads/2021/03/asketrae.png" style="height: 64px; width: auto; padding-left: 16px;" />
        </td>
        <td style="padding-left: 8px">
            <strong>Hej {resident.FirstName} {resident.LastName}</strong>
        </td>
    </tr>
</table>
""";
}
