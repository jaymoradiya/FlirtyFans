using Api.Entities;
using API.DTOs;
using API.Entities;
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

        void AddGroup(Group group);

        void RemoveConnection(Connection connection);

        Task<Connection> GetConnection(string connectionId);

        Task<Group> GetMessageGroup(string groupName);

    }
}