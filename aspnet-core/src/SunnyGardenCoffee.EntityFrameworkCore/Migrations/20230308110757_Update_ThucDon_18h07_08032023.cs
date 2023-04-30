using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunnyGardenCoffee.Migrations
{
    public partial class Update_ThucDon_18h07_08032023 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Merchandise");

            migrationBuilder.AddColumn<string>(
                name: "CategoryCode",
                table: "Merchandise",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryCode",
                table: "Merchandise");

            migrationBuilder.AddColumn<long>(
                name: "CategoryId",
                table: "Merchandise",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
