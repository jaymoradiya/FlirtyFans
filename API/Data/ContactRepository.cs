using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ContactRepository : IContactRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ContactRepository(DataContext context,IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }

        public async Task<IEnumerable<ContactDto>> GetContacts()
        {
            var contacts = await _context.Contacts
                .ProjectTo<ContactDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return contacts.AsEnumerable();
        }

        public async Task<IEnumerable<Contact>> GetUserContacts(int userId)
        {
          var contacts = await _context.Contacts.Where(c => c.AppUserId == userId).ToListAsync();

            return contacts;
        }
    }
}
