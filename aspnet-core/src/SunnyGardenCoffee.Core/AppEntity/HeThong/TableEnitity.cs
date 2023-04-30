using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SunnyGardenCoffee.Entities
{
    [Table("Table")]
    public class TableEntity : FullAuditedEntity<long>, IMustHaveTenant
    {
        [MaxLength(50)]
        public string CodeTable { get; set; }
        [MaxLength(250)]
        public string NameTable { get; set; }
        [MaxLength(250)]
        public string Note { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
    public class TableDomain : Entity<long>
    {
        [MaxLength(50)]
        public string CodeTable { get; set; }
        [MaxLength(250)]
        public string NameTable { get; set; }
        [MaxLength(250)]
        public string Note { get; set; }

        //Tenant
        public int TenantId { get; set; }
    }
}
