using System.Collections;
using System.Runtime.Intrinsics.X86;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }


        [HttpPost("register")]
        public async Task<ActionResult<ApiResponseDto<UserDto>>> Register(RegisterDto registerDto)
        {

            if (await UserExit(registerDto.Email, registerDto.UserName)) return BadRequest(new ApiResponseDto<string>
            {
                Data = null,
                Status = false,
                Message = "user Already exist",
            });

            var user = _mapper.Map<AppUser>(registerDto);

            user.Email = registerDto.Email.ToLower();

            user.UserName = user.UserName.ToLower();

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded) return BadRequest(ApiResponseDto<string>.Error(result.Errors.ToList()[0].Description));

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
            if (!roleResult.Succeeded) return BadRequest(ApiResponseDto<string>.Error("problem to register"));

            return new ApiResponseDto<UserDto>
            {
                Status = true,
                Message = "Register successfully",
                Data = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email.ToLower(),
                    KnownAs = user.KnownAs,
                    Token = await _tokenService.CreateToken(user),
                    PhotoUrl = user.Photos.SingleOrDefault(p => p.IsMain)?.Url,
                    Gender = user.Gender,
                }
            };
        }
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponseDto<UserDto>>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
            .Include(u => u.Photos)
            .SingleOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower() || u.UserName == loginDto.UserName.ToLower());
            if (user == null) return Unauthorized(new ApiResponseDto<string>
            {
                Data = null,
                Status = false,
                Message = "user doesn't exist",
            });

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result)
                return Unauthorized(new ApiResponseDto<string>
                {
                    Data = null,
                    Status = false,
                    Message = "invalid email and password",
                });

            return
            new ApiResponseDto<UserDto>
            {
                Status = true,
                Message = "Logged in successfully",
                Data = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email?.ToLower(),
                    KnownAs = user?.KnownAs,
                    Token = await _tokenService.CreateToken(user),
                    PhotoUrl = user.Photos?.SingleOrDefault(p => p.IsMain)?.Url,
                    Gender = user.Gender
                }
            };


        }

        Task<bool> UserExit(string email, string username)
        {
            return _userManager.Users.AnyAsync(user => user.Email.ToLower() == email.ToLower() || user.UserName == username);
        }
    }


}