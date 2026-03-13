using MediatR;
using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using CqrsAuthProject.Models;
using CqrsAuthProject.Application.Queries;

namespace CqrsAuthProject.Handlers;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<User>>
{
    private readonly IConfiguration _configuration;

    public GetAllUsersHandler(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<List<User>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        using IDbConnection db = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

        var sql = "SELECT * FROM Users WHERE Role = @Role";

        var users = await db.QueryAsync<User>(sql, new { Role = "User" });

        return users.ToList();
    }
}