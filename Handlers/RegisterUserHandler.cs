using MediatR;
using CqrsAuthProject.Data;
using CqrsAuthProject.Models;
using BCrypt.Net;

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, string>
{
    private readonly AppDbContext _context;

    public RegisterUserHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        // 🔐 Hash the password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            Password = hashedPassword
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return "User Registered Successfully";
    }
}