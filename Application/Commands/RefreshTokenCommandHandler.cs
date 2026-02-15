using BasicAuth.Data;
using BasicAuth.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BasicAuth.Application.Commands;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenCommandResult>
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<RefreshTokenCommandResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Find the refresh token in database
        var refreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken, cancellationToken);

        // Validation checks
        if (refreshToken == null)
        {
            throw new UnauthorizedAccessException("Geçersiz refresh token");
        }

        if (refreshToken.IsRevoked)
        {
            throw new UnauthorizedAccessException("Bu token iptal edilmiş");
        }

        if (refreshToken.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token süresi dolmuş");
        }

        if (!refreshToken.User.IsActive)
        {
            throw new UnauthorizedAccessException("Kullanıcı hesabı aktif değil");
        }

        // Revoke the old refresh token (Rotation principle)
        refreshToken.IsRevoked = true;
        refreshToken.RevokedAt = DateTime.UtcNow;

        // Generate new tokens
        var newAccessToken = _jwtService.GenerateAccessToken(refreshToken.User);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        // Save new refresh token to database
        var newRefreshTokenEntity = new Domain.Entities.RefreshToken
        {
            Token = newRefreshToken,
            UserId = refreshToken.UserId,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(newRefreshTokenEntity);
        await _context.SaveChangesAsync(cancellationToken);

        return new RefreshTokenCommandResult
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            UserId = refreshToken.User.Id,
            Email = refreshToken.User.Email,
            FirstName = refreshToken.User.FirstName,
            LastName = refreshToken.User.LastName,
            Role = refreshToken.User.Role.ToString()
        };
    }
}
