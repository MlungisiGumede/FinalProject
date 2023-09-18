using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net.Mail;
using System.Net;
using DocumentFormat.OpenXml;
using ClosedXML.Excel;
using System.Globalization;
using DocumentFormat.OpenXml.VariantTypes;
using System.Security.Cryptography;

namespace IBIS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManyToManyController : ControllerBase
    {

        static string smtpAddress = "smtp.gmail.com";
        static int portNumber = 587;
        static bool enableSSL = true;
        static string emailFromAddress = "ma.gaitsmith@gmail.com"; //Sender Email Address  
                                                                   //Sender Password  
        static string emailToAddress = "ma.gaitsmith@gmail.com"; //Receiver Email Address  
        static string subject = "Hello";


        private readonly DataContextcs _context;
        public ManyToManyController(DataContextcs context)
        {
            _context = context;
        }
     
        [HttpGet]
        [Route("getCustomerOrders")]
        public async Task<ActionResult<IEnumerable<CustomerOrder>>> GetCustomerOrders()
        {
            var customerOrders = await _context.CustomerOrdersLine.ToListAsync();
            if (customerOrders.Count > 0)
            {
                return Ok(customerOrders);
            }
            return Ok();
        }
     
        [HttpPost]
[Route("PostCustomerOrder")]
public async Task<ActionResult> PostCustomerOrder(CustomerOrderViewModel? ord)
{
            var order = ord.CustomerOrder;
            order.OrderStatus_ID = 1;
            var orderLine = ord.CustomerOrderLines;
            _context.CustomerOrders.Add(order);
          
               
                    foreach (var line in orderLine)
                    {
                        var product = _context.Products.Find(line.Product_ID);
                        var addLine = new CustomerOrderLine
                        {
                            CustomerOrder = order,
                            Product = product
                        ,
                            Quantity = line.Quantity,
                            Price = line.Price
                        };

                        _context.CustomerOrdersLine.Add(addLine);
                    }
                    //_context.Database.ExecuteSqlRaw("Set IDENTITY_INSERT dbo.CustomerOrdersLine ON");
                    await _context.SaveChangesAsync();
                
            

    return Ok();
}

        [HttpPost]
        [Route("PostSupplierOrder")]
        public async Task<ActionResult> PostSupplierOrder(SupplierOrderViewModel? ord)
        {
            var order = ord.SupplierOrder;
            order.OrderStatus_ID = 1;
            var orderLine = ord.SupplierOrderLines;
            _context.Supplier_Orders.Add(order);


            foreach (var line in orderLine)
            {
                var inventory = _context.Inventories.Find(line.Inventory_ID);
                var addLine = new SupplierOrderLine
                {
                    SupplierOrder = ord.SupplierOrder,
                    Inventory = inventory
                ,
                    Quantity = line.Quantity,
                    Price = line.Price
                };

                _context.SupplierOrderLines.Add(addLine);
            }
            //_context.Database.ExecuteSqlRaw("Set IDENTITY_INSERT dbo.CustomerOrdersLine ON");
            await _context.SaveChangesAsync();



            return Ok();
        }
        [HttpGet]
        [Route("GenerateSubCategoriesReport")]
        public ActionResult GenerateSubCategoriesReport()
        {
            var subCategories = _context.SubCategories.ToList();
            System.Data.DataTable dt = new System.Data.DataTable("Grid");


            using (XLWorkbook wb = new XLWorkbook())
            {
                var worksheet = wb.Worksheets.Add("CustomerOrders");
                worksheet.ColumnWidth = 25; // can maybe try select index of the column...
                //worksheet.Cell(2, 1).InsertTable(dt);                     //wb2.SaveToFile("excel.xlsx");

                //worksheet.Cell(1, 1).InsertTable(dt);
                int i = 1;
                var j = 3;
                var maxLength = 0;
                var totalsList = new List<double?>();
                foreach (var subCategory in subCategories) // change to for loop...
                {
                    worksheet.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(1, i).Value = subCategory.Name; // try to set a header maybe...
                    //worksheet.Cell(1, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(1, i).Style.Fill.SetBackgroundColor(XLColor.BabyBlue);
                    worksheet.Range(worksheet.Cell(1, i), worksheet.Cell(1, i + 1)).Merge();
                    worksheet.Cell(2, i).Value = "Product Name";
                    worksheet.Cell(2, i + 1).Value = "Stock on Hand";
                    worksheet.Cell(2, i).Style.Fill.SetBackgroundColor(XLColor.Pink);
                    worksheet.Cell(2, i + 1).Style.Fill.SetBackgroundColor(XLColor.Pink);
                    // worksheet.Cell(2, i+1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center); // set border maybe...
                    // worksheet.Cell(2, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    double? subTotal = 0;
                    if (_context.Products.Where(c => c.SubCategory_ID == subCategory.SubCategory_ID).Any())
                    {
                        var products = _context.Products.Where(c => c.SubCategory_ID == subCategory.SubCategory_ID).ToList(); // product per the category

                        foreach (var product in products)
                        {
                            worksheet.Cell(j, i).Value = product.Name;
                            worksheet.Cell(j, i + 1).Value = product.Quantity;
                            subTotal = subTotal + product.Quantity;
                            j++;
                        }

                        totalsList.Add(subTotal);
                        subTotal = 0;
                    }
                    else
                    {
                        totalsList.Add(subTotal);
                    }
                    // display totals next to each other...
                    // worksheet.Cell(j, i).Value = "Total";
                    //worksheet.Cell(j, i + 1).Value = total;

                    i = i + 2;
                    if (j > maxLength)
                    {
                        maxLength = j;
                    }
                    j = 3;

                }
                double? total = 0;
                int rowIndex = 1;
                int k = 0;
                var totals = totalsList.ToArray();
                foreach (var subCategory in subCategories)
                {




                    total = total + totals[k];
                    worksheet.Cell(maxLength, rowIndex).Value = "Total";
                    worksheet.Cell(maxLength, rowIndex + 1).Value = "" + totals[k];

                    k = k + 1;
                    rowIndex = rowIndex + 2;
                }
                worksheet.Cell(maxLength, rowIndex).Value = "" + total;



                using (MemoryStream ms = new MemoryStream())
                using (var Writer = new StreamWriter(ms))
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber)) // where are the brackets...
                using (var message = new MailMessage(emailFromAddress, emailToAddress))
                {

                    //sheet
                    wb.SaveAs(ms);

                    // use try in the backend here...

                    //FileStream fs = new FileStream("c:\\ExcelFile.xlsx",FileMode.Create,FileAccess.Write);
                    // try with different type...
                    Writer.Flush();
                    ms.Position = 0;
                    message.Attachments.Add(new Attachment(ms, "SubCategories.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                    smtp.Credentials = new NetworkCredential(emailFromAddress, "sxkbtjguspnshajt");
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = enableSSL;
                    smtp.Send(message);
                    // ms.WriteTo(fs);
                    //fs.Close();
                    // ms.Close();
                    //File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ExcelFile.xlsx");
                }
            }

            return Ok();
        }

        [HttpGet]
        [Route("GenerateCategoriesReport")]
        public ActionResult GenerateCategoriesReport()
        {
            var categories = _context.Categories.ToList();
            System.Data.DataTable dt = new System.Data.DataTable("Grid");
           
           
            using (XLWorkbook wb = new XLWorkbook())
            {
                var worksheet = wb.Worksheets.Add("CustomerOrders");
                worksheet.ColumnWidth = 25; // can maybe try select index of the column...
                worksheet.Cell(2, 1).InsertTable(dt);                     //wb2.SaveToFile("excel.xlsx");
                
                //worksheet.Cell(1, 1).InsertTable(dt);
                int i = 1;
                var j = 3;
                var maxLength = 0;
                var totalsList = new List<double?>();
                foreach (var category in categories) // change to for loop...
                {
                    worksheet.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(1,i).Value = category.Name; // try to set a header maybe...
                    //worksheet.Cell(1, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(1, i).Style.Fill.SetBackgroundColor(XLColor.BabyBlue);
                    worksheet.Range(worksheet.Cell(1, i), worksheet.Cell(1, i+1)).Merge();
                    worksheet.Cell(2, i).Value = "Product Name";
                    worksheet.Cell(2, i+1).Value = "Stock on Hand";
                    worksheet.Cell(2, i).Style.Fill.SetBackgroundColor(XLColor.Pink);
                    worksheet.Cell(2, i+1).Style.Fill.SetBackgroundColor(XLColor.Pink);
                   // worksheet.Cell(2, i+1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center); // set border maybe...
                   // worksheet.Cell(2, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    double? subTotal = 0;
                    if (_context.Products.Where(c => c.Category_ID == category.Category_ID).Any())
                    {
                        var products = _context.Products.Where(c => c.Category_ID == category.Category_ID).ToList(); // product per the category
                       
                        foreach(var product in products)
                        {
                            worksheet.Cell(j, i).Value = product.Name;
                            worksheet.Cell(j, i+1).Value = product.Quantity;
                            subTotal = subTotal + product.Quantity;
                            j++;
                        }

                        totalsList.Add(subTotal);
                        subTotal = 0;
                    }
                    else
                    {
                        totalsList.Add(subTotal);
                    }
                    // display totals next to each other...
                    // worksheet.Cell(j, i).Value = "Total";
                    //worksheet.Cell(j, i + 1).Value = total;
                   
                    i = i + 2;
                    if(j > maxLength)
                    {
                        maxLength = j;
                    }
                    j = 3;    
                    
                }
                double? total = 0;
                int rowIndex = 1;
                int k = 0;
                var totals = totalsList.ToArray();
                foreach (var category in categories)
                {
                    
                    
                    
                    
                    total = total + totals[k];
                    worksheet.Cell(maxLength, rowIndex).Value = "Total";
                    worksheet.Cell(maxLength, rowIndex+1).Value = "" + totals[k];

                    k= k+1;
                    rowIndex = rowIndex + 2;
                }
                worksheet.Cell(maxLength, rowIndex).Value = ""+total;



                using (MemoryStream ms = new MemoryStream())
                using (var Writer = new StreamWriter(ms))
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber)) // where are the brackets...
                using (var message = new MailMessage(emailFromAddress, emailToAddress))
                {

                    //sheet
                    wb.SaveAs(ms);

                    // use try in the backend here...

                    //FileStream fs = new FileStream("c:\\ExcelFile.xlsx",FileMode.Create,FileAccess.Write);
                    // try with different type...
                    Writer.Flush();
                    ms.Position = 0;
                    message.Attachments.Add(new Attachment(ms, "Categories.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                    smtp.Credentials = new NetworkCredential(emailFromAddress, "sxkbtjguspnshajt");
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = enableSSL;
                    smtp.Send(message);
                    // ms.WriteTo(fs);
                    //fs.Close();
                    // ms.Close();
                    //File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ExcelFile.xlsx");
                }
            }

            return Ok();
        }

        [HttpGet]
        [Route("convertCustomerOrders")]
        public  ActionResult ConvertCustomerOrders()
        {

            System.Data.DataTable dt = new System.Data.DataTable("Grid");
            dt.Columns.AddRange(new DataColumn[6] { new DataColumn("Order ID"),
                                                     new DataColumn("Customer Name"),
                                                     new DataColumn("Date Created"),
                                                     new DataColumn("Product"),
                                                     new DataColumn("Price"),
                                                     new DataColumn("Quantity"),
                                                     });

            var customerOrderLines = _context.CustomerOrdersLine.ToList();
            var customerOrders = _context.CustomerOrders.ToList();
            foreach (var order in customerOrders)
            {
                foreach (var orderLine in customerOrderLines)
                {
                    if (order.CustomerOrder_ID == orderLine.CustomerOrder_ID)
                    {
                        var product = _context.Products.Where(c => c.Product_ID == orderLine.Product_ID).First(); // referential thingy...
                        var customer = _context.Customers.Where(c => c.Customer_ID == order.Customer_ID).First();
                        // find order and find product
                       
                        //var date = DateTime.Parse(order.Date_Created);
                        var split = order.Date_Created.Split(' ');
                        var date = new DateTime();
                        if(split.Length > 1)
                        {
                            var year = split[3];
                            var month = split[1];
                            var day = split[2];
                            var dateString = day + "/" + month + "/" + year;
                            date = DateTime.Parse(dateString);
                        }
                        else
                        {
                            DateTime start = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                             date = start.AddMilliseconds(long.Parse(order.Date_Created)).ToLocalTime();
                        }
                        
                        ;
                        
                        var shortDate = date.ToString("yyyy-MM-dd");
                        dt.Rows.Add(order.CustomerOrder_ID, customer.Customer_FirstName + " " + customer.Customer_Surname,shortDate, product.Name,orderLine.Price,orderLine.Quantity);
                    }
                   
                }
            }
               
            


            using (XLWorkbook wb = new XLWorkbook())
            {
                var worksheet = wb.Worksheets.Add( "CustomerOrders");
                worksheet.ColumnWidth = 25; // can maybe try select index of the column...
                                            //wb2.SaveToFile("excel.xlsx");
                worksheet.Cell(1, 1).Value = "Customer Orders Report";
                worksheet.Cell(2, 1).InsertTable(dt);

                using (MemoryStream ms = new MemoryStream())
                using (var Writer = new StreamWriter(ms))
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber)) // where are the brackets...
                using (var message = new MailMessage(emailFromAddress, emailToAddress))
                {

                    //sheet
                    wb.SaveAs(ms);

                    // use try in the backend here...

                    //FileStream fs = new FileStream("c:\\ExcelFile.xlsx",FileMode.Create,FileAccess.Write);
                    // try with different type...
                    Writer.Flush();
                    ms.Position = 0;
                    message.Attachments.Add(new Attachment(ms, "CustomerOrders.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                    smtp.Credentials = new NetworkCredential(emailFromAddress, "sxkbtjguspnshajt");
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = enableSSL;
                    smtp.Send(message);
                    // ms.WriteTo(fs);
                    //fs.Close();
                    // ms.Close();
                    //File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ExcelFile.xlsx");
                }
            }
            return Ok();
        }

    


        [HttpGet]
        [Route("convertSupplierOrders")]
        public ActionResult ConvertSupplierOrders()
        {
            System.Data.DataTable dt = new System.Data.DataTable("Grid");
            dt.Columns.AddRange(new DataColumn[6] { new DataColumn("Order ID"),
                                                     new DataColumn("Supplier Name"),
                                                     new DataColumn("Date Created"),
                                                     new DataColumn("Inventory Name"),
                                                     new DataColumn("Price"),
                                                     new DataColumn("Quantity"),
                                                     });

            var customerOrderLines = _context.SupplierOrderLines.ToList();
            var customerOrders = _context.Supplier_Orders.ToList();
            foreach (var order in customerOrders)
            {
                foreach (var orderLine in customerOrderLines)
                {
                    if (order.SupplierOrder_ID == orderLine.SupplierOrder_ID)
                    {
                        var inventory = _context.Inventories.Where(c => c.Inventory_ID == orderLine.Inventory_ID).First(); // referential thingy...
                        var supplier = _context.Suppliers.Where(c => c.Supplier_ID == order.Supplier_ID).First();
                        //var orderStatus = _context.OrderStatusList.Where(c => c.OrderStatus_ID == order.OrderStatus_ID).First();
                        // find order and find product
                        var split = order.Date_Created.Split(' ');
                        var date = new DateTime();
                        if (split.Length > 1)
                        {
                            var year = split[3];
                            var month = split[1];
                            var day = split[2];
                            var dateString = day + "/" + month + "/" + year;
                            date = DateTime.Parse(dateString);
                        }
                        else
                        {
                            DateTime start = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                            date = start.AddMilliseconds(long.Parse(order.Date_Created)).ToLocalTime();
                        }

                        ;

                        var shortDate = date.ToString("yyyy-MM-dd");
                       
                        dt.Rows.Add(order.SupplierOrder_ID, supplier.Name, shortDate, inventory.Name, orderLine.Price, orderLine.Quantity);
                    }

                }
            }




            using (XLWorkbook wb = new XLWorkbook())
            {
               
                var worksheet = wb.Worksheets.Add("SupplierOrders");
                worksheet.ColumnWidth = 25; // can maybe try select index of the column...
                                            //wb2.SaveToFile("excel.xlsx");
                                            // worksheet.Name = ;
                worksheet.Cell(1, 1).Value = "Supplier Orders Report";
                worksheet.Cell(2, 1).InsertTable(dt);


                using (MemoryStream ms = new MemoryStream())
                using (var Writer = new StreamWriter(ms))
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber)) // where are the brackets...
                using (var message = new MailMessage(emailFromAddress, emailToAddress))
                {

                    //sheet
                    wb.SaveAs(ms);

                    // use try in the backend here...

                    //FileStream fs = new FileStream("c:\\ExcelFile.xlsx",FileMode.Create,FileAccess.Write);
                    // try with different type...
                    Writer.Flush();
                    ms.Position = 0;
                    message.Attachments.Add(new Attachment(ms, "SupplierOrders.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                    smtp.Credentials = new NetworkCredential(emailFromAddress, "sxkbtjguspnshajt");
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = enableSSL;
                    smtp.Send(message);
                    // ms.WriteTo(fs);
                    //fs.Close();
                    // ms.Close();
                    //File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ExcelFile.xlsx");
                }
            }
            return Ok();
        }

        [HttpPut]
        [Route("putCustomerOrderStatus")]
        public async Task<ActionResult> PutCustomerOrderStatus(CustomerOrder ord)
        {
            // dont send primary key of order lines through...
            
            
            var products = _context.Products.ToList();
            if (ord.OrderStatus_ID == 2)
            {
                
                foreach ( var product in products)
                {

                    product.Quantity = product.Quantity - _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == ord.CustomerOrder_ID).Where(c => c.Product_ID == product.Product_ID).Sum(c => c.Quantity);
                    if (product.Quantity < 0)
                    {
                        return BadRequest("Can't have negative Stock on hand, First Problem returned : " + product.Name);
                    }
                    _context.Products.Update(product);
                }
                
            }
            else
            {
                var customerOrder = _context.CustomerOrders.Where(c => c.CustomerOrder_ID == ord.CustomerOrder_ID).FirstOrDefault();
                _context.ChangeTracker.Clear();
                if (customerOrder.OrderStatus_ID == 2)
                {
                   
                    foreach (var product in products)
                    {
                        var prod = product;
                        prod.Quantity = prod.Quantity + _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == ord.CustomerOrder_ID).Where(c => c.Product_ID == prod.Product_ID).Sum(c => c.Quantity);
                        product.Quantity = prod.Quantity;
                       
                        _context.Products.Update(prod);
                    }
                }
                else
                {
                    
                }
                //customerOrder.OrderStatus_ID == ord.OrderStatus_ID;
                
            }
            // nah do the whole attaching thing...

            // _context.Custom
            
            _context.CustomerOrders.Update(ord);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut]
        [Route("putSupplierOrderStatus")]
        public async Task<ActionResult> PutSupplierOrderStatus(SupplierOrder ord)
        {
            // dont send primary key of order lines through...
           
            _context.Entry(ord).State = EntityState.Modified; // nah do the whole attaching thing...

            await _context.SaveChangesAsync();

            return NoContent();
        }



        [HttpPut]
        [Route("PutSupplierOrder")]
        public async Task<ActionResult> PutSupplierOrder(SupplierOrderViewModel? ord)
        {
            // dont send primary key of order lines through...
            _context.Entry(ord.SupplierOrder).State = EntityState.Modified; // nah do the whole attaching thing...
            var orderLines = _context.SupplierOrderLines.Where(c => c.SupplierOrder_ID == ord.SupplierOrder.SupplierOrder_ID).Select(c => c).ToList();
            _context.SupplierOrderLines.RemoveRange(orderLines);
            var orderLine = ord.SupplierOrderLines;
            foreach (var line in orderLine)
            {
                var inventory = _context.Inventories.Find(line.Inventory_ID);
                var addLine = new SupplierOrderLine
                {
                    SupplierOrder = ord.SupplierOrder,
                    Inventory = inventory
                ,
                    Quantity = line.Quantity,
                    Price = line.Price
                };

                _context.SupplierOrderLines.Add(addLine);
            }
            //await _context.SaveChangesAsync();

            await _context.SaveChangesAsync();



            return NoContent();

        }
        [HttpGet]
        [Route("getCustomerOrdersVM")]
        public async Task<ActionResult> GetCustomerOrdersVM()
        {
            var customerOrders = _context.CustomerOrders.ToList();
            var customerOrderLine = _context.CustomerOrdersLine.ToList();
            List<CustomerOrderVM2> customerOrdersList = new List<CustomerOrderVM2>();
            foreach(var customerOrder in customerOrders) {
                CustomerOrderVM2? ord = new CustomerOrderVM2();
                ord.Customer_Name = _context.Customers.Where(c => c.Customer_ID == customerOrder.Customer_ID).Select(c => c.Customer_FirstName + " " + c.Customer_Surname).FirstOrDefault();
                ord.Date_Created = customerOrder.Date_Created;
                ord.CustomerOrder_ID = customerOrder.CustomerOrder_ID; // manage insert later...
                if(customerOrder.OrderStatus_ID == 1)
                {
                    ord.Order_Status = "In Progress";
                }
                else if(customerOrder.OrderStatus_ID == 2)
                {
                    ord.Order_Status = "Done";
                }
                else
                {
                    ord.Order_Status = "Cancel";
                }
                ord.Total = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == customerOrder.CustomerOrder_ID).Sum(c => c.Quantity * c.Price);
                customerOrdersList.Add(ord);
            }
            return Ok(customerOrdersList);
        }

        [HttpGet]
        [Route("getProductVM")]
        public async Task<ActionResult> GetProductVM()
        {
            var products = _context.Products.ToList();
            var productVMList = new List<ProductVM>();
            foreach(var product  in products)
            {
                var productVM = new ProductVM();
                productVM.Product_ID = product.Product_ID;
                productVM.Name = product.Name;
                productVM.Quantity = product.Quantity;
                var customerOrders = _context.CustomerOrders.Where(c => c.OrderStatus_ID == 1).ToList();
                productVM.QuantityAfterOrders = product.Quantity;
                foreach (var customerOrder in customerOrders)
                {

                   productVM.QuantityAfterOrders = productVM.QuantityAfterOrders -  _context.CustomerOrdersLine.Where(c => (c.CustomerOrder_ID == customerOrder.CustomerOrder_ID && c.Product_ID == product.Product_ID )).Sum(c => c.Quantity); 
                }
               productVMList.Add(productVM);
                
            }
            return Ok(productVMList);
        }



        [HttpPut]
        [Route("PutCustomerOrder")]
        public async Task<ActionResult> PutCustomerOrder(CustomerOrderViewModel? ord)
        {
            // dont send primary key of order lines through...
            _context.Entry(ord.CustomerOrder).State = EntityState.Modified; // nah do the whole attaching thing...
            var orderLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == ord.CustomerOrder.CustomerOrder_ID).Select(c => c).ToList();
            _context.CustomerOrdersLine.RemoveRange(orderLines);
            var orderLine = ord.CustomerOrderLines;
            foreach (var line in orderLine)
            {
                var product = _context.Products.Find(line.Product_ID);
                var addLine = new CustomerOrderLine
                {
                    CustomerOrder = ord.CustomerOrder,
                    Product = product
                ,
                    Quantity = line.Quantity,
                    Price = line.Price
                };

                _context.CustomerOrdersLine.Add(addLine);
            }
            //await _context.SaveChangesAsync();

            await _context.SaveChangesAsync();



            return NoContent();

        }
        // [HttpDelete("{id}")]


        [HttpDelete]
        [Route("deleteCustomerOrder/{id:int}")]
        public async Task<IActionResult> DeleteCustomerOrder(int id)
        {
            var order = await _context.CustomerOrders.FindAsync(id);
            _context.Remove(order);

            var orderLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == id).Select(c => c).ToList();
            _context.CustomerOrdersLine.RemoveRange(orderLines);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete]
        [Route("deleteSupplierOrder/{id:int}")]
        public async Task<IActionResult> DeleteSupplierOrder(int id)
        {
            var order = await _context.Supplier_Orders.FindAsync(id);
            _context.Remove(order);

            var orderLines = _context.SupplierOrderLines.Where(c => c.SupplierOrder_ID == id).Select(c => c).ToList();
            _context.SupplierOrderLines.RemoveRange(orderLines);
            await _context.SaveChangesAsync();
            return NoContent();
        }




    }
}
