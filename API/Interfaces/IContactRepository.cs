using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IContactRepository
    {
        Task<IEnumerable<Contact>> GetUserContacts(int userId);

        Task<IEnumerable<ContactDto>> GetContacts();
    }
}
