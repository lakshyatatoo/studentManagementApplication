using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace StudentRegistrationWebApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        [StringLength(100)]
        public string? FullName { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        public DateTime RegisteredOn { get; set; } = DateTime.UtcNow;
    }
}
