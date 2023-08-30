using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBIS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        // https://stackoverflow.com/questions/64919574/change-name-of-generated-join-table-many-to-many-ef-core-5
        private readonly DataContextcs _context;

        public OrderController(DataContextcs context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("getSupplierOrderline")]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetSupplierOrderline()
        {
            var dbSupplierOrderLines = _context.SupplierOrderLines.ToList();
            //var supplierOrderLines = new List<SupplierOrderLine>();
            //foreach (var element in dbSupplierOrderLines)
            //{
            //    if (ID == element.Supplier_Order_ID)
            //    {
            //        //_context.Inventories.FindAsync(x => x.)
            //        // var inventory = _context.Inventories.First(x => x.Inventory_ID == element.Inventory_ID);
            //        supplierOrderLines.Add(element);
            //    }
            //}
            return Ok(dbSupplierOrderLines);
        }
        [HttpGet]
        [Route("getCustomerOrders")]
        public async Task<ActionResult<IEnumerable<CustomerOrder>>> GetCustomerOrders()
        {
            var customerOrders = await _context.CustomerOrders.ToListAsync();
            if (customerOrders.Count > 0)
            {
                return Ok(customerOrders);
            }
            return Ok();
        }
        [HttpGet]
        [Route("getSupplierOrders")]
        public async Task<ActionResult<IEnumerable<SupplierOrder>>> GetSupplierOrders()
        {
            var supplierOrders = await _context.Supplier_Orders.ToListAsync();
            if (supplierOrders.Count > 0)
            {
                return Ok(supplierOrders);
            }
            return Ok();
        }

        [HttpGet]
        [Route("getCustomerOrderline")]
        public async Task<ActionResult<IEnumerable<CustomerOrderLine>>> GetCustomerOrderline()
        {
            var customerOrderLine = _context.CustomerOrdersLine.ToList();
            //var orderLineList = new List<CustomerOrderLine>();
            //foreach (var element in customerOrderLine)
            //{
            //    //if (customerOrder.CustomerOrder_ID == element.Customer_Order_ID)
            //    //{
            //    //    element.
            //    //    //_context.Inventories.FindAsync(x => x.)
            //    //    //var product = _context.Products.First(x => x.Product_ID == element.Product_ID);
            //    //    orderLineList.Add(element);
            //    //}
            //}
            return Ok(customerOrderLine);
        }
        [HttpPost]
        [Route("PostSupplierOrder")]
        public async Task<ActionResult> PostSupplierOrder(SupplierOrderViewModel supplierOrderViewModel)
        {
            _context.Supplier_Orders.Add(supplierOrderViewModel.SupplierOrder);
            //List<SupplierOrderLine> supplierOrderLines = supplierOrderViewModel.SupplierOrderLines;
            //foreach (var line in supplierOrderLines)
            //{
            //    _context.SupplierOrderLines.Add(line);
            //}
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPost]
        [Route("PostCustomerOrder")]
        public async Task<ActionResult> PostCustomerOrder(CustomerOrder? ord)
        {
            ord.OrderStatus_ID = 1;
            _context.CustomerOrders.Add(ord);
            await _context.SaveChangesAsync();
            //ord.CustomerOrder_ID;



            return Ok(ord.CustomerOrder_ID);
        }
        [HttpPost]
        [Route("PostCustomerOrderLine")]
        public async Task<ActionResult> PostCustomerOrderLine(List<CustomerOrderLine> ord)
        {

            List<CustomerOrderLine> customerOrderLines = ord;
            foreach (var line in customerOrderLines)
            {
                _context.CustomerOrdersLine.Add(line);
            }
            await _context.SaveChangesAsync();



            return Ok();
        }
       


       
        [HttpPut]
        [Route("PutCustomerOrderLine")]
        public async Task<ActionResult> PutCustomerOrderLine(List<CustomerOrderLine> ord)
        {
            // dont send primary key of order lines through...
            // nah do the whole attaching thing...
            var dbCustomerOrderlines = _context.CustomerOrdersLine.ToList();
            var ordArray = ord.ToArray();
            //var id = ordArray[0].Customer_Order_ID;
            //foreach (var line in dbCustomerOrderlines)
            //{
            //    // if you can find the id else you then add it...

            //    if (line.Customer_Order_ID == id)
            //    {
            //        _context.CustomerOrdersLine.Remove(line);
            //    }

            //}
            
            foreach (var line in ord)
            {
                _context.CustomerOrdersLine.Add(line);
            }
            //_context.AddRange(customerOrderLines);
            await _context.SaveChangesAsync();





            return NoContent();
        }
        [HttpPut]
        [Route("PutSupplierOrder")]
        public async Task<ActionResult> PutSupplierOrder(SupplierOrderViewModel ord)
        {
            // dont send primary key of order lines through...
            _context.Entry(ord.SupplierOrder).State = EntityState.Modified; // nah do the whole attaching thing...
            var dbCustomerOrderlines = _context.CustomerOrdersLine.ToList();

            foreach (var line in dbCustomerOrderlines)
            {
                // if you can find the id else you then add it...

                //if (line.Customer_Order_ID == ord.SupplierOrder.SupplierOrder_ID)
                //{
                //    _context.CustomerOrdersLine.Remove(line);
                //}

            }
            //List<SupplierOrderLine> supplierOrderLines = ord.SupplierOrderLines;
            //foreach (var line in supplierOrderLines)
            //{
            //    _context.SupplierOrderLines.Add(line);
            //}
            //_context.AddRange(customerOrderLines);
            await _context.SaveChangesAsync();





            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerOrder(int Id)
        {
            var ord = await _context.CustomerOrders.FindAsync(Id);
            if (ord == null)
            {
                return NotFound();
            }

            _context.CustomerOrders.Remove(ord);

            var CustomerOrderalines = _context.CustomerOrdersLine.ToList();
            foreach (var line in CustomerOrderalines)
            {
                
                //if (line.Customer_Order_ID == ord.CustomerOrder_ID)
                //{
                //    _context.CustomerOrdersLine.Remove(line);
                //}
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        //[HttpDelete]
        //[Route("DeleteCustomerOrderLine")]
        //public async Task<IActionResult> DeleteCustomerOrderLine(int Id)
        //{
        //    var ord = await _context.CustomerOrders.FindAsync(Id);
        //    if (ord == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.CustomerOrders.Remove(ord);

        //    var CustomerOrderalines = _context.CustomerOrdersLine.ToList();
        //    foreach (var line in CustomerOrderalines)
        //    {

        //        if (line.Customer_Order_ID == ord.CustomerOrder_ID)
        //        {
        //            _context.CustomerOrdersLine.Remove(line);
        //        }
        //    }
        //    await _context.SaveChangesAsync();
        //    return NoContent();
        //}
        [HttpDelete]
        [Route("DeleteSupplierOrder")]
        public async Task<IActionResult> DeleteSupplierOrder(int Id)
        {
            var ord = await _context.Supplier_Orders.FindAsync(Id);
            if (ord == null)
            {
                return NotFound();
            }

            _context.Supplier_Orders.Remove(ord);

            var supplierOrderlines = _context.SupplierOrderLines.ToList();
            foreach (var line in supplierOrderlines)
            {
                //if (line.Supplier_Order_ID == ord.SupplierOrder_ID )
                //{
                //    _context.SupplierOrderLines.Remove(line);
                //}
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

