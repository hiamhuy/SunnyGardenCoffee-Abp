
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Authorization.Roles;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Entities;
using SunnyGardenCoffee.Roles.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.BanHang
{
    [AbpAuthorize]
    public class LoaiAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<CategoryEntity, long> _categoryRepository;
        private readonly IRepository<Role> _roleRepository;
        public LoaiAppServices(IRepository<CategoryEntity, long> categoryRepository,
            IRepository<Role> _roleRepos)
        {
            _categoryRepository = categoryRepository;
            _roleRepository = _roleRepos;
        }
        [HttpPost]
        public async Task<PagedResultDto<LoaiDto>> GetPageList(LoaiPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _categoryRepository.GetAll().AsNoTracking()
                                 //join role in _roleRepository.GetAll() on obj.PositionId equals role.Id
                             select new LoaiDto
                             {
                                 Id = obj.Id,
                                 CategoryName = obj.CategoryName,
                                 CategoryCode = obj.CategoryCode,
                                 Note = obj.Note,

                                 //Tenant
                                 TenantId = obj.TenantId

                             })
                            .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                       EF.Functions.Like(p.CategoryName.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText))
                            ;


                var count = await query.CountAsync();
                var dataGrids = await query
                .OrderBy(m => m.Id).PageBy(input).ToListAsync();

                return new PagedResultDto<LoaiDto>(count, dataGrids);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public async Task<CommonResultDto<LoaiDto>> CreateOrUpdate(LoaiDto input)
        {

            try
            {
                var entity = new CategoryEntity();
                if (input.Id > 0)
                {
                    var mapEntity = ObjectMapper.Map<CategoryEntity>(input);
                    entity = await _categoryRepository.UpdateAsync(mapEntity);
                }
                else
                {
                    input.TenantId = 1;
                    var mapEntity = ObjectMapper.Map<CategoryEntity>(input);
                    entity.Id = await _categoryRepository.InsertAndGetIdAsync(mapEntity);
                }

                return new CommonResultDto<LoaiDto>()
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex) { throw ex; }
        }
        [HttpGet]

        public async Task<CommonResultDto<LoaiDto>> GetInfoById(long Id)
        {
            try
            {
                var getDataById = await _categoryRepository.GetAll().Where(x => x.Id == Id).FirstOrDefaultAsync();
                var objMap = ObjectMapper.Map<LoaiDto>(getDataById);
                return new CommonResultDto<LoaiDto>() { DataResult = objMap, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpDelete]
        public async Task<CommonResultDto<LoaiDto>> Delete(long Id)
        {
            try
            {
                await _categoryRepository.DeleteAsync(x => x.Id == Id);
                return new CommonResultDto<LoaiDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpDelete]
        public async Task<CommonResultDto<LoaiDto>> DeleteMulti(List<long> Ids)
        {
            try
            {
                foreach (var id in Ids)
                {
                    await _categoryRepository.DeleteAsync(x => x.Id == id);
                }

                return new CommonResultDto<LoaiDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
