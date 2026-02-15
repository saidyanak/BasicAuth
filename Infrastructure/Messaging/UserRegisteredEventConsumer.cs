using BasicAuth.Domain.Events;
using MassTransit;

namespace BasicAuth.Infrastructure.Messaging;

public class UserRegisteredEventConsumer : IConsumer<UserRegisteredEvent>
{
    private readonly ILogger<UserRegisteredEventConsumer> _logger;

    public UserRegisteredEventConsumer(ILogger<UserRegisteredEventConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<UserRegisteredEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation("===========================================");
        _logger.LogInformation("📧 Hoş Geldin Maili Gönder command alındı!");
        _logger.LogInformation("Kullanıcı ID: {UserId}", message.UserId);
        _logger.LogInformation("Email: {Email}", message.Email);
        _logger.LogInformation("İsim: {FirstName} {LastName}", message.FirstName, message.LastName);
        _logger.LogInformation("Kayıt Tarihi: {RegisteredAt}", message.RegisteredAt);
        _logger.LogInformation("===========================================");

        // Simüle edilmiş email gönderme işlemi
        await Task.Delay(1000); // Email servisi simülasyonu

        _logger.LogInformation("✅ Hoş geldin maili başarıyla '{Email}' adresine gönderildi!", message.Email);
    }
}
