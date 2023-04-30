using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunnyGardenCoffee.Migrations
{
    public partial class update_billdetail_15032023_03h22 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Price",
                table: "BillDetail",
                type: "float",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "BillDetail");
        }
    }
}
