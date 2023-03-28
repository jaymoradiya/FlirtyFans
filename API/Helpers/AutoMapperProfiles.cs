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
        }
    }
}