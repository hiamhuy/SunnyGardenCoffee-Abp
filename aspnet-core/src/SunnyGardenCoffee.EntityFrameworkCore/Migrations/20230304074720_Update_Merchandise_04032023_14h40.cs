using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunnyGardenCoffee.Migrations
{
    public partial class Update_Merchandise_04032023_14h40 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Merchandise");

            migrationBuilder.AddColumn<float>(
                name: "Prices",
                table: "Merchandise",
                type: "float",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prices",
                table: "Merchandise");

            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "Merchandise",
                type: "int",
                nullable: true);
        }
    }
}
