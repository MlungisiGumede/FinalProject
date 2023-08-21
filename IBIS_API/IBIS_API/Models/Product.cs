﻿using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Product
    {

        [Key]

    public int Product_ID { get; set; }
	public string? Product_Name { get; set; }
        public string? Category { get; set; }
        public string? Subcategory { get; set; }
        public int? Price { get; set; }
        public int? Quantity { get; set; }
        public string? Expiry { get; set; }

        public int? Write_Off_Id { get; set; }

        public string? item_name { get; set; }
        public string? Quantity_Written_Off { get; set; }
        public string? Reason { get; set; }
        public string? Image { get; set; }

        // public virtual Product_Price? Product_Price_ID { get; set; }
        //public virtual Product_Status? Product_Status_ID { get; set; }
        //public virtual Product_Categories? Product_Categories_ID { get; set; }   









    }
}
