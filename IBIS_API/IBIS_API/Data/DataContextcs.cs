using IBIS_API.Models;
using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
//using System.Data.Entity;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace IBIS_API.Data
{
    public class DataContextcs : IdentityDbContext<AppUser, IdentityRole, string,
  IdentityUserClaim<string>, IdentityUserRole<string>, IdentityUserLogin<string>,
  IdentityRoleClaim<string>, IdentityUserToken<string>>
    //IdentityDbContext<AppUser, IdentityRole>
    {

        public DataContextcs(DbContextOptions<DataContextcs> options) : base(options)
        { }



        public DbSet<Address> Addresses { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<User_Account> User_Accounts { get; set; } 

        public DbSet<Inventory> Inventories { get; set; } 

        public DbSet<Order> Orders { get; set; } 

        public DbSet<Product> Products { get; set; }
        public DbSet<Recipe> Recipes { get; set; }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Write_Offs> Write_Offss { get; set; }

        public DbSet<CustomerOrder> CustomerOrders { get; set; }

        

        public DbSet<CustomerOrderLine> CustomerOrdersLine { get; set; }

        public DbSet<SupplierOrderLine> SupplierOrderLines { get; set; }

        public DbSet<SupplierOrder> Supplier_Orders { get; set; }

        public DbSet<OrderStatus> OrderStatusList { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }

        public DbSet<Adjustment> AdjustmentTypes { get; set; }

        public DbSet<PaymentType> PaymentTypes { get; set; }

        public DbSet<FileUpload> Files { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<ReviewClassification> ReviewClassifications { get; set; }

        public DbSet<AuditTrail> AuditTrail { get; set; }

         public DbSet<Event> Events { get; set; }

        public DbSet<Permission> Permissions { get; set; }

        public DbSet<UserPermissions> UserPermissions  { get; set; }


        /*
        public DbSet<Equipment> Equipment { get; set; } 
        public  DbSet<Equipment_Category> Equipment_Categories { get; set; } 
        public DbSet<Equipment_Depreciation> Equipment_Depreciations { get; set; } 
        public  DbSet<Equipment_Maintenance> Equipment_Maintenances { get; set; } 
        public  DbSet<Equipment_Status> Equipment_Statuses { get; set; } 
        public  DbSet<Expiry>Expiries { get; set; } 
        public  DbSet<Inventory_Item> Inventory_Items { get; set; } 
        public  DbSet<Inventory_item_Price> Inventory_Item_Prices { get; set; } 
        public  DbSet<Inventory_Price> Inventory_Prices{ get; set; } 
        public  DbSet<Inventory_Type> Inventory_Types { get; set; } 
        public  DbSet<Order_Details> Order_Details { get; set; } 
        public  DbSet<Order_Status> Order_Statuses { get; set; } 
        public  DbSet<Order_Type> Order_Types { get; set; } 
        public  DbSet<Payment_Method> Payment_Methods { get; set; } 
        public  DbSet<Product_Categories> Product_Categories { get; set; } 
        public  DbSet<Product_Price> Product_Prices { get; set; } 
        public  DbSet<Product_Status> Product_Statuses { get; set; } 
        public  DbSet<Recipe_Ingredients> Recipe_Ingredients { get; set; } 
        public  DbSet<Stock_On_Hand> Stock_On_Hands { get; set; } 
        public  DbSet<Supplier> suppliers { get; set; } 
        public  DbSet<Supplier_Order> Supplier_Orders { get; set; } 
        public  DbSet<Supplier_Order_Status> Supplier_Order_Statuses { get; set; } 

        public  DbSet<Supplier_Payment> Supplier_Payments { get; set; } 
        public  DbSet<User_Account_Type> User_Account_Types { get; set; } 
        public  DbSet<Write_Offs> Write_Offss { get; set; } 
        public  DbSet<Write_Off_Status> Write_Off_statuses { get; set; }


     */

    }
   
}
