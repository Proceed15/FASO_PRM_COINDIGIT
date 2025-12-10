public interface IUserService
{
    UserDTO RegisterUser(UserDTO userDto);
    UserDTO? GetUserDetails(int Id);
    List<UserDTO> GetAllUsers();
    // UserDTO? GetUserByEmail(string email);
    UserDTO? UpdateUser(int Id, UserDTO userDto);
    UserDTO? ValidateUser(string email, string password);
    bool DeleteUser(int Id);
}
