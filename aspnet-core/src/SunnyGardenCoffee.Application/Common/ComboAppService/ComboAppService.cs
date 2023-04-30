using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.Common.ComboAppService
{
    [AbpAuthorize]
    public partial class ComboAppService : ApplicationService
    {
        private readonly IRepository<CategoryEntity, long> _cateRepository;
        protected IMediator Mediator => Mediator;

        public ComboAppService(IRepository<CategoryEntity, long> cateRepository)
        {
            _cateRepository = cateRepository;
        }


        [HttpGet]
        public async Task<List<ComboBoxDto>> GetAllLoai()
        {
            var query = from obj in _cateRepository.GetAll()
                        select new ComboBoxDto
                        {
                            Value = obj.Id,
                            DisplayText = obj.CategoryName,
                            Data = ObjectMapper.Map<LoaiDto>(obj),

                        };
            return await query.ToListAsync();
        }

    }
}