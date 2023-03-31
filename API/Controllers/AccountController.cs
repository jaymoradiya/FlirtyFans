using System.Collections;
using System.Runtime.Intrinsics.X86;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }


        [HttpPost("register")]
        public async Task<ActionResult<ApiResponseDto<UserDto>>> Register(RegisterDto registerDto)
        {

            if (await UserExit(registerDto.Email)) return BadRequest(new ApiResponseDto<string>
            {
                Data = null,
                Status = false,
                Message = "user Already exist",
            });
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                Email = registerDto.Email.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };


            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new ApiResponseDto<UserDto>
            {
                Status = true,
                Message = "Register successfully",
                Data = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email.ToLower(),
                    KnownAs = user.KnownAs,
                    Token = _tokenService.CreateToken(user),
                    PhotoUrl = user.Photos.SingleOrDefault(p => p.IsMain)?.Url,
                }
            };
        }
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponseDto<UserDto>>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
            .Include(u => u.Photos)
            .SingleOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower());
            if (user == null) return Unauthorized(new ApiResponseDto<string>
            {
                Data = null,
                Status = false,
                Message = "user doesn't exist",
            });

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!StructuralComparisons.StructuralEqualityComparer.Equals(computeHash, user.PasswordHash))
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
                    Email = user.Email.ToLower(),
                    KnownAs = user.KnownAs,
                    Token = _tokenService.CreateToken(user),
                    PhotoUrl = user.Photos.SingleOrDefault(p => p.IsMain)?.Url,
                }
            };


        }

        Task<bool> UserExit(string email)
        {
            return _context.Users.AnyAsync(user => user.Email.ToLower() == email.ToLower());
        }
    }


}