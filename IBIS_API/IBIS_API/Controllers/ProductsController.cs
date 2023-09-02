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
    public class ProductsController : Controller
    {
            private readonly DataContextcs _context;

            public ProductsController(DataContextcs context)
            {
                _context = context;
            }


            [HttpGet]
            [Route("getAll")]
       // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
            {
                return await _context.Products.ToListAsync();
            }


            // GET: api/Addresses/5
            [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Product>> GetProduct(int id)
            {
                var prod = await _context.Products.FindAsync(id);

                if (prod == null)
                {
                    return NotFound();
                }

                return prod;
            }

            // PUT: api/Addresses/5
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPut]
        [Route("putProduct")]
        public async Task<IActionResult> PutProduct(Product prod)
            {
              

                _context.Entry(prod).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException )
                {
                    if (!ProductExists(prod.Product_ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
               // return BadRequest(); return something maybe.... so that the thing closes with an error...?
                }

                return NoContent();
            }

            // POST: api/Addresses
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPost]
       // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Product>> PostProduct(Product prod)
            {
                _context.Products.Add(prod);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProduct", new { id = prod.Product_ID }, prod);
            }

            // DELETE: api/Addresses/5
            [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteProduct(int id)
            {
                var prod = await _context.Products.FindAsync(id);
                if (prod == null)
                {
                    return NotFound();
                }

                _context.Products.Remove(prod);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            private bool ProductExists(int id)
            {
                return _context.Products.Any(e => e.Product_ID == id);
            }
        }
    }
