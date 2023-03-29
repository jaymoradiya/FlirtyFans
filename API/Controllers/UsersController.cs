using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Interfaces;
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

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }


        [AllowAnonymous]
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
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByIdAsync(Int32.Parse(id));

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

    }
}