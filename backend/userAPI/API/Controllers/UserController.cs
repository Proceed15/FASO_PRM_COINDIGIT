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
}
