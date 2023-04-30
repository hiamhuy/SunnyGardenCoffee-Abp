using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Net.Mail;
using Abp.ObjectMapping;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using SqlKata.Execution;
using SunnyGardenCoffee.AppManager;
using SunnyGardenCoffee.Authorization.Users;
using SunnyGardenCoffee.Sessions;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.Helper
{
    public interface IOrdAppFactory
    {
        //Repository & Service
        TProxyOrService GetProxyOrServiceDependency<TProxyOrService>();
        IRepository<TEntity, TPrimaryKey> Repository<TEntity, TPrimaryKey>()
            where TEntity : class, Abp.Domain.Entities.IEntity<TPrimaryKey>;
        TScopedService GetScopedService<TScopedService>();

        //Lib
        IMediator Mediator { get; }
        IAbpSession AbpSession { get; }
        IObjectMapper ObjectMapper { get; }
        IUnitOfWorkDapper Dapper { get; }
        QueryFactory QueryFactory { get; }
        ICacheManager CacheManager { get; }
        IPasswordHasher<User> PasswordHasher { get; }
        //IAppFolders AppFolders { get; }
        IEmailSender EmailSender { get; }
        IWebHostEnvironment WebHostEnvironment { get; }
        IUnitOfWorkManager UnitOfWorkManager { get; }
        IActiveUnitOfWork CurrentUnitOfWork { get; }
        //ITempFileCacheManager TempFileCacheManager { get; }
        //IDbConnectionFactory PMSDbFactory { get; }
        ISessionAppService SessionAppService { get; }
        Task<TResponse> SendCqrsRequest<TResponse>(IRequest<TResponse> request);
        T MapDynamic<T>(object objfrom, T objto);
    }
}
