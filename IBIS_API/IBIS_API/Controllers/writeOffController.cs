using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

            _context.Entry(sup).State = EntityState.Modified;

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
        public async Task<ActionResult<Write_Offs>> PostWriteOff(Write_Offs writeOff)
        {
            _context.Write_Offss.Add(writeOff);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetwriteOff", new { id = writeOff.Write_Off_Id }, writeOff);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletewriteOff(int id)
        {
            var sup = await _context.Write_Offss.FindAsync(id);
            if (sup == null)
            {
                return NotFound();
            }

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
