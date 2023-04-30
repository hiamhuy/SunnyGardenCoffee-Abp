using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunnyGardenCoffee.Migrations
{
    public partial class Update_ThucDon_11h27_02032023 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Merchandise",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Merchandise");
        }
    }
}
