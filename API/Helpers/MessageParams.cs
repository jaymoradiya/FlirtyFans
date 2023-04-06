using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class MessageParams : PaginationParams
    {
        public int UserId { get; set; }
        public string Container { get; set; } = "Unread";
    }
}