using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ContactDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Subject { get; set; }
        [Required] 
        public string Message { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int UserId { get; set; }
    }
}
