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

namespace IBIS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManyToManyController : ControllerBase
    {


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

        [HttpPut]
        [Route("putCustomerOrderStatus")]
        public async Task<ActionResult> PutCustomerOrderStatus(CustomerOrder ord)
        {
            // dont send primary key of order lines through...
            _context.Entry(ord).State = EntityState.Modified; // nah do the whole attaching thing...

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerOrder(int id)
        {
            var order = await _context.CustomerOrders.FindAsync(id);
            _context.Remove(order);

            var orderLines = _context.CustomerOrdersLine.Where(c => c.CustomerOrder_ID == id).Select(c => c).ToList();
            _context.CustomerOrdersLine.RemoveRange(orderLines);
            await _context.SaveChangesAsync();
            return NoContent();
        }

     


    }
}
