using MediatR;

namespace BasicAuth.Application.Queries;

public class GetCurrentUserQuery : IRequest<GetCurrentUserQueryResult>
{
    public int UserId { get; set; }
}

public class GetCurrentUserQueryResult
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
