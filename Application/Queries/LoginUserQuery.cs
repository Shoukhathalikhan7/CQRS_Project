using MediatR;

public record LoginUserQuery(string Email, string Password) : IRequest<object?>;