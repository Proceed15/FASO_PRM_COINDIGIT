using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
[ApiController]
[Route("api/[controller]")]

public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public IActionResult RegisterUser(UserDTO userDto)
    {
        try
        {
            var result = _userService.RegisterUser(userDto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor." });
        }
    }

    [Authorize]
    [HttpGet]
    public IActionResult getAllUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }
    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetUserDetails(int id)
    {
        var user = _userService.GetUserDetails(id);
        return user != null ? Ok(user) : NotFound();
    }

    // [HttpGet("email/{email}")]
    // public IActionResult GetUserByEmail(string email)
    // {
    //     var user = _userService.GetUserByEmail(email);
    //     return user != null ? Ok(user) : NotFound();
    // }
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var result = _userService.DeleteUser(id);
        return result ? NoContent() : NotFound();
    }
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, UserDTO userDto)
    {
        var updatedUser = _userService.UpdateUser(id, userDto);
        return updatedUser != null ? Ok(updatedUser) : NotFound();
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDTO loginDto)
    {
        try
        {
            var user = _userService.ValidateUser(loginDto.Email, loginDto.Password);
            if (user == null)
            {
                return Unauthorized(new { error = "Credenciais inválidas." });
            }

            // Gerar token JWT
            var tokenService = new TokenService(null); // Logger pode ser passado se necessário
            var token = tokenService.CreateToken(new User
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Password = "", // Não incluir senha no token
                Photo = user.Photo
            });

            return Ok(new { token, user });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Erro interno do servidor." });
        }
    }
}
