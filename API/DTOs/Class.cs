using API.Helpers;

namespace API.DTOs
{
    public class ThreadParams: PaginationParams
    {
        public int UserId {  get; set; }
    }
}
