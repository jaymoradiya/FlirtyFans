using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {

            return Ok(new ApiResponseDto<IEnumerable<MemberDto>>
            {
                Data = await _userRepository.GetMembersAsync(),
                Status = true,
                Message = "Data fetch successfully"
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetUser(int id)
        {
            var user = await _userRepository.GetMemberAsync(id);
            return Ok(new ApiResponseDto<MemberDto>
            {
                Data = user,
                Message = "user fetch successfully",
                Status = true,
            });
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {

            var user = await _userRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound(new ApiResponseDto<string>
            {
                Data = null,
                Status = false,
                Message = "user doesn't exist",
            });

            _mapper.Map(memberUpdateDto, user);

            if (await _userRepository.SaveAllAsync()) return Ok(new ApiResponseDto<MemberDto>
            {
                Data = null,
                Status = true,
                Message = "user updated",
            });

            return BadRequest(new ApiResponseDto<string>
            {
                Data = null,
                Status = false,
                Message = "failed to update user",
            });

        }


        [HttpPost("add-photo")]
        public async Task<ActionResult<ApiResponseDto<PhotoDto>>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound(new ApiResponseDto<string>
            {
                Data = null,
                Message = "user doesn't exist",
                Status = false,
            });

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(new ApiResponseDto<string>
            {
                Message = result.Error.Message,
                Status = false,
                Data = null,
            });

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };

            if (user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUser), new { Id = user.Id },
                new ApiResponseDto<PhotoDto>
                {
                    Data = _mapper.Map<PhotoDto>(photo),
                    Message = "photo uploaded successfully",
                    Status = true,
                });
                // return Ok(new ApiResponseDto<PhotoDto>
                // {
                //     Data = _mapper.Map<PhotoDto>(photo),
                //     Message = "photo uploaded successfully",
                //     Status = true,
                // });
            }

            return BadRequest(new ApiResponseDto<string>
            {
                Data = null,
                Message = "problem saving photos",
                Status = false,
            });
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByIdAsync(User.GetUserId());
            if (user == null) return BadRequest(new ApiResponseDto<string>
            {
                Message = "user doesn't exist",
                Status = false,
                Data = null,
            });

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound(new ApiResponseDto<string>
            {
                Message = "photo doesn't exist",
                Status = false,
                Data = null,
            });

            if (photo.IsMain) return BadRequest(new ApiResponseDto<string>
            {
                Message = "user doesn't exist",
                Status = false,
                Data = null,
            });

            var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
            if (currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;
            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest(new ApiResponseDto<string>
            {
                Message = "problem to set up main photo",
                Status = false,
                Data = null,
            });
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return BadRequest(new ApiResponseDto<string>
            {
                Message = "user doesn't exist",
                Status = false,
                Data = null,
            });

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound(new ApiResponseDto<string>
            {
                Message = "photo doesn't exist",
                Status = false,
                Data = null,
            });

            if (photo.IsMain) return BadRequest(new ApiResponseDto<string>
            {
                Message = "you can't delete main photo",
                Status = false,
                Data = null,
            });

            if (photo.PublicId != null)
            {

                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error == null) if (result.Error != null) return BadRequest(new ApiResponseDto<string>
                {
                    Message = result.Error.Message,
                    Status = false,
                    Data = null,
                });
            }

            user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync())
            {
                return Ok(new ApiResponseDto<PhotoDto>
                {
                    Data = _mapper.Map<PhotoDto>(photo),
                    Message = "photo deleted",
                    Status = true,
                });
            }

            return BadRequest(new ApiResponseDto<string>
            {
                Data = null,
                Message = "problem deleting photo",
                Status = false,
            });
        }

    }
}