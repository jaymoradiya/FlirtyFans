using Api.Entities;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
            .ForMember(u => u.PhotoUrl, opt => opt.MapFrom(u => u.Photos.SingleOrDefault(p => p.IsMain).Url))
            .ForMember(u => u.Age, opt => opt.MapFrom(u => u.DateOfBirth.GetAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderUserPhotoUrl,
                 opt => opt.MapFrom(src => src.SenderUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.RecipientUserPhotoUrl,
                opt => opt.MapFrom(src => src.RecipientUser.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
            CreateMap<ContactDto,Contact>();
            CreateMap<Contact, ContactDto>();
        }
    }
}