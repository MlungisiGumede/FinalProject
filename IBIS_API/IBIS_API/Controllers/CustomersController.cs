using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace IBIS_API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : Controller
    {
        private readonly DataContextcs _context;

        public CustomersController(DataContextcs context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("getAll")]
      //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomer()
        {
            return await _context.Customers.ToListAsync();
        }


        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var cus = await _context.Customers.FindAsync(id);

            if (cus == null)
            {
                return NotFound();
            }

            return cus;
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(Customer cus)
        {
            // if (id != cus.Customer_ID)
            // {
            //     return BadRequest();
            // }

            _context.Entry(cus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                //if (!CustomerExists(id))
                //{
                //    return NotFound();
                //}
                //else
                //{
                //    throw;
                //}
            }

            return NoContent();
        }

        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer cus)
        {
            _context.Customers.Add(cus);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomer", new { id = cus.Customer_ID }, cus);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var cus = await _context.Customers.FindAsync(id);
            if (cus == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(cus);
            var orders = _context.CustomerOrders.Where(c => c.Customer_ID == id).ToList();
            var orderLines = _context.CustomerOrdersLine.ToList();
            foreach (var order in  orders)
            {
                foreach(var orderLine in orderLines)
                {
                    if(order.CustomerOrder_ID == orderLine.CustomerOrder_ID)
                    {
                        _context.Remove(orderLine);
                    }
                }
            }
            _context.RemoveRange(orders);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Customer_ID == id);
        }
    }
}

