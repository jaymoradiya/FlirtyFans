using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;
        private readonly IUserRepository _userRepository;
        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }

        [HttpPost("{targetUserId}")]
        public async Task<ActionResult> AddLike(int targetUserId)
        {
            var sourceUserId = User.GetUserId();
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);
            var likedUser = await _userRepository.GetUserByIdAsync(targetUserId);

            if (likedUser == null)
                return NotFound(ApiResponseDto<string>.Error("You cannot like user with doesn't exist"));

            if (sourceUser.Id == targetUserId)
                return BadRequest(ApiResponseDto<string>.Error("You cannot like yourself!"));

            var userLike = await _likesRepository.GetUserLike(sourceUserId, targetUserId);

            if (userLike != null)
                return BadRequest(ApiResponseDto<string>.Error("You already like this user"));


            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest(ApiResponseDto<string>.Error("Failed to like user"));

        }
        [HttpGet]
        public async Task<ActionResult<ApiResponseDto<IEnumerable<LikeDto>>>> GetUserLikes(string predicate)
        {
            var users = await _likesRepository.GetUserLikes(predicate, User.GetUserId());
            return Ok(ApiResponseDto<IEnumerable<LikeDto>>.Success(users, "Data fetch successfully"));
        }
    }
}