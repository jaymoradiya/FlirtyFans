using Api.Entities;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id); ;
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUsers(MessageParams messageParams)
        {
            // _context.
            var query = _context.Messages.OrderByDescending(m => m.DateSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientId == messageParams.UserId),
                "Outbox" => query.Where(u => u.SenderId == messageParams.UserId),
                _ => query.Where(u => u.RecipientId == messageParams.UserId && u.DateRead == null),
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<IEnumerable<MessageDto>> GetThreadMessages(int currentUserId, int recipientUserId)
        {
            var messages = await _context.Messages
                .Include(u => u.SenderUser).ThenInclude(u => u.Photos)
                .Include(u => u.RecipientUser).ThenInclude(u => u.Photos)
                .Where(
                    m => m.SenderId == currentUserId && m.RecipientId == recipientUserId ||
                    m.RecipientId == currentUserId && m.SenderId == recipientUserId
                )
                .OrderBy(m => m.DateSent)
                .ToListAsync();

            var unreadMessages = messages
                .Where(m => m.DateRead == null && m.RecipientId == currentUserId)
                .ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in messages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);

        }

        public PagedList<ThreadDto> GetThreads(ThreadParams threadParams)
        {
            var query = _context.Messages.OrderByDescending(m => m.DateSent)
                .Include(u => u.SenderUser).ThenInclude(u => u.Photos)
                .Include(u => u.RecipientUser).ThenInclude(u => u.Photos)
                .AsQueryable();

            var query1 = query
                .Select(m => new ThreadDto
                {
                    UserId = m.SenderId,
                    OtherUserId = m.RecipientId,
                    LastMessage = _mapper.Map<MessageDto>(m)
                })
                .Where(m => m.UserId == threadParams.UserId);

            var threads = query1.AsEnumerable().Union(
                query.Select(m => new ThreadDto
                {
                    UserId = m.RecipientId,
                    OtherUserId = m.SenderId,
                    LastMessage = _mapper.Map<MessageDto>(m)
                })
                .Where(m => m.UserId == threadParams.UserId).AsEnumerable())
                .OrderByDescending(m => m.LastMessage.DateSent)
                .DistinctBy(m => m.OtherUserId)
                .Skip((threadParams.PageNumber - 1) * threadParams.PageSize).Take(threadParams.PageSize);

            return new PagedList<ThreadDto>(threads, 5, threadParams.PageNumber, threadParams.PageSize);

            //return new PagedList<ThreadDto>(threads, 5, threadParams.PageNumber, threadParams.PageSize);

        }
        
        
        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public Task<IEnumerable<ThreadDto>> SearchThread(int currentUserId, string othreUserKnownAs)
        {
            var query = _context.Messages.OrderByDescending(m => m.DateSent)
                .Include(u => u.SenderUser).ThenInclude(u => u.Photos)
                .Include(u => u.RecipientUser).ThenInclude(u => u.Photos)
                .Where( u => u.SenderId == currentUserId&&  u.RecipientKnownAs.ToLower().Contains(othreUserKnownAs.ToLower())  || u.RecipientId == currentUserId && u.SenderKnownAs.ToLower().Contains(othreUserKnownAs.ToLower()))
                .AsQueryable();

            var query1 = query
                .Select(m => new ThreadDto
                {
                    UserId = m.SenderId,
                    OtherUserId = m.RecipientId,
                    LastMessage = _mapper.Map<MessageDto>(m)
                })
                .Where(m => m.UserId == currentUserId );

            var threads = query1.AsEnumerable()
                .Union(query.Select(m => new ThreadDto { 
                    UserId = m.RecipientId, OtherUserId = m.SenderId, LastMessage = _mapper.Map<MessageDto>(m) 
                })
                .Where(m => m.UserId == currentUserId )
                .AsEnumerable())
                .OrderByDescending(m => m.LastMessage.DateSent)
                .DistinctBy(m => m.OtherUserId);

            return Task.FromResult(threads);
        }

        void IMessageRepository.AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        async Task<Connection> IMessageRepository.GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);

        }

        async Task<Group> IMessageRepository.GetMessageGroup(string groupName)
        {
            return await _context.Groups
                .Include(x => x.Connections)
                .FirstOrDefaultAsync(g => g.Name == groupName);
        }

        void IMessageRepository.RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }
    }
}