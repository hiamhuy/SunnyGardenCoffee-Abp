using Abp.Authorization.Users;
using Abp.Domain.Entities;
using Abp.Domain.Uow;
using Abp.IdentityFramework;
using Abp.Localization;
using Abp.ObjectMapping;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using SunnyGardenCoffee.Authorization.Roles;
using SunnyGardenCoffee.Authorization.Users;
using SunnyGardenCoffee.Helper;
using SunnyGardenCoffee.MultiTenancy;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.Common.Business
{
    [UnitOfWork]
    public class RequestHandlerBase
    {
        #region Lazy load IAppFactory
        public IServiceProvider ServiceProvider { get; set; }
        public IOrdAppFactory AppFactory => ServiceProvider.GetService<IOrdAppFactory>();
        #endregion

        #region Prop

        public IAbpSession AbpSession => AppFactory.AbpSession;
        public IObjectMapper ObjectMapper => AppFactory.ObjectMapper;
        public ICacheManager CacheManager => AppFactory.CacheManager;
        public UserManager UserManager => AppFactory.GetProxyOrServiceDependency<UserManager>();
        public UserRole UserRoleManager => AppFactory.GetProxyOrServiceDependency<UserRole>();
        public RoleManager RoleManager => AppFactory.GetProxyOrServiceDependency<RoleManager>();
        public TenantManager TenantManager => AppFactory.GetProxyOrServiceDependency<TenantManager>();
        public ILocalizationManager LocalizationManager => AppFactory.GetProxyOrServiceDependency<ILocalizationManager>();
        public IActiveUnitOfWork CurrentUnitOfWork => AppFactory.CurrentUnitOfWork;
        public IUnitOfWorkManager UnitOfWorkManager => AppFactory.UnitOfWorkManager;

        public Task<TResponse> SendCqrsRequest<TResponse>(IRequest<TResponse> request)
        {
            return AppFactory.SendCqrsRequest(request);
        }

        #endregion

        public IQueryable<TEntity> GetEntityQueryable<TEntity, TKey>()
            where TEntity : class, IEntity<TKey>
        {
            var repo = AppFactory.Repository<TEntity, TKey>();
            return repo.GetAll();
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
