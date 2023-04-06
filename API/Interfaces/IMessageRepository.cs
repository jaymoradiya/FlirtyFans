using Api.Entities;
using API.DTOs;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);

        void DeleteMessage(Message message);

        Task<Message> GetMessage(int id);

        Task<PagedList<MessageDto>> GetMessagesForUsers(MessageParams messageParams);

        Task<IEnumerable<MessageDto>> GetThreadMessages(int currentUserId, int recipientUserId);

        IEnumerable<ThreadDto> GetThreads(int currentUserId);

        Task<bool> SaveAllAsync();
    }
}