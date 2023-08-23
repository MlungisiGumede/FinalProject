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
    public class InventoriesController : Controller
    {
        private readonly DataContextcs _context;

        public InventoriesController(DataContextcs context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("getAll")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetInventoryList()
        {
            return await _context.Inventories.ToListAsync();
        }


        
        [HttpGet("{id}")]
        public async Task<ActionResult<Inventory>> GetInventory(int id)
        {
            var inv = await _context.Inventories.FindAsync(id);

            if (inv == null)
            {
                return NotFound();
            }

            return inv;
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventory(int id, Inventory inv)
        {
            if (id != inv.Inventory_ID)
            {
                return BadRequest();
            }

            _context.Entry(inv).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryExists(id))
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

      
        [HttpPost]
        public async Task<ActionResult<Inventory>> PostInventory(Inventory inv)
        {
            _context.Inventories.Add(inv);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInventory", new { id = inv.Inventory_ID }, inv);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            var inv = await _context.Inventories.FindAsync(id);
            if (inv == null)
            {
                return NotFound();
            }

            _context.Inventories.Remove(inv);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool InventoryExists(int id)
        {
            return _context.Inventories.Any(e => e.Inventory_ID == id);
        }
    }
}
