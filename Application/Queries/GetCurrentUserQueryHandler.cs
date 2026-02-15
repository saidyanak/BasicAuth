using BasicAuth.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BasicAuth.Application.Queries;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, GetCurrentUserQueryResult>
{
    private readonly AppDbContext _context;

    public GetCurrentUserQueryHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetCurrentUserQueryResult> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException("Kullanıcı bulunamadı");
        }

        return new GetCurrentUserQueryResult
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt
        };
    }
}
