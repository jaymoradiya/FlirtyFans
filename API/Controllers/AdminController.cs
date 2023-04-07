using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;

        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = _userManager.Users
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    UserName = u.UserName,
                    roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                });

            return Ok(await users.ToListAsync());
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("edit-roles/{userId}")]
        public async Task<ActionResult> EditRoles(int userId, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest(ApiResponseDto<string>.Error("You must provide roles"));

            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByIdAsync(userId.ToString());

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest(ApiResponseDto<string>.Error("problem to add roles"));

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest(ApiResponseDto<string>.Error("problem to remove roles"));

            return Ok(ApiResponseDto<IEnumerable<string>>.Success(await _userManager.GetRolesAsync(user), "roles updated successfully"));

        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModerator()
        {
            return Ok("Admin or Moderator can see");
        }
    }
}