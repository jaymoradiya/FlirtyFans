using Api.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public byte[] PasswordSalt { get; set; }
        public string Gender { get; set; }
        public string KnownAs { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public List<Photo> Photos { get; set; } = new();
        public List<Contact> Contacts { get; set; } = new();
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public DateTime Created { get; set; } = DateTime.UtcNow;

        public List<UserLike> LikeByUsers { get; set; }
        public List<UserLike> LikedUsers { get; set; }
        public List<Message> MessagesSent { get; set; }
        public List<Message> MessagesReceived { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }

}