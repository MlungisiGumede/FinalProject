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


namespace IBIS_API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : Controller
    {
        private readonly DataContextcs _context;
       
        public CustomersController(DataContextcs context)
        {
            _context = context;
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
           
          
            AuditTrail audit = new AuditTrail();
           
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Customer";
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            audit.Description = "Edit Customer Details:" + Environment.NewLine + cus.Customer_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + cus.Phone + Environment.NewLine + cus.Email + Environment.NewLine + cus.Address; ;
            _context.Entry(cus).State = EntityState.Modified;

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
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            UserRoleVM uRVM = new UserRoleVM();


            AuditTrail audit = new AuditTrail();

            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Customer";
            //var supplier = _context.Inventories.Where(c => c.Supplier_ID == sup.Supplier_ID).First();
            audit.Description = "Edit Customer Details:" + Environment.NewLine + cus.Customer_ID + Environment.NewLine + cus.Customer_FirstName + " " + cus.Customer_Surname + Environment.NewLine + cus.Phone + Environment.NewLine + cus.Email + Environment.NewLine + cus.Address; ;
            //var user = await _userManager.FindByNameAsync(username);
            _context.Customers.Add(cus);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomer", new { id = cus.Customer_ID }, cus);
        }

        // DELETE: api/Addresses/5
    
        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Customer_ID == id);
        }
    }
}

