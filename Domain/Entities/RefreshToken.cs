using System.ComponentModel.DataAnnotations;

namespace BasicAuth.Domain.Entities;

public class RefreshToken : BaseEntity
{
    [Required]
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; } = false;

    public DateTime? RevokedAt { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public bool IsActive => !IsRevoked && ExpiresAt > DateTime.UtcNow;
}
