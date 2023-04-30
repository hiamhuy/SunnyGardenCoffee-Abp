
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

namespace SunnyGardenCoffee.QuanLyNhanVien
{
    [AbpAuthorize]
    public class NhanVienAppServices : SunnyGardenCoffeeAppServiceBase
    {
        private readonly IRepository<PersonnalEntity, long> _personnalRepository;
        private readonly IRepository<Role> _roleRepository;
        public NhanVienAppServices(IRepository<PersonnalEntity, long> perRepository,
            IRepository<Role> _roleRepos)
        {
            _personnalRepository = perRepository;
            _roleRepository = _roleRepos;
        }
        [HttpPost]
        public async Task<PagedResultDto<NhanVienDto>> GetPageList(NhanVienPagingListRequest input)
        {
            try
            {
                input.Format();
                var query = (from obj in _personnalRepository.GetAll().AsNoTracking()
                             join role in _roleRepository.GetAll() on obj.PositionId equals role.Id
                             select new NhanVienDto
                             {
                                 Id = obj.Id,
                                 PersonnalName = obj.PersonnalName,
                                 PersonnalCode = obj.PersonnalCode,
                                 Address = obj.Address,
                                 DateOfBirth = obj.DateOfBirth,
                                 DateToWork = obj.DateToWork,
                                 PhoneNumber = obj.PhoneNumber,
                                 PositionId = obj.PositionId,
                                 Status = obj.Status,
                                 TenVaiTro = role.DisplayName,

                                 //Tenant
                                 TenantId = obj.TenantId

                             })
                            .WhereIf(input.PositionId.HasValue, x => x.PositionId == input.PositionId)
                            .WhereIf(input.Status.HasValue, x => x.Status == input.Status)
                            .WhereIf(!string.IsNullOrEmpty(input.Filter), p =>
                                       EF.Functions.Like(p.PersonnalName.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText)
                                   || EF.Functions.Like(p.PersonnalCode.Replace("đ", "d").Replace("Đ", "d").ToLower(), input.FilterFullText))
                            ;


                var count = await query.CountAsync();
                var dataGrids = await query
                .OrderBy(m => m.Id).PageBy(input).ToListAsync();

                return new PagedResultDto<NhanVienDto>(count, dataGrids);
            }
            catch(Exception ex)
            {
                throw new UserFriendlyException("Lỗi lấy dữ liệu...");
            }

        }

        public async Task<CommonResultDto<NhanVienDto>> CreateOrUpdate(NhanVienDto input)
        {

            try
            {
                var entity = new PersonnalEntity();
                if (input.Id > 0)
                {
                    var mapEntity = ObjectMapper.Map<PersonnalEntity>(input);
                    entity = await _personnalRepository.UpdateAsync(mapEntity);
                }
                else
                {
                    input.TenantId = 1;
                    var mapEntity = ObjectMapper.Map<PersonnalEntity>(input);
                    entity.Id = await _personnalRepository.InsertAndGetIdAsync(mapEntity);
                }

                return new CommonResultDto<NhanVienDto>()
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex) { throw ex; }
        }
        [HttpGet]

        public async Task<CommonResultDto<NhanVienDto>> GetInfoById(long Id)
        {
            try
            {
                var getDataById = await _personnalRepository.GetAll().Where(x => x.Id == Id).FirstOrDefaultAsync();
                var objMap = ObjectMapper.Map<NhanVienDto>(getDataById);
                return new CommonResultDto<NhanVienDto>() { DataResult = objMap, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpDelete]
        public async Task<CommonResultDto<NhanVienDto>> Delete(long Id)
        {
            try
            {
                await _personnalRepository.DeleteAsync(x => x.Id == Id);
                return new CommonResultDto<NhanVienDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpDelete]
        public async Task<CommonResultDto<NhanVienDto>> DeleteMulti(List<long> Ids)
        {
            try
            {
                foreach (var id in Ids)
                {
                    await _personnalRepository.DeleteAsync(x => x.Id == id);
                }

                return new CommonResultDto<NhanVienDto>() { IsSuccessful = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public async Task<List<ComboBoxTDto<RoleDto>>> GetRole()
        {
            var query = from role in _roleRepository.GetAll().Where(x => x.Name == "NhanVien")
                        select new ComboBoxTDto<RoleDto>
                        {
                            Value = role.Id,
                            DisplayText = role.DisplayName,
                            Data = ObjectMapper.Map<RoleDto>(role),

                        };

            return await query.ToListAsync();

        }
    }
}
