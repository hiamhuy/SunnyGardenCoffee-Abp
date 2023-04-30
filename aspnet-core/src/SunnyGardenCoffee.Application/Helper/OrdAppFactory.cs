using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Net.Mail;
using Abp.ObjectMapping;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SqlKata.Compilers;
using SqlKata.Execution;
using SunnyGardenCoffee.AppManager;
using SunnyGardenCoffee.Authorization.Users;
using SunnyGardenCoffee.Sessions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.Helper
{
    public class OrdAppFactory : IOrdAppFactory
    {
        //ITransientDependency-Service
        public TProxyOrService GetProxyOrServiceDependency<TProxyOrService>()
        {
            var proxyService = ServiceProvider.GetService<TProxyOrService>();
            if (proxyService == null)
            {
                throw new Exception("ProxyOrService chưa được đăng ký");
            };
            return proxyService;
        }

        #region Scope [Repository - IScopedDependency]

        private IIocResolver _iocResolver;
        private IScopedIocResolver _scope;
        private IScopedIocResolver Scope => _scope ?? (_scope = LazyGetRequiredService(ref _iocResolver).CreateScope());

        //IScopedDependency-Repository
        private Dictionary<string, object> _repositories;
        public IRepository<TEntity, TPrimaryKey> Repository<TEntity, TPrimaryKey>() where TEntity : class, Abp.Domain.Entities.IEntity<TPrimaryKey>
        {
            if (_repositories == null) _repositories = new Dictionary<string, object>();
            var type = typeof(TEntity);
            var _key = type.Name;
            if (!_repositories.ContainsKey(_key))
            {
                _repositories[_key] = Scope.Resolve<IRepository<TEntity, TPrimaryKey>>();
            }
            return (IRepository<TEntity, TPrimaryKey>)_repositories[_key];
        }

        //IScopedDependency-Service
        private Dictionary<string, object> _services;
        public TScopedService GetScopedService<TScopedService>() //where TScopedService : class, IScopedDependency
        {
            if (_services == null) _services = new Dictionary<string, object>();
            var type = typeof(TScopedService);
            var _key = type.Name;
            if (!_services.ContainsKey(_key))
            {
                _services[_key] = Scope.Resolve<TScopedService>();
            }
            return (TScopedService)_services[_key];
        }

        #endregion

        #region LazyGetRequiredService
        protected IServiceProvider ServiceProvider { get; set; }
        protected readonly object ServiceProviderLock = new object();

        public OrdAppFactory(IServiceProvider serviceProvider)
        {
            ServiceProvider = serviceProvider;
        }
        protected TService LazyGetRequiredService<TService>(ref TService reference)
            => LazyGetRequiredService(typeof(TService), ref reference);

        protected TRef LazyGetRequiredService<TRef>(Type serviceType, ref TRef reference)
        {
            if (reference != null) return reference;
            lock (ServiceProviderLock)
            {
                if (reference == null)
                {
                    reference = (TRef)ServiceProvider.GetRequiredService(serviceType);
                }
            }
            return reference;
        }
        #endregion

        private IMediator _mediator;
        public IMediator Mediator => LazyGetRequiredService(ref _mediator);

        private IAbpSession _abpSession;
        public IAbpSession AbpSession => LazyGetRequiredService(ref _abpSession);

        private IObjectMapper _objectMapper;
        public IObjectMapper ObjectMapper => LazyGetRequiredService(ref _objectMapper);

        private IUnitOfWorkDapper _dapper;
        public IUnitOfWorkDapper Dapper => LazyGetRequiredService(ref _dapper);

        private ICacheManager _cache;
        public ICacheManager CacheManager => LazyGetRequiredService(ref _cache);

        private IPasswordHasher<User> _passwordHasher;
        public IPasswordHasher<User> PasswordHasher => LazyGetRequiredService(ref _passwordHasher);

        //private IAppFolders _appFolders;
        //public IAppFolders AppFolders => LazyGetRequiredService(ref _appFolders);

        private IEmailSender _emailSender;
        public IEmailSender EmailSender => LazyGetRequiredService(ref _emailSender);

        private IWebHostEnvironment _webHostEnvironment;
        public IWebHostEnvironment WebHostEnvironment => LazyGetRequiredService(ref _webHostEnvironment);


        private IUnitOfWorkManager _unitOfWorkManager;
        public IUnitOfWorkManager UnitOfWorkManager => LazyGetRequiredService(ref _unitOfWorkManager);
        public IActiveUnitOfWork CurrentUnitOfWork => UnitOfWorkManager?.Current;

        //private ITempFileCacheManager _tempFileCacheManager;
        //public ITempFileCacheManager TempFileCacheManager => LazyGetRequiredService(ref _tempFileCacheManager);

        private IConfiguration _configuration;
        public IConfiguration AppSettingConfiguration => _configuration ?? LazyGetRequiredService(ref _configuration);

        private IDbConnectionFactory _baseConn;
        public IDbConnectionFactory PMSDbFactory
        {
            get
            {
                if (_baseConn == null)
                {
                    _baseConn = new DbConnectionFactory(AppSettingConfiguration.GetConnectionString(SunnyGardenCoffeeConsts.ConnectionStringName));
                }

                return _baseConn;
            }
        }

        private ISessionAppService _SessionAppService;
        public ISessionAppService SessionAppService => LazyGetRequiredService(ref _SessionAppService);

        private QueryFactory _queryFactory;
        public QueryFactory QueryFactory
        {
            get
            {
                if (_queryFactory != null) return _queryFactory;
                var connection = Dapper.Connection;
                var compiler = new MySqlCompiler();
                _queryFactory = new QueryFactory(connection, compiler);
                return _queryFactory;
            }
        }
        public async Task<TResponse> SendCqrsRequest<TResponse>(IRequest<TResponse> request)
        {
            return await Mediator.Send(request);
        }

        public T MapDynamic<T>(object objfrom, T objto)
        {
            var ToProperties = objto.GetType().GetProperties();
            var FromProperties = objfrom.GetType().GetProperties();

            ToProperties.ToList().ForEach(o =>
            {
                var fromp = FromProperties.FirstOrDefault(x => x.Name == o.Name && x.PropertyType == o.PropertyType);
                if (fromp != null)
                {
                    o.SetValue(objto, fromp.GetValue(objfrom));
                }
            });

            return objto;
        }
    }
}
