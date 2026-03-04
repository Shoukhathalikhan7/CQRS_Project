using MediatR;

public record RegisterUserCommand(string Username, string Email, string Password) : IRequest<string>;