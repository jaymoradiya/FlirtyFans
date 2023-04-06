using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Entities;

namespace API.DTOs
{
    public class ThreadDto
    {
        public int UserId { get; set; }

        public int OtherUserId { get; set; }
        public MessageDto LastMessage { get; set; }
    }
}