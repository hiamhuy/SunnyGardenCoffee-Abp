using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using SunnyGardenCoffee.Authorization.Roles;
using SunnyGardenCoffee.Authorization.Users;
using SunnyGardenCoffee.MultiTenancy;
using SunnyGardenCoffee.Entities;
using System.Data.Common;
using System;

namespace SunnyGardenCoffee.EntityFrameworkCore
{
    public class SunnyGardenCoffeeDbContext : AbpZeroDbContext<Tenant, Role, User, SunnyGardenCoffeeDbContext>
    {
        /* Define a DbSet for each entity of the application */

        public virtual DbSet<CustommerOrderEntity> CustommerOrderEntity { get; set; }
        public virtual DbSet<CustommerEntity> CustommerEntity { get; set; }
        public virtual DbSet<BillEntity> BillEntity { get; set; }
        public virtual DbSet<CategoryEntity> CategoryEntity { get; set; }
        public virtual DbSet<MerchandiseEntity> MerchandiseEntity { get; set; }
        public virtual DbSet<PersonnalEntity> PersonnalEnitity { get; set; }
        public virtual DbSet<ReceiptDetailEntity> ReceiptDetailEntity { get; set; }
        public virtual DbSet<ReceiptEntity> ReceiptEntity { get; set; }
        public virtual DbSet<TableEntity> TableEntity { get; set; }
        public virtual DbSet<BillDetailEntity> BillDetailEntity { get; set; }

        public SunnyGardenCoffeeDbContext(DbContextOptions<SunnyGardenCoffeeDbContext> options)
            : base(options)
        {

        }
     
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
