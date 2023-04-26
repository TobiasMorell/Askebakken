using Askebakken.GraphQL.Options;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Askebakken.GraphQL.Services;

public record Email(string Address,
    string EmailToName,
    string Subject,
    string Body)
{
    public string? Preview { get; init; }
};

public interface IEmailService
{
    Task Send(Email mailData, CancellationToken cancellationToken = default);
}

public class EmailService : IEmailService
{
    private readonly EmailOptions _emailOptions;
    
    public EmailService(IOptions<EmailOptions> options)
    {
        _emailOptions = options.Value;
    }

    public async Task Send(Email email, CancellationToken cancellationToken = default)
    {
        using var emailMessage = new MimeMessage();
        var emailFrom = new MailboxAddress(_emailOptions.SenderName, _emailOptions.SenderEmail);
        emailMessage.From.Add(emailFrom);
        var emailTo = new MailboxAddress(email.EmailToName, email.Address);
        emailMessage.To.Add(emailTo);

        emailMessage.Subject = email.Subject;

        var emailBodyBuilder = new BodyBuilder { HtmlBody = email.Body, TextBody = email.Preview };

        emailMessage.Body = emailBodyBuilder.ToMessageBody();
        //this is the SmtpClient from the Mailkit.Net.Smtp namespace, not the System.Net.Mail one
        using var mailClient = new SmtpClient();
        await mailClient.ConnectAsync(_emailOptions.Server, _emailOptions.Port, MailKit.Security.SecureSocketOptions.StartTls, cancellationToken);
        await mailClient.AuthenticateAsync(_emailOptions.UserName, _emailOptions.Password, cancellationToken);
        await mailClient.SendAsync(emailMessage, cancellationToken);
        await mailClient.DisconnectAsync(true, cancellationToken);
    }
}