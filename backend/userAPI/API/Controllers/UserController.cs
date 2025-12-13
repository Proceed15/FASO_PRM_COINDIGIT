using Microsoft.AspNetCore.Mvc;

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
        catch (Exception)
        {
            return StatusCode(500, new { error = "Erro interno do servidor." });
        }
    }

    [HttpGet]
    public IActionResult getAllUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetUserDetails(int id)
    {
        var user = _userService.GetUserDetails(id);
        return user != null ? Ok(user) : NotFound();
    }

    [HttpGet("by-email")] // <— ADD
    public IActionResult GetUserByEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { error = "Email é obrigatório." });

        var user = _userService.GetUserByEmail(email);
        return user != null ? Ok(user) : NotFound(new { error = "Usuário não encontrado." });
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var result = _userService.DeleteUser(id);
        return result ? NoContent() : NotFound();
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, UserDTO userDto)
    {
        var updatedUser = _userService.UpdateUser(id, userDto);
        return updatedUser != null ? Ok(updatedUser) : NotFound();
    }
}