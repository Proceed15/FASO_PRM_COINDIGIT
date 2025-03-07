public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int id);
    UserIdDTO[] GetAllUsers();
    Task UpdateUserAsync(User user);
    Task EditUserAsync(User user);
    Task DeleteUserAsync(int userId);
}