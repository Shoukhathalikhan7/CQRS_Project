using MediatR;
using Microsoft.EntityFrameworkCore;
using CqrsAuthProject.Data;
using CqrsAuthProject.Models;
using CqrsAuthProject.Application.Queries;

namespace CqrsAuthProject.Handlers;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<User>>
{
    private readonly AppDbContext _context;

    public GetAllUsersHandler(AppDbContext context)
    {
        _context = context;
    }

public async Task<List<User>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
{
    return await _context.Users
        .Where(u => u.Role == "User")
        .ToListAsync();
}
}