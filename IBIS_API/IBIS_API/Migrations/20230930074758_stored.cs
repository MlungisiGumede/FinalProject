using IBIS_API.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Security.Cryptography;

#nullable disable

namespace IBIS_API.Migrations
{
    /// <inheritdoc />
    public partial class stored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sp = @"CREATE PROCEDURE [dbo].[CalculateTotal]
                    @CustomerOrder_ID varchar(50)
                AS
                BEGIN
                    SET NOCOUNT ON;
                    select * from CustomerOrdersLine where CustomerOrder_ID = @CustomerOrder_ID
                END";

            var sp2 = @"CREATE PROCEDURE [dbo].[CalculateTotal]
                    @SupplierOrder_ID varchar(50)
                AS
                BEGIN
                    SET NOCOUNT ON;
                    select * from SupplierOrderLines where SupplierOrder_ID = @SupplierOrder_ID
                END";
            //ord.Total = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == customerOrder.CustomerOrder_ID).Sum(c => c.Quantity * c.Price);


            migrationBuilder.Sql(sp);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
