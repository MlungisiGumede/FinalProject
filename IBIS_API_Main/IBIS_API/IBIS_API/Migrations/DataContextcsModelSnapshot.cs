﻿// <auto-generated />
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

            modelBuilder.Entity("IBIS_API.Models.Inventory", b =>
                {
                    b.Property<int>("Inventory_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Inventory_ID"));

                    b.Property<string>("Inventory_Items")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Invoice")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ItemName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Products")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Quantity")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SKU")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SupplierID")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Inventory_ID");

                    b.ToTable("Inventories");
                });

            modelBuilder.Entity("IBIS_API.Models.Order", b =>
                {
                    b.Property<int>("Order_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Order_ID"));

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.HasKey("Order_ID");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("IBIS_API.Models.Product", b =>
                {
                    b.Property<int>("Product_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Product_ID"));

                    b.Property<string>("Category")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Expiry")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Price")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Product_Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Quantity")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Subcategory")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Product_ID");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("IBIS_API.Models.Supplier", b =>
                {
                    b.Property<int>("Supplier_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Supplier_ID"));

                    b.Property<string>("City")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CompanyName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Country")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Region")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("address")
                        .HasColumnType("int");

                    b.Property<string>("addressline")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("postalcode")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Supplier_ID");

                    b.ToTable("suppliers");
                });

            modelBuilder.Entity("IBIS_API.Models.User_Account", b =>
                {
                    b.Property<int>("User_Account_ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("User_Account_ID"));

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Cellphone_Number")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Surname")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("User_Account_ID");

                    b.ToTable("User_Accounts");
                });
#pragma warning restore 612, 618
        }
    }
}
