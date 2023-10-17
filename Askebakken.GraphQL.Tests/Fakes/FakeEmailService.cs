using Askebakken.GraphQL.Services;

namespace Askebakken.GraphQL.Tests.Fakes;

public class FakeEmailService : IEmailService
{
    private readonly List<Email> _sentEmails = new();
    public IReadOnlyList<Email> SentEmails => _sentEmails;
    
    public Task Send(Email mailData, CancellationToken cancellationToken = default)
    {
        _sentEmails.Add(mailData);
        return Task.CompletedTask;
    }
}