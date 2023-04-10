using Api.Entities;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<PresenceHub> _presenceHub;

        public MessageHub(IMessageRepository messageRepository, IUserRepository userRepository,
         IMapper mapper, IHubContext<PresenceHub> presenceHub)
        {
            _presenceHub = presenceHub;
            _userRepository = userRepository;
            _mapper = mapper;
            _messageRepository = messageRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUserId = httpContext.Request.Query["userId"];
            var groupName = GenerateGroupName(Context.User.GetUserId(), int.Parse(otherUserId));
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddToGroup(groupName);

            var messages = await _messageRepository.GetThreadMessages(Context.User.GetUserId(), int.Parse(otherUserId));

            await Clients.Group(groupName).SendAsync(HubType.ReceiveThreadMessages.Value, messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await RemoveFromMessageGroup();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var userId = Context.User.GetUserId();

            if (createMessageDto.RecipientUserId == userId)
                throw new HubException("You cannot sent message to yourself");

            var sender = await _userRepository.GetUserByIdAsync(userId);
            var receiver = await _userRepository.GetUserByIdAsync(createMessageDto.RecipientUserId);

            if (receiver == null) throw new HubException("Not found user");

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

            var groupName = GenerateGroupName(userId, receiver.Id);

            var group = await _messageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.UserId == receiver.Id))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnections(receiver.Id);
                if (connections != null)
                {
                    await _presenceHub.Clients
                        .Clients(connections)
                        .SendAsync(HubType.ReceivedNewMessage.Value, new { userId = userId, knownAs = sender.KnownAs });
                }
            }

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync(HubType.NewMessage.Value, _mapper.Map<MessageDto>(message));
            }
            return;
        }



        private string GenerateGroupName(int useId, int otherUserId)
        {
            return String.Join("-", new List<int> { useId, otherUserId }.Order());
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUserId());
            if (group == null)
            {
                group = new Group(groupName);
                _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            return await _messageRepository.SaveAllAsync();
        }

        private async Task RemoveFromMessageGroup()
        {
            var connection = await _messageRepository.GetConnection(Context.ConnectionId);
            _messageRepository.RemoveConnection(connection);
            await _messageRepository.SaveAllAsync();


        }
    }
}