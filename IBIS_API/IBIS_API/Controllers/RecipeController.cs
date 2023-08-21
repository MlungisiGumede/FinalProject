using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBIS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : Controller
    {
        private readonly DataContextcs _context;

        public RecipeController(DataContextcs context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("getAll")]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetSuppliers()
        {
            return await _context.Recipes.ToListAsync();
        }


        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            var rec = await _context.Recipes.FindAsync(id);

            if (rec == null)
            {
                return NotFound();
            }

            return rec;
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, Recipe rec)
        {
            if (id != rec.Recipe_ID)
            {
                return BadRequest();
            }

            _context.Entry(rec).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
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
        public async Task<ActionResult<Recipe>> PostRecipe(Recipe rec)
        {
            _context.Recipes.Add(rec);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecipe", new { id = rec.Recipe_ID  }, rec);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var rec = await _context.Recipes.FindAsync(id);
            if (rec == null)
            {
                return NotFound();
            }

            _context.Recipes.Remove(rec);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Recipe_ID == id);
        }
    }
}

