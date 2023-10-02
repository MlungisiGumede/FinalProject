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

            var sp2 = @"CREATE PROCEDURE [dbo].[CalculateSupplierTotal]
                    @SupplierOrder_ID varchar(50)
                AS
                BEGIN
                    SET NOCOUNT ON;
                    select * from SupplierOrderLines where SupplierOrder_ID = @SupplierOrder_ID
                END";
            var sp3 = @"CREATE PROCEDURE [dbo].[ReadProducts]
                   
                AS
                BEGIN
                    
                    select * from Products
                END";
            var sp4 = @"CREATE PROCEDURE [dbo].[ReadInventory]
                   
                AS
                BEGIN
                    
                    select * from Inventories
                END";
            var sp5 = @"CREATE PROCEDURE [dbo].[ReadSuppliers]
                   
                AS
                BEGIN
                    
                    select * from Suppliers
                END";

            var sp6 = @"CREATE PROCEDURE [dbo].[ReadCustomers]
                   
                AS
                BEGIN
                    
                    select * from Customers
                END";
            //ord.Total = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == customerOrder.CustomerOrder_ID).Sum(c => c.Quantity * c.Price);


            migrationBuilder.Sql(sp);
            migrationBuilder.Sql(sp3);
            migrationBuilder.Sql(sp4);
            migrationBuilder.Sql(sp5);
            migrationBuilder.Sql(sp6);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
