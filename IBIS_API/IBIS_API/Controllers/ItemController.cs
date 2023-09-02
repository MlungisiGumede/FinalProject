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
using Humanizer;

namespace IBIS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ItemController : ControllerBase
    {

        private readonly DataContextcs _context;

        public ItemController(DataContextcs context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("getAll")]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Inventory>>>  GetInventoriesList()
        {
            return await _context.Inventories.ToListAsync();
        }


        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Inventory>> Getinv(int id)
        {
            var sup = await _context.Inventories.FindAsync(id);

            if (sup == null)
            {
                return NotFound();
            }

            return sup;
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> Putinv(int id, Inventory sup)
        {
           
            if (id != sup.Inventory_ID)
            {
                return BadRequest();
            }

            _context.Entry(sup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvExists(id))
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
        public async Task<ActionResult<Inventory>> PostInv(Inventory inventory)
        {
            var inventoryItem = _context.Inventories.Where(c => c.Sku == inventory.Sku).FirstOrDefault();
            if (inventoryItem == null)
            {
                _context.Inventories.Add(inventory);
                await _context.SaveChangesAsync();
            }
            else
            {

            }
          ;

            return CreatedAtAction("GetInv", new { id = inventory.Inventory_ID }, inventory);
        }

        [HttpPost]
        [Route("getInventoriesPerSupplier")]
        public async Task<ActionResult<Inventory>> GetInventoriesPerSupplier(Supplier sup)
        {
            var inventories = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).ToList();
            if (!inventories.Any())
            {
                return NotFound();
            }
            return Ok(inventories);
           
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInv(int id)
        {
            var sup = await _context.Inventories.FindAsync(id);
            if (sup == null)
            {
                return NotFound();
            }

            _context.Inventories.Remove(sup);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool InvExists(int id)
        {
            return _context.Inventories.Any(e => e.Inventory_ID == id);
        }
    }
}

