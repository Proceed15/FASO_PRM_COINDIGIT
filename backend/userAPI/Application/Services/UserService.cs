using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

public class UserService : IUserService
{
    //Services for Users
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public UserDTO RegisterUser(UserDTO userDto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        var user = new User 
        { 
            Name = userDto.Name, 
            Email = userDto.Email,
            Phone = userDto.Phone,
            Address = userDto.Address,
            Password = hashedPassword,
            Photo = userDto.Photo
        };
        _userRepository.Add(user);

        return new userDto
        {
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            PasswordHasher = user.PasswordH,
            Photo = user.Photo
        };
    }

    public UserDTO? GetUserDetails(int id)
    {
        var user = _userRepository.GetById(id);
        return user != null ? new UserDTO 
        { 
            Name = user.Name, 
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        } : null;
    }

    public List<UserDTO> GetAllUsers()
    {
        return _userRepository.GetAll().Select(User => new UserDTO
        {
            Id = User.Id,
            Name = User.Name,
            Email = User.Email,
            Phone = User.Phone,
            Address = User.Address,
            Password = User.Password,
            Photo = User.Photo
        }).ToList();
    }

    public bool DeleteUser(int userId)
    {
        var user = _userRepository.GetById(id);
        if (user == null) return false;
        _userRepository.Delete(id);
        return true;
    }
    public UserDTO? UpdateUser(int id, UserDTO userDto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        var user = _userRepository.GetById(id);
        if (user == null) return null;

        user.Name = userDto.Name;
        user.Email = userDto.Email;
        user.Phone = userDto.Phone;
        user.Address = userDto.Address;
        user.Password = hashedPassword;
        user.Photo = userDto.Photo;

        _userRepository.Update(user);

        return new userDTO
        {
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        }
    }
    public async Task EditUserAsync( User user)
    {
        await _userRepository.EditUserAsync(user);
    }

    public UserDTO? ValidateUser(string email, string password)
    {
        var user = _userRepository.GetByEmail(email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {return null;}

        return new UserDTO
        {
            Name = user.Name,
            Email = user.EMail,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }
}