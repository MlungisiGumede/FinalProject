using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Twilio.TwiML.Voice;
using System.Text.Json;
using System.Text.Json.Serialization;


namespace IBIS_API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : Controller
    {
        private readonly DataContextcs _context;
        private readonly UserManager<AppUser> _userManager;
        public CustomersController(DataContextcs context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        [HttpGet]
        [Route("getAll")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomer()
        {
            return await _context.Customers.ToListAsync();
        }


        // GET: api/Addresses/5
        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var cus = await _context.Customers.FindAsync(id);

            if (cus == null)
            {
                return NotFound();
            }

            return cus;
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutCustomer(Customer cus)
        {
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();
            var cusFound = _context.Customers.Where(c => c.Customer_ID == cus.Customer_ID).First();
            _context.ChangeTracker.Clear();
           // var cusOrigin = _context.Customers.Where(c => c.Customer_ID == cus.Customer_ID).FirstOrDefault();
            var user = await _userManager.FindByEmailAsync(cus.Email);
            
            if(user != null && user.Email == cus.Email && cusFound.Email != cus.Email)
            {
                return BadRequest("Email already exist for another user");
            }
          
            AuditTrail audit = new AuditTrail();
           
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Customer";
            var config = new { Customer_ID = cus.Customer_ID, Customer_FirstName = cus.Customer_FirstName, Customer_Surname = cus.Customer_Surname, Phone = cus.Phone, Email = cus.Email, Address = cus.Address };
            var str = JsonSerializer.Serialize(config);
            audit.Description = str;
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            //audit.Description = "Edit Customer Details:" + Environment.NewLine + cus.Customer_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + cus.Phone + Environment.NewLine + cus.Email + Environment.NewLine + cus.Address; ;
            _context.Entry(cus).State = EntityState.Modified;
            _context.Add(audit);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                //if (!CustomerExists(id))
                //{
                //    return NotFound();
                //}
                //else
                //{
                //    throw;
                //}
            }

            return NoContent();
        }

        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Customer>> PostCustomer(Customer cus)
        {
            var user = await _userManager.FindByEmailAsync(cus.Email);
            if (user != null)
            {
                return BadRequest("Email already exist for another user");
            }
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Customer";
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            audit.Description = "Edit Customer Details:" + Environment.NewLine + cus.Customer_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + cus.Phone + Environment.NewLine + cus.Email + Environment.NewLine + cus.Address; ;
            //var user = await _userManager.FindByNameAsync(username);
            using (var context = _context.Database.BeginTransaction())
            {
                _context.Customers.Add(cus);
                await _context.SaveChangesAsync();
                var config = new { Customer_ID = cus.Customer_ID, Customer_FirstName = cus.Customer_FirstName, Customer_Surname = cus.Customer_Surname, Phone = cus.Phone, Email = cus.Email, Address = cus.Address };
                var str = JsonSerializer.Serialize(config);
                audit.Description = str;
                _context.Add(audit);
                await _context.SaveChangesAsync();
                context.Commit();

            }
          
            
            return CreatedAtAction("GetCustomer", new { id = cus.Customer_ID }, cus);
        }

        // DELETE: api/Addresses/5
    
        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Customer_ID == id);
        }
    }
}

