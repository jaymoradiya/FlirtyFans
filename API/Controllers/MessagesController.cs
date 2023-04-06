using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Entities;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<MessageDto>>> CreateMessages(CreateMessageDto createMessageDto)
        {
            var userId = User.GetUserId();

            if (createMessageDto.RecipientUserId == userId)
                return BadRequest(ApiResponseDto<string>.Error("You cannot sent message to yourself"));

            var sender = await _userRepository.GetUserByIdAsync(userId);
            var receiver = await _userRepository.GetUserByIdAsync(createMessageDto.RecipientUserId);

            var message = new Message
            {
                SenderUser = sender,
                RecipientUser = receiver,
                Content = createMessageDto.Content,
                SenderKnownAs = sender.KnownAs,
                RecipientKnownAs = receiver.KnownAs,
                SenderId = sender.Id,
                RecipientId = receiver.Id,
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
                return Ok(ApiResponseDto<MessageDto>.Success(_mapper.Map<MessageDto>(message), "Messages Added"));

            return BadRequest(ApiResponseDto<string>.Error("filed to send message"));
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.UserId = User.GetUserId();

            var messages = await _messageRepository.GetMessagesForUsers(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(messageParams.PageNumber, messageParams.PageSize, messages.TotalPages, messages.TotalCount));

            return Ok(ApiResponseDto<PagedList<MessageDto>>.Success(messages, "Fetch successfully"));
        }

        [HttpGet("thread/{userId}")]
        public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesThreadForUser(int userId)
        {

            var currentUserId = User.GetUserId();
            var messages = await _messageRepository.GetThreadMessages(currentUserId, userId);

            // Response.AddPaginationHeader(new PaginationHeader(messageParams.PageNumber, messageParams.PageSize, messages.TotalPages, messages.TotalCount));

            return Ok(ApiResponseDto<IEnumerable<MessageDto>>.Success(messages, "Fetch successfully"));
        }

        [HttpGet("threads")]
        public ActionResult<IEnumerable<ThreadDto>> GetThreads()
        {
            var currentUserId = User.GetUserId();
            var threads = _messageRepository.GetThreads(currentUserId);

            return Ok(ApiResponseDto<IEnumerable<ThreadDto>>.Success(threads, "Fetch successfully"));

        }
    }
}