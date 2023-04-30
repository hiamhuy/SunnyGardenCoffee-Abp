
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Authorization.Roles;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Entities;
using SunnyGardenCoffee.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.Ban
{
    [AbpAuthorize]
    public class BanAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<TableEntity, long> _tableRepository;
        public BanAppServices(IRepository<TableEntity, long> tableRepository)
        {
            _tableRepository = tableRepository;
        }
        [HttpPost]
        public async Task<PagedResultDto<BanDto>> GetPageList(BanPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _tableRepository.GetAll().AsNoTracking()
                             select new BanDto
                             {
                                 Id = obj.Id,
                                 CodeTable = obj.CodeTable,
                                 NameTable = obj.NameTable,
                                 Note = obj.Note,

                                 //Tenant
                                 TenantId = obj.TenantId

                             })
                            .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                       EF.Functions.Like(p.NameTable.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText))
                            ;


                var count = await query.CountAsync();
                var dataGrids = await query
                .OrderBy(m => m.Id).PageBy(input).ToListAsync();

                return new PagedResultDto<BanDto>(count, dataGrids);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public async Task<CommonResultDto<BanDto>> CreateOrUpdate(BanDto input)
        {

            try
            {
                var entity = new TableEntity();
                if (input.Id > 0)
                {
                    var mapEntity = ObjectMapper.Map<TableEntity>(input);
                    entity = await _tableRepository.UpdateAsync(mapEntity);
                }
                else
                {
                    input.TenantId = 1;
                    var mapEntity = ObjectMapper.Map<TableEntity>(input);
                    entity.Id = await _tableRepository.InsertAndGetIdAsync(mapEntity);
                }
                return new CommonResultDto<BanDto>()
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex) { throw ex; }
        }
        [HttpGet]

        public async Task<CommonResultDto<BanDto>> GetInfoById(long Id)
        {
            try
            {
                var getDataById = await _tableRepository.GetAll().Where(x => x.Id == Id).FirstOrDefaultAsync();
                var objMap = ObjectMapper.Map<BanDto>(getDataById);
                return new CommonResultDto<BanDto>() { DataResult = objMap, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpDelete]
        public async Task<CommonResultDto<BanDto>> Delete(long Id)
        {
            try
            {
                await _tableRepository.DeleteAsync(x => x.Id == Id);
                return new CommonResultDto<BanDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpDelete]
        public async Task<CommonResultDto<BanDto>> DeleteMulti(List<long> Ids)
        {
            try
            {
                foreach (var id in Ids)
                {
                    await _tableRepository.DeleteAsync(x => x.Id == id);
                }

                return new CommonResultDto<BanDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
