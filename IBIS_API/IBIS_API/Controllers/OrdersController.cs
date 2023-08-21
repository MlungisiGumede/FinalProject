using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBIS_API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : Controller
    {
        private readonly DataContextcs _context;

        public OrdersController(DataContextcs context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("getAll")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }


        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var ord = await _context.Orders.FindAsync(id);

            if (ord == null)
            {
                return NotFound();
            }

            return ord;
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order ord)
        {
            if (id != ord.Order_ID)
            {
                return BadRequest();
            }

            _context.Entry(ord).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order ord)
        {
            _context.Orders.Add(ord);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = ord.Order_ID }, ord);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var ord = await _context.Orders.FindAsync(id);
            if (ord == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(ord);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Order_ID == id);
        }
    }
}
