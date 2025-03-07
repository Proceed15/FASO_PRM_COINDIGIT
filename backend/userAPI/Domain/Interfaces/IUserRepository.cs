public interface IUserRepository
{
    void Add(User user);
    User? GetById(int id);
    List<User>? ListAll();
    Task DeleteUserAsync(int userId);
    Task UpdateUserAsync(User user);
    Task EditUserAsync(User user);
}