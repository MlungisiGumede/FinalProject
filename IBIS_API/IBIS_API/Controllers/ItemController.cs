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
using Twilio.TwiML.Voice;
//using Newtonsoft.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Putinv(int id, Inventory sup)
        {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
            // var categories = _context.Categories.Where(c => c.Category_ID == prod.Category_ID).First();
            //var subCategories = _context.SubCategories.Where(c => c.SubCategory_ID == prod.SubCategory_ID).First();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Inventory";
            var supplier = _context.Suppliers.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            var config = new { Inventory_ID = sup.Inventory_ID,sku = sup.Sku, Name = sup.Name, SupplierName = supplier.Name };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;

            //audit.Description = "Edit Inventory Details:" + Environment.NewLine + sup.Inventory_ID + Environment.NewLine + sup.Sku + Environment.NewLine + sup.Name + Environment.NewLine + supplier.Name;
            _context.AuditTrail.Add(audit);

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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Inventory>> PostInv(Inventory inventory)
        {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
           // var categories = _context.Categories.Where(c => c.Category_ID == prod.Category_ID).First();
            //var subCategories = _context.SubCategories.Where(c => c.SubCategory_ID == prod.SubCategory_ID).First();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Inventory";
            var supplier = _context.Suppliers.Where(c => c.Supplier_ID == inventory.Supplier_ID).First();
            using (var context = _context.Database.BeginTransaction())
            {
                _context.Inventories.Add(inventory);
                await _context.SaveChangesAsync();
                var config = new { Inventory_ID = inventory.Inventory_ID, sku = inventory.Sku, Name = inventory.Name, SupplierName = supplier.Name };
                var str = JsonSerializer.Serialize(config);
                audit.Description = str;
                _context.AuditTrail.Add(audit);
                await _context.SaveChangesAsync();
                context.Commit();
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteInv(int id)
        {
            var sup = await _context.Inventories.FindAsync(id);
            if (sup == null)
            {
                return NotFound();
            }
          var orderlines =  _context.SupplierOrderLines.Where(c => c.Inventory_ID == id).ToList();
            if(orderlines.Count() > 0) // any suggested by AI...
            {
                return BadRequest("Cant Remove Inventories that appear on orders");
            }
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
            // var categories = _context.Categories.Where(c => c.Category_ID == prod.Category_ID).First();
            //var subCategories = _context.SubCategories.Where(c => c.SubCategory_ID == prod.SubCategory_ID).First();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Delete Inventory";
            var supplier = _context.Suppliers.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            var config = new { Inventory_ID = sup.Inventory_ID,sku = sup.Sku, Name = sup.Name, SupplierName = supplier.Name };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
           // audit.Description = "Delete Inventory Details:" + Environment.NewLine + sup.Inventory_ID + Environment.NewLine + sup.Sku + Environment.NewLine + sup.Name + Environment.NewLine + supplier.Name;
            _context.Inventories.Remove(sup);
            _context.Add(audit);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool InvExists(int id)
        {
            return _context.Inventories.Any(e => e.Inventory_ID == id);
        }
    }
}

