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
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace IBIS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class SuppliersController : ControllerBase
    {

            private readonly DataContextcs _context;

            public SuppliersController(DataContextcs context)
            {
                _context = context;
            }


            [HttpGet]
            [Route("getAll")]
       // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
            {
                return await _context.Suppliers.ToListAsync();
            }


            // GET: api/Addresses/5
            [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Supplier>> GetSupplier(int id)
            {
                var sup = await _context.Suppliers.FindAsync(id);

                if (sup == null)
                {
                    return NotFound();
                }

                return sup;
            }

            // PUT: api/Addresses/5
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutSupplier(int id, Supplier sup)
            {
                if (id != sup.Supplier_ID)
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
                    if (!SupplierExists(id))
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
            public async Task<ActionResult<Supplier>> PostSupplier(Supplier sup)
            {
                _context.Suppliers.Add(sup);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetSupplier", new { id = sup.Supplier_ID }, sup);
            }

            // DELETE: api/Addresses/5
            [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteSupplier(int id)
            {
                var sup = await _context.Suppliers.FindAsync(id);
                if (sup == null)
                {
                    return NotFound();
                }

                _context.Suppliers.Remove(sup);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            private bool SupplierExists(int id)
            {
                return _context.Suppliers.Any(e => e.Supplier_ID == id);
            }
        }
    }
