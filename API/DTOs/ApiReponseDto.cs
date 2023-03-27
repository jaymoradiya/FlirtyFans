using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ApiResponseDto<T>
    {
        public T Data { get; set; }

        public string Message { get; set; }

        public bool Status { get; set; }
    }


}