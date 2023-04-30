using System;
using System.Data;
using SqlKata.Execution;

namespace SunnyGardenCoffee.Helper
{
    public interface IDbConnectionFactory : IDisposable
    {
        IDbConnection Connection { get; }
        IDbTransaction DbTransaction { get; }
        QueryFactory SqlKataQuery { get; }
    }
}
