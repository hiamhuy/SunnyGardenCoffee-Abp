
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.UI;
using Abp.Linq.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunnyGardenCoffee.AppCore.Dto;
using SunnyGardenCoffee.Common.Dto;
using SunnyGardenCoffee.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace SunnyGardenCoffee.BanHang
{
    [AbpAuthorize]
    public class NguyenLieuAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<ReceiptEntity, long> _receiptRepository;
        private readonly IRepository<ReceiptDetailEntity, long> _receiptDetailRepository;
        public NguyenLieuAppServices(
            IRepository<ReceiptEntity, long> receiptRepository,
            IRepository<ReceiptDetailEntity, long> receiptDetailRepository)
        {
            _receiptRepository = receiptRepository;
            _receiptDetailRepository = receiptDetailRepository;
        }
        [HttpPost]
        public async Task<PagedResultDto<BienLaiNhapDto>> GetPageList(NguyenLieuPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _receiptRepository.GetAll().AsNoTracking()
                             select new BienLaiNhapDto
                             {
                                 Id = obj.Id,
                                 ReceiptNumber = obj.ReceiptNumber,
                                 DateAdded = obj.DateAdded,
                                 Note = obj.Note,
                                 TotalPrice = obj.TotalPrice,
                                 //Tenant
                                 TenantId = obj.TenantId

                             })
                             .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                EF.Functions.Like(p.ReceiptNumber.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText))
                                ;


                var count = await query.CountAsync();
                var dataGrids = await query
                .OrderBy(m => m.Id).PageBy(input).ToListAsync();

                foreach (var item in dataGrids)
                {
                    var getDetail = _receiptDetailRepository.GetAll().Where(x => x.ReceiptId == item.Id).ToList();
                    item.SoLuong = getDetail.Count();
                }

                return new PagedResultDto<BienLaiNhapDto>(count, dataGrids);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public async Task<CommonResultDto<BienLaiNhapDto>> CreateOrUpdate(BienLaiNhapDto input)
        {
            var userId = AbpSession.UserId;
            try
            {
                var entity = new ReceiptEntity();
                if (input.Id > 0)
                {
                    var mapEntity = ObjectMapper.Map<ReceiptEntity>(input);
                    entity = await _receiptRepository.UpdateAsync(mapEntity);
                }
                else
                {
                    input.PersonnalId = userId ?? 0;
                    input.TotalPrice = 0;
                    if (input.BienLaiNhapChiTietDtos.Count > 0)
                    {
                        foreach (var item in input.BienLaiNhapChiTietDtos)
                        {
                            input.TotalPrice += item.EntryPrice;
                        }
                    }
                    input.TenantId = 1;
                    var mapEntity = ObjectMapper.Map<ReceiptEntity>(input);
                    entity.Id = await _receiptRepository.InsertAndGetIdAsync(mapEntity);

                    if (input.BienLaiNhapChiTietDtos.Count > 0)
                    {
                        foreach (var item in input.BienLaiNhapChiTietDtos)
                        {
                            var detail = new ReceiptDetailEntity()
                            {
                                ReceiptId = entity.Id,
                                Name = item.Name,
                                Amount = item.Amount,
                                EntryPrice = item.EntryPrice,

                                TenantId = 1
                            };
                            await _receiptDetailRepository.InsertAsync(detail);
                        }
                    }
                }

                return new CommonResultDto<BienLaiNhapDto>()
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex) { throw ex; }
        }
        [HttpGet]

        public async Task<CommonResultDto<BienLaiNhapDto>> GetInfoById(long Id)
        {
            try
            {
                var getDataById = await _receiptRepository.GetAll().Where(x => x.Id == Id).FirstOrDefaultAsync();
                var objMap = ObjectMapper.Map<BienLaiNhapDto>(getDataById);

                var listBienLai = _receiptDetailRepository.GetAll().Where(x => x.ReceiptId == Id).ToList();

                var abc = ObjectMapper.Map<List<BienLaiNhapChiTietDto>>(listBienLai);
                objMap.BienLaiNhapChiTietDtos = abc;

                return new CommonResultDto<BienLaiNhapDto>() { DataResult = objMap, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpDelete]
        public async Task<CommonResultDto<BienLaiNhapDto>> Delete(long Id)
        {
            try
            {
                await _receiptRepository.DeleteAsync(x => x.Id == Id);
                await _receiptDetailRepository.DeleteAsync(x => x.ReceiptId == Id);
                return new CommonResultDto<BienLaiNhapDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpDelete]
        public async Task<CommonResultDto<BienLaiNhapDto>> DeleteMulti(List<long> Ids)
        {
            try
            {
                foreach (var id in Ids)
                {
                    await _receiptRepository.DeleteAsync(x => x.Id == id);
                    await _receiptDetailRepository.DeleteAsync(x => x.ReceiptId == id);
                }

                return new CommonResultDto<BienLaiNhapDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
