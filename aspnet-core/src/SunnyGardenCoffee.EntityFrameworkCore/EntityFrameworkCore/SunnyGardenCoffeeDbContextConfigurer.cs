using System;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace SunnyGardenCoffee.EntityFrameworkCore
{
    public static class SunnyGardenCoffeeDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<SunnyGardenCoffeeDbContext> builder, string connectionString)
        {
            var serverVersion = ServerVersion.AutoDetect(connectionString);
            builder.UseMySql(connectionString, serverVersion);
        }

        public static void Configure(DbContextOptionsBuilder<SunnyGardenCoffeeDbContext> builder, DbConnection connection)
        {
            var serverVersion = ServerVersion.AutoDetect(connection.ConnectionString);
            builder.UseMySql(connection, serverVersion);
        }
    }
}
