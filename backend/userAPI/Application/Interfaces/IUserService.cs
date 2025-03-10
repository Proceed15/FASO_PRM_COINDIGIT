public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int id);
    List<UserIdDTO> GetAllUsers();
    UserDTO? UpdateUser(int id, UserDTO userDto);
    UserDTO? ValidateUser(string email, string password);
    bool DeleteUser(string email, string password);
}