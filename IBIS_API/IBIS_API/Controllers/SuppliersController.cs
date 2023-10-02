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
using System.Text.Json;
using System.Text.Json.Serialization;

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
            //var order = _context.CustomerOrdersLine.FromSql($"CalculateTotal  {customerOrder.CustomerOrder_ID}").ToList();
            
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
            var userClaims = User;
           
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
           
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Supplier";
            audit.Description = "Supplier Edit Details:" + Environment.NewLine + sup.Supplier_ID + sup.Name + Environment.NewLine + sup.Email + Environment.NewLine + sup.Address + Environment.NewLine + sup.Phone;
            
            var str = JsonSerializer.Serialize(sup);
            audit.Description = str;
            _context.Add(audit);
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Supplier>> PostSupplier(Supplier sup)
            {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Supplier";
            audit.Description = "Supplier Added Details:" +  Environment.NewLine+sup.Supplier_ID + sup.Name + Environment.NewLine + sup.Email + Environment.NewLine + sup.Address + Environment.NewLine + sup.Phone;
            
           
            using (var context = _context.Database.BeginTransaction())
            {
                _context.Suppliers.Add(sup);
                await _context.SaveChangesAsync();
                var str = JsonSerializer.Serialize(sup);
                audit.Description = str;
                _context.Add(audit);
                await _context.SaveChangesAsync();
                context.Commit();
            }
              

                return CreatedAtAction("GetSupplier", new { id = sup.Supplier_ID }, sup);
            }

            // DELETE: api/Addresses/5
            [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteSupplier(int id)
            {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
            var sup = await _context.Suppliers.FindAsync(id);
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Delete Supplier";
            var str = JsonSerializer.Serialize(sup);
            audit.Description = str;
            _context.Add(audit);
            // audit.Description = "Supplier Deleted Details:" + Environment.NewLine + sup.Supplier_ID + sup.Name + Environment.NewLine + sup.Email + Environment.NewLine + sup.Address + Environment.NewLine + sup.Phone;
            //var user = await _userManager.FindByNameAsync(username);

            if (sup == null)
                {
                    return NotFound();
                }
            var orders = _context.Supplier_Orders.Where(c => c.Supplier_ID == id).ToList();
            var orderLines = _context.Supplier_Orders.ToList();
            if(orders.Count > 0)
            {
                return BadRequest("Cant Delete Supplier with orders");
            }
            //foreach (var order in orders)
            //{
            //    foreach (var orderLine in orderLines)
            //    {
            //        if (order.SupplierOrder_ID == orderLine.SupplierOrder_ID)
            //        {
            //            _context.Remove(orderLine);
            //        }
            //    }
            //}

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
