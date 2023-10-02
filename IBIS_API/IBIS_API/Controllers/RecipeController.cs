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
//using Newtonsoft.Json;
using System.Text.Json;
using Twilio.TwiML.Voice;

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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutRecipe(int id, Recipe rec)
        {
            var userClaims = User;

            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            AuditTrail audit = new AuditTrail();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Recipe";
            audit.Description = JsonSerializer.Serialize(rec);
            _context.Add(audit);
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Recipe>> PostRecipe(Recipe rec)
        {
            var userClaims = User;
           
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
           
            AuditTrail audit = new AuditTrail();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Recipe";
          
            using (var context = _context.Database.BeginTransaction())
            {
                _context.Recipes.Add(rec);
                await _context.SaveChangesAsync();
                audit.Description = JsonSerializer.Serialize(rec);
                _context.Add(audit);
                await _context.SaveChangesAsync();
                context.Commit();

            }

               

            return CreatedAtAction("GetRecipe", new { id = rec.Recipe_ID  }, rec);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var rec = await _context.Recipes.FindAsync(id);
            var userClaims = User;

            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            AuditTrail audit = new AuditTrail();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Delete Recipe";
            audit.Description = JsonSerializer.Serialize(rec);
            if (rec == null)
            {
                return NotFound();
            }
            _context.Add(audit);
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

