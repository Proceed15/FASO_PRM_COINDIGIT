using System;
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
        // Validation for required fields
        if (string.IsNullOrWhiteSpace(userDto.Name))
        {
            throw new ArgumentException("O nome é obrigatório.");
        }
        if (string.IsNullOrWhiteSpace(userDto.Email))
        {
            throw new ArgumentException("O email é obrigatório.");
        }
        if (string.IsNullOrWhiteSpace(userDto.Password))
        {
            throw new ArgumentException("A senha é obrigatória.");
        }

        // Check if email already exists
        var existingUser = _userRepository.GetByEmail(userDto.Email);
        if (existingUser != null)
        {
            throw new ArgumentException("Este email já está cadastrado.");
        }

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

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        };
    }

    public UserDTO? GetUserDetails(int id)
    {
        var user = _userRepository.GetById(id);
        return user != null ? new UserDTO
        {
            Id = user.Id,
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

    public UserDTO? GetUserByEmail(string email)
    {
        var user = _userRepository.GetByEmail(email);
        if (user == null) return null;
        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        };
    }

    public UserDTO? UpdateUser(int id, UserDTO userDto)
    {
        var user = _userRepository.GetById(id);
        if (user == null) return null;

        user.Name = userDto.Name;
        user.Email = userDto.Email;
        user.Phone = userDto.Phone;
        user.Address = userDto.Address;

        if (!string.IsNullOrEmpty(userDto.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        }

        user.Photo = userDto.Photo;

        _userRepository.Update(user);

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        };
    }

    public bool DeleteUser(int id)
    {
        var user = _userRepository.GetById(id);
        if (user == null) return false;
        _userRepository.Delete(id);
        return true;
    }

    public UserDTO? ValidateUser(string email, string password)
    {
        var user = _userRepository.GetByEmail(email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            return null;
        }

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }
}
