using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            return Int32.Parse(user.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        public static string GetUserEmail(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Email).Value;
        }
    }
}