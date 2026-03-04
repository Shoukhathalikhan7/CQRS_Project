using MediatR;
using CqrsAuthProject.Models;

namespace CqrsAuthProject.Application.Queries;

public class GetAllUsersQuery : IRequest<List<User>>
{
}