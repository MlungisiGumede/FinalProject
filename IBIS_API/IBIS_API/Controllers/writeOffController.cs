using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace IBIS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class writeOffController : ControllerBase
    {

        private readonly DataContextcs _context;

        public writeOffController(DataContextcs context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("getAll")]
        public async Task<ActionResult<IEnumerable<Write_Offs>>> GetwriteOffs()
        {
            return await _context.Write_Offss.ToListAsync();
        }


        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Write_Offs>> GetwriteOff(int id)
        {
            var sup = await _context.Write_Offss.FindAsync(id);

            if (sup == null)
            {
                return NotFound();
            }

            return sup;
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutwriteOff(int id, Write_Offs sup)
        {
            if (id != sup.Write_Off_Id)
            {
                return BadRequest();
            }
          

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!writeOffExists(id))
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
        public async Task<ActionResult<Write_Offs>> PostWriteOff(Write_Offs writeOff)
        {
            using (var context = _context.Database.BeginTransaction())
            {
                AuditTrail audit = new AuditTrail();
                var adjustment = _context.AdjustmentTypes.FirstOrDefault();
                if (adjustment != null)
                {
                    var adjustment1 = new Adjustment();
                    var adjustment2 = new Adjustment();
                    adjustment1.Name = "Write Off";
                    adjustment2.Name = "Write Up";
                    _context.Add(adjustment1);
                    _context.Add(adjustment2);
                }
                var product = _context.Products.Where(c => c.Product_ID == writeOff.Product_ID).FirstOrDefault();
                if (writeOff.Adjustment_ID == 1)
                {
                    audit.Name = "Add Write-Off";
                    product.Quantity = product.Quantity - writeOff.Quantity;
                }
                else
                {
                    audit.Name = "Add Write-Off";
                    product.Quantity = product.Quantity + writeOff.Quantity;
                }

                _context.Write_Offss.Add(writeOff);
                await _context.SaveChangesAsync();
                var userClaims = User;
                var username = userClaims.FindFirstValue(ClaimTypes.Name);

               

                audit.User = username;
                audit.Date = DateTime.Now;
                var str = new { WriteOff_ID = writeOff.Write_Off_Id, productName = product.Name, quantity = writeOff.Quantity };
                audit.Description = JsonSerializer.Serialize(str);
               
                _context.Entry(product).State = EntityState.Modified;
                _context.Add(audit);
                await _context.SaveChangesAsync();
                context.Commit();
            }
            

            return CreatedAtAction("GetwriteOff", new { id = writeOff.Write_Off_Id }, writeOff);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeletewriteOff(int id)
        {
            AuditTrail audit = new AuditTrail();
            var sup = await _context.Write_Offss.FindAsync(id);
            var product = _context.Products.Where(c => c.Product_ID == sup.Product_ID).FirstOrDefault();
            if (sup == null)
            {
                return NotFound();
            }
            if (sup.Adjustment_ID == 1)
            {
                audit.Name = "Add Write-Off";
                product.Quantity = product.Quantity + sup.Quantity;
            }
            else
            {
                audit.Name = "Add Write-Off";
                product.Quantity = product.Quantity - sup.Quantity;
            }
           
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            audit.User = username;
            audit.Date = DateTime.Now;
           
            var str = new { WriteOff_ID = sup.Write_Off_Id, productName = product.Name, quantity = sup.Quantity };
            audit.Description = JsonSerializer.Serialize(str);
            
            _context.Entry(product).State = EntityState.Modified;
            _context.Add(audit);
            await _context.SaveChangesAsync();
            _context.Write_Offss.Remove(sup);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool writeOffExists(int id)
        {
            return _context.Write_Offss.Any(e => e.Write_Off_Id == id);
        }
    }
}
