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
//using DocumentFormat.OpenXml;
using ClosedXML.Excel;
using System.Globalization;
using DocumentFormat.OpenXml.VariantTypes;
using System.Security.Cryptography;
using Spire.Xls;
using System.IO;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Spreadsheet;
using Spire.Pdf.Conversion;
using System;
using Spire.Pdf;
using Spire.Xls.Core;
using Microsoft.ML;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.Transforms.Onnx;
using IBIS_API.Models;
using BERTTokenizers;
using Google.Protobuf.WellKnownTypes;
using BERTTokenizers.Extensions;
using Microsoft.ML.Data;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Vml;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text.Json;
using System.Text.Json.Serialization;
using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

using PayFast;
using PayFast.AspNetCore;



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
        private readonly ILogger logger;
        private readonly UserManager<AppUser> _userManager;

        private readonly DataContextcs _context;
        //private static PredictionEngine<ModelInput, ModelOutput> _predengine;
       
        public ManyToManyController(DataContextcs context, ILogger<ManyToManyController> logger, UserManager<AppUser> userManager)//, PredictionEngine<ModelInput, ModelOutput> predictionengine)
        {
            _context = context;
            this.logger = logger;
            _userManager = userManager;
            // _predengine = predictionengine;
        }
        [HttpPost]
        [Route("Notify")]
        
        public async Task<IActionResult> Notify([ModelBinder(BinderType = typeof(PayFastNotifyModelBinder))] PayFastNotify payFastNotifyViewModel)
        {
            //payFastNotifyViewModel.SetPassPhrase(this.payFastSettings.PassPhrase);

            //var calculatedSignature = payFastNotifyViewModel.GetCalculatedSignature();

            //var isValid = payFastNotifyViewModel.signature == calculatedSignature;

            //this.logger.LogInformation($"Signature Validation Result: {isValid}");

            //// The PayFast Validator is still under developement
            //// Its not recommended to rely on this for production use cases
            //var payfastValidator = new PayFastValidator(this.payFastSettings, payFastNotifyViewModel, this.HttpContext.Connection.RemoteIpAddress);

            //var merchantIdValidationResult = payfastValidator.ValidateMerchantId();

            //this.logger.LogInformation($"Merchant Id Validation Result: {merchantIdValidationResult}");

            //var ipAddressValidationResult = await payfastValidator.ValidateSourceIp();

            //this.logger.LogInformation($"Ip Address Validation Result: {ipAddressValidationResult}");

            // Currently seems that the data validation only works for success
           
            var id = int.Parse(payFastNotifyViewModel.item_name);
            var order = _context.CustomerOrders.Where(c => c.CustomerOrder_ID == id).First();
            if (payFastNotifyViewModel.payment_status == PayFastStatics.CompletePaymentConfirmation)
            {
                var customerOrdersLine = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == order.CustomerOrder_ID).ToList();
                var cus1 = _context.Customers.Where(c => c.Customer_ID == order.Customer_ID).First();
                _context.ChangeTracker.Clear();
                double total1 = 0;
               
                foreach (var line in customerOrdersLine)
                {
                    total1 = total1 + (line.Quantity * line.Price);
                }
                order.Transaction_ID = payFastNotifyViewModel.pf_payment_id;
                AuditTrail audit = new AuditTrail();
                var user = await _userManager.FindByEmailAsync(cus1.Email);
                audit.User = user.UserName;
                audit.Date = DateTime.Now;
                audit.Name = "Payment For Order";
                
                var config2 = new { CustomerOrder_ID = order.CustomerOrder_ID, CustomerName = cus1.Customer_FirstName + " " + cus1.Customer_Surname, Transaction_ID = order.Transaction_ID, OrderStatus_ID = order.OrderStatus_ID, Total = total1 };
                var str2 = JsonSerializer.Serialize(config2);
                audit.Description = str2;
                //audit.Description = "Payment For Order:" + Environment.NewLine + ord.CustomerOrder_ID + Environment.NewLine + cus1.Customer_FirstName + " " + cus1.Customer_Surname + Environment.NewLine + ord.Date_Created + Environment.NewLine + ord.Transaction_ID + Environment.NewLine + ord.OrderStatus_ID + Environment.NewLine + total1;
                _context.AuditTrail.Add(audit);
                _context.CustomerOrders.Update(order);
                await _context.SaveChangesAsync();
            }

            if (payFastNotifyViewModel.payment_status == PayFastStatics.CancelledPaymentConfirmation)
            {
                return BadRequest("payment Cancelled");
                this.logger.LogInformation($"Subscription was cancelled");
            }

            return Ok();
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> PostCustomerOrder(CustomerOrderViewModel? ord)
        {
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Customer Order"; ;
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            var id = ord.CustomerOrder.Customer_ID;
            var order = ord.CustomerOrder;
            var cus = _context.Customers.Where(c => c.Customer_ID == ord.CustomerOrder.Customer_ID).First();
            
            //var ordLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == id).ToList();
            
            
            order.OrderStatus_ID = 1;
            var orderLine = ord.CustomerOrderLines;
           

            double total = 0;
           
            using (var context = _context.Database.BeginTransaction())
            {
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
                    total = total + (line.Quantity * line.Price);
                    _context.CustomerOrdersLine.Add(addLine);
                }
                _context.CustomerOrders.Add(order);
                await _context.SaveChangesAsync();
                var config = new { CustomerOrder_ID = order.CustomerOrder_ID, CustomerName = cus.Customer_FirstName + " " + cus.Customer_Surname, OrderStatus_ID = order.OrderStatus_ID, Total = total };
                var str = JsonSerializer.Serialize(config);
                audit.Description = str;
                //audit.Description = "Add Customer Order:" + Environment.NewLine + order.CustomerOrder_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + order.Date_Created + Environment.NewLine + total;
                _context.Add(audit);
                //_context.Database.ExecuteSqlRaw("Set IDENTITY_INSERT dbo.CustomerOrdersLine ON");
                await _context.SaveChangesAsync();
                context.Commit();
            }
                



            return Ok();
        }

        [HttpPost]
        [Route("PostSupplierOrder")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> PostSupplierOrder(SupplierOrderViewModel? ord)
        {
            var order = ord.SupplierOrder;
            order.OrderStatus_ID = 1;
            var orderLine = ord.SupplierOrderLines;
            //_context.Supplier_Orders.Add(order);


            
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Supplier Order";
            var supplier = _context.Suppliers.Where(c => c.Supplier_ID == ord.SupplierOrder.Supplier_ID).First();


            double? total = 0;

            var ordLines = _context.SupplierOrderLines.Where(c => c.SupplierOrder_ID == ord.SupplierOrder.SupplierOrder_ID).ToList();
            //await _context.SaveChangesAsync();
            foreach (var ordline in ordLines)
            {
                total = total + (ordline.Quantity * ordline.Price);
            }
            using (var context = _context.Database.BeginTransaction())
            {
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
                _context.Supplier_Orders.Add(order);
                await _context.SaveChangesAsync();
                var config = new { SupplierOrder_ID = ord.SupplierOrder.SupplierOrder_ID, SupplierName = supplier.Name, OrderStatus_ID = ord.SupplierOrder.OrderStatus_ID, Total = total };
                var str = JsonSerializer.Serialize(config);
                audit.Description = str;
                _context.Add(audit);
                //audit.Description = "Add Supplier Order:" + Environment.NewLine + ord.SupplierOrder.SupplierOrder_ID + Environment.NewLine + supplier.Name + Environment.NewLine + ord.SupplierOrder.Date_Created + Environment.NewLine + ord.SupplierOrder.OrderStatus_ID + Environment.NewLine + total;
                //_context.Database.ExecuteSqlRaw("Set IDENTITY_INSERT dbo.CustomerOrdersLine ON");
                await _context.SaveChangesAsync();
                context.Commit();
            }
               



            return Ok();
        }
        [HttpGet]
        [Route("GenerateSubCategoriesReportExcel")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
                    ms.Position = 0;
                    wb.SaveAs(ms);
                    Writer.Flush();
                    ms.Position = 0;
                    message.Attachments.Add(new Attachment(ms, "SubCategories.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                    //message.Attachments.Add(new Attachment(ms, "SubCategories.pdf", "application/pdf"));
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
        [Route("GenerateSubCategoriesReportPDF")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult GenerateSubCategoriesReport2()
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
                var maxLength = 0;
                var totalsList = new List<double?>();
                double? total = 0;
                foreach (var subCategory in subCategories) // change to for loop...
                {
                    worksheet.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(i, 1).Value = subCategory.Name; // try to set a header maybe...
                    //worksheet.Cell(1, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(i, 1).Style.Fill.SetBackgroundColor(XLColor.BabyBlue);
                    worksheet.Range(worksheet.Cell(i, 1), worksheet.Cell(i, 2)).Merge();
                    i++;
                    worksheet.Cell(i, 1).Value = "Product Name";
                    worksheet.Cell(i, 2).Value = "Stock on Hand";
                    worksheet.Cell(i, 1).Style.Fill.SetBackgroundColor(XLColor.Pink);
                    worksheet.Cell(i, 2).Style.Fill.SetBackgroundColor(XLColor.Pink);
                    // worksheet.Cell(2, i+1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center); // set border maybe...
                    // worksheet.Cell(2, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    double? subTotal = 0;

                    i++;
                    if (_context.Products.Where(c => c.SubCategory_ID == subCategory.SubCategory_ID).Any())
                    {
                        var products = _context.Products.Where(c => c.SubCategory_ID == subCategory.SubCategory_ID).ToList(); // product per the category

                        foreach (var product in products)
                        {
                            worksheet.Cell(i, 1).Value = product.Name;
                            worksheet.Cell(i, 2).Value = product.Quantity;
                            subTotal = subTotal + product.Quantity;
                            total = total + product.Quantity;
                            i++;
                        }
                        worksheet.Cell(i, 1).Value = "Total";
                        worksheet.Cell(i, 2).Value = subTotal;

                        subTotal = 0;
                    }
                    else
                    {
                        worksheet.Cell(i, 1).Value = "N/A";
                        worksheet.Cell(i, 2).Value = subTotal;
                    }

                    i++;
                }
                worksheet.Cell(i, 1).Value = "Total";
                worksheet.Cell(i, 1).Style.Fill.SetBackgroundColor(XLColor.Green);
                worksheet.Range(worksheet.Cell(i, 1), worksheet.Cell(i, 2)).Merge();
                worksheet.Cell(i + 1, 1).Value = "Total products";
                worksheet.Cell(i + 1, 2).Value = total;





                using (MemoryStream ms = new MemoryStream())
                using (var Writer = new StreamWriter(ms))
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber)) // where are the brackets...
                using (var message = new MailMessage(emailFromAddress, emailToAddress))
                {

                    //sheet
                    wb.SaveAs(ms);
                    Spire.Xls.Workbook book = new Spire.Xls.Workbook();
                    book.LoadFromStream(ms);
                    foreach (Spire.Xls.Worksheet sheet in book.Worksheets)
                    {
                        //set centered alignment
                        sheet.PageSetup.CenterHorizontally = true;
                        //sheet.PageSetup.CenterVertically = true;
                    }
                    book.SaveToStream(ms, Spire.Xls.FileFormat.PDF);
                    book.SaveToStream(ms, Spire.Xls.FileFormat.PDF);
                    var bytes = ms.ToArray();
                    var base64 = Convert.ToBase64String(bytes);

                    //PdfConverter pdfConverter = new PdfConverter(book);
                    //return File(ms,"application/pdf");
                    FileUpload file = new FileUpload();
                    file.Base64 = base64;
                    //return File(ms,"application/pdf");
                    return Ok(file);

                    // use try in the backend here...

                    //FileStream fs = new FileStream("c:\\ExcelFile.xlsx",FileMode.Create,FileAccess.Write);
                    // try with different type...
                    Writer.Flush();
                    ms.Position = 0;
                    message.Attachments.Add(new Attachment(ms, "SubCategories.pdf", "application/pdf"));
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
        [Route("GenerateCategoriesReportPDF")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult GenerateCatgeoriesReport2()
        {
            var categories = _context.Categories.ToList();
            System.Data.DataTable dt = new System.Data.DataTable("Grid");


            using (XLWorkbook wb = new XLWorkbook())
            {
                var worksheet = wb.Worksheets.Add("CustomerOrders");
                worksheet.ColumnWidth = 25; // can maybe try select index of the column...
                //worksheet.Cell(2, 1).InsertTable(dt);                     //wb2.SaveToFile("excel.xlsx");

                //worksheet.Cell(1, 1).InsertTable(dt);
                int i = 1;
                var maxLength = 0;
                var totalsList = new List<double?>();
                double? total = 0;
                foreach (var category in categories) // change to for loop...
                {
                    worksheet.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(i, 1).Value = category.Name; // try to set a header maybe...
                    //worksheet.Cell(1, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(i, 1).Style.Fill.SetBackgroundColor(XLColor.BabyBlue);
                    worksheet.Range(worksheet.Cell(i, 1), worksheet.Cell(i, 2)).Merge();
                    i++;
                    worksheet.Cell(i, 1).Value = "Product Name";
                    worksheet.Cell(i, 2).Value = "Stock on Hand";
                    worksheet.Cell(i, 1).Style.Fill.SetBackgroundColor(XLColor.Pink);
                    worksheet.Cell(i, 2).Style.Fill.SetBackgroundColor(XLColor.Pink);
                    // worksheet.Cell(2, i+1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center); // set border maybe...
                    // worksheet.Cell(2, i).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    double? subTotal = 0;

                    i++;
                    if (_context.Products.Where(c => c.SubCategory_ID == category.Category_ID).Any())
                    {
                        var products = _context.Products.Where(c => c.SubCategory_ID == category.Category_ID).ToList(); // product per the category

                        foreach (var product in products)
                        {
                            worksheet.Cell(i, 1).Value = product.Name;
                            worksheet.Cell(i, 2).Value = product.Quantity;
                            subTotal = subTotal + product.Quantity;
                            total = total + product.Quantity;
                            i++;
                        }
                        worksheet.Cell(i, 1).Value = "Total";
                        worksheet.Cell(i, 2).Value = subTotal;

                        subTotal = 0;
                    }
                    else
                    {
                        worksheet.Cell(i, 1).Value = "N/A";
                        worksheet.Cell(i, 2).Value = subTotal;
                    }

                    i++;
                }
                worksheet.Cell(i, 1).Value = "Total";
                worksheet.Cell(i, 1).Style.Fill.SetBackgroundColor(XLColor.Green);
                worksheet.Range(worksheet.Cell(i, 1), worksheet.Cell(i, 2)).Merge();
                worksheet.Cell(i + 1, 1).Value = "Total products";
                worksheet.Cell(i + 1, 2).Value = total;





                using (MemoryStream ms = new MemoryStream())
                using (var Writer = new StreamWriter(ms))
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber)) // where are the brackets...
                using (var message = new MailMessage(emailFromAddress, emailToAddress))
                {

                    //sheet
                    wb.SaveAs(ms);
                    Spire.Xls.Workbook book = new Spire.Xls.Workbook();
                    book.LoadFromStream(ms);
                    book.SaveToStream(ms, Spire.Xls.FileFormat.PDF);
                    foreach (Spire.Xls.Worksheet sheet in book.Worksheets)
                    {
                        //set centered alignment
                        sheet.PageSetup.CenterHorizontally = true;
                        //sheet.PageSetup.CenterVertically = true;
                    }
                    book.SaveToStream(ms, Spire.Xls.FileFormat.PDF);
                    book.SaveToStream(ms, Spire.Xls.FileFormat.PDF);
                    var bytes = ms.ToArray();
                    var base64 = Convert.ToBase64String(bytes);

                    //PdfConverter pdfConverter = new PdfConverter(book);
                    //return File(ms,"application/pdf");
                    FileUpload file = new FileUpload();
                    file.Base64 = base64;
                    //return File(ms,"application/pdf");
                    return Ok(file);

                    // use try in the backend here...

                    //FileStream fs = new FileStream("c:\\ExcelFile.xlsx",FileMode.Create,FileAccess.Write);
                    // try with different type...
                    Writer.Flush();
                    ms.Position = 0;
                    message.Attachments.Add(new Attachment(ms, "Categories.pdf", "application/pdf"));
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
        //[WebMethod]
        [Route("ConvertRate")]
        public ActionResult ConvertRate()
        {
            WebClient wb = new WebClient();
            var toCurrency = "USD";
            var fromCurrency = "AUD";
            WebClient web = new WebClient();
            string apiURL = String.Format("http://finance.google.com/finance/converter?a={0}&from={1}&to={2}", 1000, fromCurrency.ToUpper(), toCurrency.ToUpper());
            string response = web.DownloadString(apiURL);
            var split = response.Split((new string[] { "<span class=bld>" }), StringSplitOptions.None);
            var value = split[1].Split(' ')[0];
            decimal rate = decimal.Parse(value, CultureInfo.InvariantCulture);
            return Ok(rate);

        }

        [HttpGet]
        [Route("GenerateCategoriesReportExcel")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
                    worksheet.Cell(1, i).Value = category.Name; // try to set a header maybe...
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
                    if (_context.Products.Where(c => c.Category_ID == category.Category_ID).Any())
                    {
                        var products = _context.Products.Where(c => c.Category_ID == category.Category_ID).ToList(); // product per the category

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
                foreach (var category in categories)
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult ConvertCustomerOrders()
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
                        dt.Rows.Add(order.CustomerOrder_ID, customer.Customer_FirstName + " " + customer.Customer_Surname, shortDate, product.Name, orderLine.Price, orderLine.Quantity);
                    }

                }
            }




            using (XLWorkbook wb = new XLWorkbook())
            {
                var worksheet = wb.Worksheets.Add("CustomerOrders");
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
        //[HttpGet]
        //[Route("ClassifyReviews")]
        //public void GenerateReviews(CustomerOrder ord)
        //{


        //    MLContext mlContext = new MLContext();


        //    ModelInput modelInput = new ModelInput();

        //    BertUncasedLargeTokenizer token = new BertUncasedLargeTokenizer();
        //    // var customerOrders = _context.CustomerOrders.ToList();
        //    var tokenizer = new BertUncasedLargeTokenizer();
        //    List<string> reviewList = new List<string>();



        //    var input = ord.Review;
        //    //var arr = review.ToArray();

        //    var tokens = tokenizer.Tokenize();
        //    var encoded = tokenizer.Encode(512, input);
        //    // var encoded = token.Encode(32,input); // previous 32...


        //    var bertInput = new ModelInput()
        //    {
        //        InputIds = encoded.Select(t => t.InputIds).ToArray(),
        //        AttentionMask = encoded.Select(t => t.AttentionMask).ToArray(),

        //    };
        //    ModelInput ml = new ModelInput();
        //    var model = ml.ModelStartup2(tokens.Count());

        //    var output = _predengine.Predict(bertInput);
        //    var lastHiddenState = output.output0;
        //    string sentiment = "your mood is ";
        //    if (lastHiddenState[0] > lastHiddenState[1])
        //    {
        //        ord.ReviewClassification_ID = 0;
        //        reviewList.Add("negative");
        //    }
        //    else
        //    {
        //        ord.ReviewClassification_ID = 1;
        //        reviewList.Add("Positive");
        //    }
        //    //Bad 4.6,-3.7
        //    //Good - 4,4.4
        //    //Excellent - 4.2,4.5
        //    //Trash 4.5,-3.6

        //    // Define the sentiment labels and map the index to the corresponding label

        //    // var sentiment = sentimentLabels[maxIndex];
        //    //token.Untokenize(val);
        //    //output.
        //    //engine.Predict()


        //}

        [HttpPost]
        [Route("RecordReview")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> RecordReview(CustomerOrder ord)
        {
           // GenerateReviews(ord);
            
            _context.CustomerOrders.Update(ord);
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpGet]
        [Route("GenerateReviewsReport")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> GenerateReviewsReport()
        {
            var customerOrders = _context.CustomerOrders.Where(c => c.Review != null).ToList();

            System.Data.DataTable dt = new System.Data.DataTable("Review");
            dt.Columns.AddRange(new DataColumn[2] { new DataColumn("Review"),
            new DataColumn("Classification")});

            foreach (var customerOrder in customerOrders)
            {                            //worksheet.Cell(2, 1).InsertTable(dt);                     //wb2.SaveToFile("excel.xlsx");
                if (customerOrder.ReviewClassification_ID == 0)
                {
                    dt.Rows.Add(customerOrder.Review, "Negative");
                }
                else
                {
                    dt.Rows.Add(customerOrder.Review, "Positive");
                }



               

            using (XLWorkbook wb = new XLWorkbook())
                    {
                        var worksheet = wb.Worksheets.Add("Reviews");
                        worksheet.ColumnWidth = 25; // can maybe try select index of the column...
                    worksheet.Cell(1, 1).InsertTable(dt);
                    //wb.Worksheets.Add(dt, "Reviews");




                    using (MemoryStream ms = new MemoryStream())
                        using (var Writer = new StreamWriter(ms))
                        using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber)) // where are the brackets...
                        using (var message = new MailMessage(emailFromAddress, emailToAddress))
                        {

                            //sheet
                            ms.Position = 0;
                            wb.SaveAs(ms);
                            Writer.Flush();
                            ms.Position = 0;
                            message.Attachments.Add(new Attachment(ms, "Reviews.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                            //message.Attachments.Add(new Attachment(ms, "SubCategories.pdf", "application/pdf"));
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

                    
                }

            return Ok();
        }

        [HttpPut]
        [Route("putCustomerOrderStatus")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> PutCustomerOrderStatus(CustomerOrder ord)
        {
            // dont send primary key of order lines through...
            var order = _context.CustomerOrders.Where(c => c.CustomerOrder_ID == ord.CustomerOrder_ID).First();
            _context.ChangeTracker.Clear();
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Customer Order Status";
            if (ord.Transaction_ID != null && order.Transaction_ID == null)
            {
                var customerOrdersLine = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == order.CustomerOrder_ID).ToList();
                var cus1 = _context.Customers.Where(c => c.Customer_ID == order.Customer_ID).First();
                _context.ChangeTracker.Clear();
                double total1 = 0;
                audit.Name = "Payment For Order";
                foreach(var line in customerOrdersLine)
                {
                    total1 = total1 + (line.Quantity * line.Price);
                }
                 order.Transaction_ID = ord.Transaction_ID;
                 var config2 = new { CustomerOrder_ID = ord.CustomerOrder_ID, CustomerName = cus1.Customer_FirstName + " " + cus1.Customer_Surname, Transaction_ID = ord.Transaction_ID, OrderStatus_ID = ord.OrderStatus_ID, Total = total1 };
                 var str2 = JsonSerializer.Serialize(config2);
                audit.Description = str2;
                //audit.Description = "Payment For Order:" + Environment.NewLine + ord.CustomerOrder_ID + Environment.NewLine + cus1.Customer_FirstName + " " + cus1.Customer_Surname + Environment.NewLine + ord.Date_Created + Environment.NewLine + ord.Transaction_ID + Environment.NewLine + ord.OrderStatus_ID + Environment.NewLine + total1;
                _context.AuditTrail.Add(audit);
                _context.CustomerOrders.Update(order);
                await _context.SaveChangesAsync();

                return NoContent();
            }
           
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
            ord.Date_Created = order.Date_Created;
            var cus = _context.Customers.Where(c => c.Customer_ID == order.Customer_ID).First();
            double total = 0;
            
            var ordLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == ord.Customer_ID).ToList();
            foreach (var ordline in ordLines)
            {
                total = total + (ordline.Quantity * ordline.Price);
            }
            var config = new { CustomerOrder_ID = ord.CustomerOrder_ID, CustomerName = cus.Customer_FirstName + " " + cus.Customer_Surname, OrderStatus_ID = ord.OrderStatus_ID, Total = total };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
            //audit.Description = "Edit Customer Order Status:" + Environment.NewLine + ord.CustomerOrder_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + ord.Date_Created + Environment.NewLine + ord.Transaction_ID + Environment.NewLine + ord.OrderStatus_ID + Environment.NewLine + total;
            _context.AuditTrail.Add(audit);
            _context.CustomerOrders.Update(ord);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut]
        [Route("putSupplierOrderStatus")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> PutSupplierOrderStatus(SupplierOrder ord)
        {
            // dont send primary key of order lines through...
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Supplier Order Status";
           
            var supplier = _context.Suppliers.Where(c => c.Supplier_ID == ord.Supplier_ID).First();
            double? total = 0;

            var ordLines = _context.SupplierOrderLines.Where(c => c.SupplierOrder_ID == ord.SupplierOrder_ID).ToList();
            foreach (var ordline in ordLines)
            {
                total = total + (ordline.Quantity * ordline.Price);
            }
             var config = new { SupplierOrder_ID = ord.SupplierOrder_ID, SupplierName = supplier.Name, OrderStatus_ID = ord.OrderStatus_ID, Total = total };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
        
            //audit.Description = "Edit Supplier Order Status:" + Environment.NewLine + ord.SupplierOrder_ID + Environment.NewLine + supplier.Name  + Environment.NewLine + ord.Date_Created + Environment.NewLine + ord.OrderStatus_ID + Environment.NewLine + total;
            _context.Entry(ord).State = EntityState.Modified; // nah do the whole attaching thing...
            _context.Add(audit);
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
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Supplier Order";
            var supplier = _context.Suppliers.Where(c => c.Supplier_ID == ord.SupplierOrder.Supplier_ID).First();
            
           
            double? total = 0;

            var ordLines = _context.SupplierOrderLines.Where(c => c.SupplierOrder_ID == ord.SupplierOrder.SupplierOrder_ID).ToList();
            //await _context.SaveChangesAsync();
            foreach (var ordline in ordLines)
            {
                total = total + (ordline.Quantity * ordline.Price);
            }
            var config = new { SupplierOrder_ID = ord.SupplierOrder.SupplierOrder_ID, SupplierName = supplier.Name, OrderStatus_ID = ord.SupplierOrder.OrderStatus_ID, Total = total };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
            //audit.Description = "Edit Supplier Order:" + Environment.NewLine + ord.SupplierOrder.SupplierOrder_ID + Environment.NewLine + supplier.Name + Environment.NewLine + ord.SupplierOrder.Date_Created + Environment.NewLine + ord.SupplierOrder.OrderStatus_ID + Environment.NewLine + total;
             // nah do the whole attaching thing...
            _context.Add(audit);
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
                //ord.Transaction_ID = customerOrder.Transaction_ID;
                ord.CustomerOrder_ID = customerOrder.CustomerOrder_ID; // manage insert later...
                if(customerOrder.OrderStatus_ID == 1)
                {
                    if(customerOrder.Transaction_ID != null)
                    {
                        ord.Order_Status = "Paid and Pending";
                    }
                    else
                    {
                        ord.Order_Status = "Pending";
                    }
                   // ord.Order_Status = "In Progress";
                }
                else if(customerOrder.OrderStatus_ID == 2)
                {
                    if (customerOrder.Transaction_ID != null)
                    {
                        ord.Order_Status = "Completed and paid online";
                    }
                    else
                    {
                        ord.Order_Status = "Completed Instore";
                    }
                }
                else
                {
                    if (customerOrder.Transaction_ID != null)
                    {
                        ord.Order_Status = "Cancelled and refunded";
                    }
                    else
                    {
                        ord.Order_Status = "Cancelled";
                    }
                }
                var orders = _context.CustomerOrdersLine.FromSql($"CalculateTotal  {customerOrder.CustomerOrder_ID}").ToList();
                //var total = _context.CustomerOrdersLine.FromSql($"CalculateTotal  {customerOrder.CustomerOrder_ID}").First();
                ord.Total = orders.Sum(c => c.Quantity * c.Price);
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> PutCustomerOrder(CustomerOrderViewModel? ord)
        {
            // dont send primary key of order lines through...
            _context.Entry(ord.CustomerOrder).State = EntityState.Modified; // nah do the whole attaching thing...
            var orderLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == ord.CustomerOrder.CustomerOrder_ID).Select(c => c).ToList();

            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Customer Order"; ;
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID sup.Supplier_ID).First();
            var id = ord.CustomerOrder.CustomerOrder_ID;
            var order = await _context.CustomerOrders.FindAsync(id);
            var cus = _context.Customers.Where(c => c.Customer_ID == ord.CustomerOrder.CustomerOrder_ID).First();
            double total = 0;
            var ordLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == id).ToList();
            foreach (var ordline in ordLines)
            {
                total = total + (ordline.Quantity * ordline.Price);
            }
            var config = new { CustomerOrder_ID = ord.CustomerOrder.CustomerOrder_ID, CustomerName = cus.Customer_FirstName + " " + cus.Customer_Surname, OrderStatus_ID = ord.CustomerOrder.OrderStatus_ID, Total = total };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
            //audit.Description = "Edit Customer Order:" + Environment.NewLine + order.CustomerOrder_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + order.Date_Created + Environment.NewLine + total;
            _context.Add(audit);
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteCustomerOrder(int id)
        {
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Delete Customer Order"; ;
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            var order = await _context.CustomerOrders.FindAsync(id);
            var cus = _context.Customers.Where(c => c.Customer_ID == order.Customer_ID).First();
            double total = 0;
            var ordLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == id).ToList();
            foreach(var ord in ordLines)
            {
                total = total + (ord.Quantity * ord.Price);
            }
            var config = new { CustomerOrder_ID = order.CustomerOrder_ID, CustomerName = cus.Customer_FirstName + " " + cus.Customer_Surname, OrderStatus_ID = order.OrderStatus_ID, Total = total };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
            //audit.Description = "Delete Customer Order:" + Environment.NewLine + order.CustomerOrder_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + order.Date_Created + Environment.NewLine + total;
            _context.Add(audit);
            _context.Remove(order);

            var orderLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == id).Select(c => c).ToList();
            _context.CustomerOrdersLine.RemoveRange(orderLines);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete]
        [Route("deleteSupplierOrder/{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteSupplierOrder(int id)
        {
            var order = await _context.Supplier_Orders.FindAsync(id);
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Delete Supplier Order"; ;
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            
            var supplier = _context.Suppliers.Where(c => c.Supplier_ID == order.Supplier_ID).First();
            double? total = 0;
            var ordLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == id).ToList();
            var orderLines = _context.SupplierOrderLines.Where(c => c.SupplierOrder_ID == id).Select(c => c).ToList();
            foreach (var ord in orderLines)
            {
                total = total + (ord.Quantity * ord.Price);
            }
            var config = new { SupplierOrder_ID = order.SupplierOrder_ID, SupplierName = supplier.Name, OrderStatus_ID = order.OrderStatus_ID, Total = total };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
            //audit.Description = "Delete Supplier Order Details:" + Environment.NewLine + order.SupplierOrder_ID + Environment.NewLine + supplier.Name  + Environment.NewLine + order.Date_Created + Environment.NewLine + total;
            _context.Remove(order);
            _context.Add(audit);
            ;
            _context.SupplierOrderLines.RemoveRange(orderLines);
            await _context.SaveChangesAsync();
            return NoContent();
        }




    }
}
