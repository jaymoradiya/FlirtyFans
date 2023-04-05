namespace API.Helpers
{
    public class UserParams : PaginationParams
    {
        public int CurrentUserId { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; } = 100;
        public string OrderBy { get; set; } = "created";
    }
}