using API.Entities;
using Microsoft.EntityFrameworkCore.Query;

namespace Api.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderKnownAs { get; set; }
        public AppUser SenderUser { get; set; }
        public int RecipientId { get; set; }
        public string RecipientKnownAs { get; set; }
        public AppUser RecipientUser { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime DateSent { get; set; } = DateTime.UtcNow;
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
    }
}