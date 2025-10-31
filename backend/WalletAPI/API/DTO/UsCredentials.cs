using System.ComponentModel.DataAnnotations;

namespace WalletAPI.API.DTO
{
    public class UsCredentials
    {
    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Password { get; set; }
    }
}