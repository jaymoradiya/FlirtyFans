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

        public static ApiResponseDto<T> Success(T data, string message)
        {
            return new ApiResponseDto<T>
            {
                Data = data,
                Message = message,
                Status = true,
            };
        }


        public static ApiResponseDto<T> Error(string message)
        {
            return new ApiResponseDto<T>
            {
                Message = message,
                Status = false,
            };
        }
    }


}