using BasicAuth.Application.Commands;
using FluentValidation;

namespace BasicAuth.Application.Validators;

public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token gereklidir")
            .MinimumLength(10).WithMessage("Geçersiz refresh token formatı");
    }
}
