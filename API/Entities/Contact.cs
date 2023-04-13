namespace API.Entities
{
    public class Contact
	{
		public int Id { get; set; }
		public string Email { get; set; }
		public string Subject { get; set; }
		public string Message { get; set; }
		public DateTime CreatedDate { get; set; } = DateTime.Now;
		public int AppUserId { get; set; }
		public AppUser AppUser { get; set; }
	}
}
