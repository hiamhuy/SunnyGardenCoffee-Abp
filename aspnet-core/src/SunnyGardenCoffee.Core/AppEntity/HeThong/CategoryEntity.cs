using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("Category")]
    public class CategoryEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        [MaxLength(50)]
        public string CategoryCode { get; set; }  
        [MaxLength(250)]
        public string CategoryName { get; set; } 
        [MaxLength(250)]
        public string Note { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class CategoryDomain : Entity<long>
    {
        [MaxLength(50)]
        public string CategoryCode { get; set; }
        [MaxLength(250)]
        public string CategoryName { get; set; }
        [MaxLength(250)]
        public string Note { get; set; }
        //Tenant
        public int TenantId { get; set; }

    }
}
