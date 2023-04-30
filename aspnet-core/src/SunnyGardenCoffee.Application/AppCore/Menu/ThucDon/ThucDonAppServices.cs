
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.ThucDon
{
    [AbpAuthorize]
    public class ThucDonAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<MerchandiseEntity, long> _merchandiseRepository;
        private readonly IRepository<CategoryEntity, long> _cateRepository;
        public ThucDonAppServices(IRepository<MerchandiseEntity, long> merchandiseRepository,
            IRepository<CategoryEntity, long> cateRepository)
        {
            _merchandiseRepository = merchandiseRepository;
            _cateRepository = cateRepository;
        }
        [HttpPost]
        public async Task<PagedResultDto<ThucDonDto>> GetPageList(ThucDonPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _merchandiseRepository.GetAll().AsNoTracking()
                             join cate in _cateRepository.GetAll() on obj.CategoryCode equals cate.CategoryCode
                             select new ThucDonDto
                             {
                                 Id = obj.Id,
                                 CodeMerchandise = obj.CodeMerchandise,
                                 NameMerchandise = obj.NameMerchandise,
                                 Image = obj.Image,
                                 Prices = obj.Prices,
                                 CategoryCode = obj.CategoryCode,
                                 Note = obj.Note,
                                 TenLoai = cate.CategoryName,
                                 //Tenant
                                 TenantId = obj.TenantId

                             })
                            .WhereIf(input.CategoryCode != null, x => x.CategoryCode == input.CategoryCode)
                            .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                       EF.Functions.Like(p.NameMerchandise.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText)
                                   || EF.Functions.Like(p.CodeMerchandise.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText))
                            ;


                var count = await query.CountAsync();
                var dataGrids = await query
                .OrderBy(m => m.Id).PageBy(input).ToListAsync();

                return new PagedResultDto<ThucDonDto>(count, dataGrids);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public async Task<CommonResultDto<ThucDonDto>> CreateOrUpdate(ThucDonDto input)
        {

            try
            {
                var entity = new MerchandiseEntity();
                if (input.Id > 0)
                {
                    var mapEntity = ObjectMapper.Map<MerchandiseEntity>(input);
                    entity = await _merchandiseRepository.UpdateAsync(mapEntity);
                }
                else
                {
                    input.TenantId = 1;
                    var mapEntity = ObjectMapper.Map<MerchandiseEntity>(input);
                    entity.Id = await _merchandiseRepository.InsertAndGetIdAsync(mapEntity);
                }

                return new CommonResultDto<ThucDonDto>()
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex) { throw ex; }
        }
        [HttpGet]

        public async Task<CommonResultDto<ThucDonDto>> GetInfoById(long Id)
        {
            try
            {
                var getDataById = await _merchandiseRepository.GetAll().Where(x => x.Id == Id).FirstOrDefaultAsync();
                var objMap = ObjectMapper.Map<ThucDonDto>(getDataById);

                var getCate = _cateRepository.GetAll().FirstOrDefault(x => x.CategoryCode == objMap.CategoryCode);
                objMap.CategoryId = getCate.Id;

                return new CommonResultDto<ThucDonDto>() { DataResult = objMap, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpDelete]
        public async Task<CommonResultDto<ThucDonDto>> Delete(long Id)
        {
            try
            {
                await _merchandiseRepository.DeleteAsync(x => x.Id == Id);
                return new CommonResultDto<ThucDonDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpDelete]
        public async Task<CommonResultDto<ThucDonDto>> DeleteMulti(List<long> Ids)
        {
            try
            {
                foreach (var id in Ids)
                {
                    await _merchandiseRepository.DeleteAsync(x => x.Id == id);
                }

                return new CommonResultDto<ThucDonDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
