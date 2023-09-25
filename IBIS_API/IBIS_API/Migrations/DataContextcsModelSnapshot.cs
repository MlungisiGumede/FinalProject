﻿// <auto-generated />
using System;
using IBIS_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace IBIS_API.Migrations
{
    [DbContext(typeof(DataContextcs))]
    partial class DataContextcsModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CustomerOrderProduct", b =>
                {
                    b.Property<int>("CustomerOrder_ID")
                        .HasColumnType("int");

                    b.Property<int>("Product_ID")
                        .HasColumnType("int");

                    b.HasKey("CustomerOrder_ID", "Product_ID");

                    b.HasIndex("Product_ID");

                    b.ToTable("CustomerOrderProduct");
                });

            modelBuilder.Entity("IBIS_API.Models.Address", b =>
                {
                    b.Property<int>("addressId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("addressId"));

                    b.Property<string>("addressline")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("postalcode")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("addressId");

                    b.ToTable("Addresses");
                });

            modelBuilder.Entity("IBIS_API.Models.Adjustment", b =>
                {
                    b.Property<int?>("Adjustment_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Adjustment_ID"));

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Adjustment_ID");

                    b.ToTable("AdjustmentTypes");
                });

            modelBuilder.Entity("IBIS_API.Models.AppUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FullName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool?>("Permissions")
                        .HasColumnType("bit");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("IBIS_API.Models.Category", b =>
                {
                    b.Property<int>("Category_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Category_ID"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Category_ID");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("IBIS_API.Models.Customer", b =>
                {
                    b.Property<int?>("Customer_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Customer_ID"));

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Customer_FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Customer_Surname")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Customer_ID");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("IBIS_API.Models.CustomerOrder", b =>
                {
                    b.Property<int?>("CustomerOrder_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("CustomerOrder_ID"));

                    b.Property<int?>("Customer_ID")
                        .HasColumnType("int");

                    b.Property<string>("Date_Created")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("OrderStatus_ID")
                        .HasColumnType("int");

                    b.Property<int?>("PaymentType_ID")
                        .HasColumnType("int");

                    b.Property<string>("Review")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ReviewClassification_ID")
                        .HasColumnType("int");

                    b.Property<string>("Transaction_ID")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CustomerOrder_ID");

                    b.ToTable("CustomerOrders");
                });

            modelBuilder.Entity("IBIS_API.Models.CustomerOrderLine", b =>
                {
                    b.Property<int>("CustomerOrder_ID")
                        .HasColumnType("int")
                        .HasColumnOrder(0);

                    b.Property<int>("Product_ID")
                        .HasColumnType("int")
                        .HasColumnOrder(1);

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<double>("Quantity")
                        .HasColumnType("float");

                    b.HasKey("CustomerOrder_ID", "Product_ID");

                    b.HasIndex("Product_ID");

                    b.ToTable("CustomerOrdersLine");
                });

            modelBuilder.Entity("IBIS_API.Models.Employee", b =>
                {
                    b.Property<int?>("Employee_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Employee_ID"));

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Employee_ID");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("IBIS_API.Models.FileUpload", b =>
                {
                    b.Property<int?>("FileUpload_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("FileUpload_ID"));

                    b.Property<string>("Base64")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("type")
                        .HasColumnType("int");

                    b.HasKey("FileUpload_ID");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("IBIS_API.Models.Inventory", b =>
                {
                    b.Property<int>("Inventory_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Inventory_ID"));

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Sku")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Supplier_ID")
                        .HasColumnType("int");

                    b.HasKey("Inventory_ID");

                    b.ToTable("Inventories");
                });

            modelBuilder.Entity("IBIS_API.Models.Order", b =>
                {
                    b.Property<int>("Order_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Order_ID"));

                    b.Property<string>("Order_Status")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Quantity")
                        .HasColumnType("int");

                    b.Property<int?>("supplier")
                        .HasColumnType("int");

                    b.Property<string>("supplierName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Order_ID");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("IBIS_API.Models.OrderStatus", b =>
                {
                    b.Property<int?>("OrderStatus_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("OrderStatus_ID"));

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("OrderStatus_ID");

                    b.ToTable("OrderStatusList");
                });

            modelBuilder.Entity("IBIS_API.Models.PaymentType", b =>
                {
                    b.Property<int?>("PaymentType_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("PaymentType_ID"));

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("PaymentType_ID");

                    b.ToTable("PaymentTypes");
                });

            modelBuilder.Entity("IBIS_API.Models.Product", b =>
                {
                    b.Property<int>("Product_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Product_ID"));

                    b.Property<int?>("Category_ID")
                        .HasColumnType("int");

                    b.Property<string>("Expiry")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Price")
                        .HasColumnType("float");

                    b.Property<double?>("Quantity")
                        .HasColumnType("float");

                    b.Property<int?>("SubCategory_ID")
                        .HasColumnType("int");

                    b.HasKey("Product_ID");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("IBIS_API.Models.Recipe", b =>
                {
                    b.Property<int>("Recipe_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Recipe_ID"));

                    b.Property<string>("Product_Id")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Products_Quantity")
                        .HasColumnType("int");

                    b.Property<string>("Recipe_Ingredients")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Recipe_Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Time_Required")
                        .HasColumnType("int");

                    b.HasKey("Recipe_ID");

                    b.ToTable("Recipes");
                });

            modelBuilder.Entity("IBIS_API.Models.ReviewClassification", b =>
                {
                    b.Property<int?>("ReviewClassification_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("ReviewClassification_ID"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ReviewClassification_ID");

                    b.ToTable("ReviewClassifications");
                });

            modelBuilder.Entity("IBIS_API.Models.SubCategory", b =>
                {
                    b.Property<int?>("SubCategory_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("SubCategory_ID"));

                    b.Property<int?>("Category_ID")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("SubCategory_ID");

                    b.ToTable("SubCategories");
                });

            modelBuilder.Entity("IBIS_API.Models.Supplier", b =>
                {
                    b.Property<int>("Supplier_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Supplier_ID"));

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Supplier_ID");

                    b.ToTable("Suppliers");
                });

            modelBuilder.Entity("IBIS_API.Models.SupplierOrder", b =>
                {
                    b.Property<int?>("SupplierOrder_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("SupplierOrder_ID"));

                    b.Property<string>("Date_Cancelled")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Date_Created")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Date_Sold")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("OrderStatus_ID")
                        .HasColumnType("int");

                    b.Property<int?>("Supplier_ID")
                        .HasColumnType("int");

                    b.HasKey("SupplierOrder_ID");

                    b.ToTable("Supplier_Orders");
                });

            modelBuilder.Entity("IBIS_API.Models.SupplierOrderLine", b =>
                {
                    b.Property<int>("SupplierOrder_ID")
                        .HasColumnType("int")
                        .HasColumnOrder(0);

                    b.Property<int>("Inventory_ID")
                        .HasColumnType("int")
                        .HasColumnOrder(1);

                    b.Property<double?>("Price")
                        .HasColumnType("float");

                    b.Property<double?>("Quantity")
                        .HasColumnType("float");

                    b.HasKey("SupplierOrder_ID", "Inventory_ID");

                    b.HasIndex("Inventory_ID");

                    b.ToTable("SupplierOrderLines");
                });

            modelBuilder.Entity("IBIS_API.Models.User_Account", b =>
                {
                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Cellphone_Number")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("time")
                        .HasColumnType("float");

                    b.HasKey("Username");

                    b.ToTable("User_Accounts");
                });

            modelBuilder.Entity("IBIS_API.Models.Write_Offs", b =>
                {
                    b.Property<int>("Write_Off_Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Write_Off_Id"));

                    b.Property<int?>("Adjustment_ID")
                        .HasColumnType("int");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Product_ID")
                        .HasColumnType("int");

                    b.Property<double?>("Quantity")
                        .HasColumnType("float");

                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Write_Off_Id");

                    b.ToTable("Write_Offss");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("CustomerOrderProduct", b =>
                {
                    b.HasOne("IBIS_API.Models.CustomerOrder", null)
                        .WithMany()
                        .HasForeignKey("CustomerOrder_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("IBIS_API.Models.Product", null)
                        .WithMany()
                        .HasForeignKey("Product_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("IBIS_API.Models.CustomerOrderLine", b =>
                {
                    b.HasOne("IBIS_API.Models.CustomerOrder", "CustomerOrder")
                        .WithMany()
                        .HasForeignKey("CustomerOrder_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("IBIS_API.Models.Product", "Product")
                        .WithMany()
                        .HasForeignKey("Product_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerOrder");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("IBIS_API.Models.SupplierOrderLine", b =>
                {
                    b.HasOne("IBIS_API.Models.Inventory", "Inventory")
                        .WithMany()
                        .HasForeignKey("Inventory_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("IBIS_API.Models.SupplierOrder", "SupplierOrder")
                        .WithMany()
                        .HasForeignKey("SupplierOrder_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Inventory");

                    b.Navigation("SupplierOrder");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("IBIS_API.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("IBIS_API.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("IBIS_API.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("IBIS_API.Models.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
