
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class ContactController : BaseApiController
    {
        private readonly IContactRepository _contactRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public ContactController(IContactRepository contactRepository,IUserRepository userRepository,IMapper mapper)
        {
            this._contactRepository = contactRepository;
            this._userRepository = userRepository;
            this._mapper = mapper;
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpGet("all")]
        public async Task<ActionResult<ApiResponseDto<IEnumerable<ContactDto>>>> GetAllContact()
        {
            var contacts = await _contactRepository.GetContacts();

            return Ok(ApiResponseDto<IEnumerable<ContactDto>>.Success(contacts,"Fetch succesfully"));
        }


        
        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<string>>> CreateContact(ContactDto contactDto)
        {
            contactDto.UserId = User.GetUserId();
            var sourceuser = await _userRepository.GetUserByIdAsync(contactDto.UserId);
            var contacts = await _contactRepository.GetUserContacts(contactDto.UserId);

            //if (contacts != null) return BadRequest(ApiResponseDto<string>.Error("You already have contacted admin"));
            var contact = new Contact
            {
                Message = contactDto.Message,
                AppUser = sourceuser,
                Email = contactDto.Email,
                Subject = contactDto.Subject,
            };
            _mapper.Map<Contact>(contactDto);
             sourceuser.Contacts.Add(contact);

            if(!await _userRepository.SaveAllAsync()) return BadRequest(ApiResponseDto<string>.Error("You already have contacted admin"));

            return Ok(ApiResponseDto<string>.Success(null, "Fetch succesfully"));
        }
    }
}
