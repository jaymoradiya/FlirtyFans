using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimeExtension
    {
        public static int GetAge(this DateOnly dob)
        {
            var date = DateTime.UtcNow;
            var age = date.Year - dob.Year;
            if (date > date.AddYears(-age)) age--;
            return age;
        }
    }
}