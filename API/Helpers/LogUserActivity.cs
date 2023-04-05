using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly IUserRepository _userRepository;
        public LogUserActivity(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            // var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
            var user = await _userRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.UtcNow;
            await _userRepository.SaveAllAsync();

        }
    }
}