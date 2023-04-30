using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunnyGardenCoffee.Migrations
{
    public partial class Update_receipt_18032023_19h57 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "TotalPrice",
                table: "Receipt",
                type: "float",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Receipt");
        }
    }
}
