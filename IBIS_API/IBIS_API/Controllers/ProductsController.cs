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
using DocumentFormat.OpenXml.Office2010.Excel;

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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutProduct(Product prod)
            {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
          var categories =   _context.Categories.Where(c => c.Category_ID == prod.Category_ID).First();
            var subCategories = _context.SubCategories.Where(c => c.SubCategory_ID == prod.SubCategory_ID).First();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Edit Product";
            audit.Description = "Edit Product Details:" + Environment.NewLine + prod.Product_ID + Environment.NewLine + prod.Name + Environment.NewLine + categories.Name + Environment.NewLine + subCategories.Name + Environment.NewLine + prod.Price + Environment.NewLine + prod.Quantity + Environment.NewLine;
            _context.AuditTrail.Add(audit);
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
        [HttpPost]
        [Route("postCategory")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Subcategory";
            //var categories = _context.Categories.Where(c => c.Category_ID == subCategory.Category_ID).First();
            audit.Description = "Add Category Details:" + Environment.NewLine + category.Category_ID + Environment.NewLine + category.Name;
            _context.AuditTrail.Add(audit);
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = category.Category_ID },category);
        }
        [HttpPost]
        [Route("postSubCategory")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<SubCategory>> PostSubCategory(SubCategory subCategory)
        {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Subcategory";
            var categories = _context.Categories.Where(c => c.Category_ID == subCategory.Category_ID).First();
            audit.Description = "Add SubCategory Details:" + Environment.NewLine + subCategory.SubCategory_ID + Environment.NewLine + subCategory.Name + Environment.NewLine + categories.Name + Environment.NewLine + subCategory.Name;
            _context.AuditTrail.Add(audit);
            _context.SubCategories.Add(subCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = subCategory.Category_ID }, subCategory);
        }
        [HttpGet]
        [Route("getCategories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {

            return await _context.Categories.ToListAsync();

            
   }
        [HttpGet]
        [Route("getSubCategories")]
        public async Task<ActionResult<IEnumerable<SubCategory>>> GetSubCategories()
        {

            return await _context.SubCategories.ToListAsync();


        }

        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Product>> PostProduct(Product prod)
            {
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            //var user = await _userManager.FindByNameAsync(username);
            AuditTrail audit = new AuditTrail();
            var categories = _context.Categories.Where(c => c.Category_ID == prod.Category_ID).First();
            var subCategories = _context.SubCategories.Where(c => c.SubCategory_ID == prod.SubCategory_ID).First();
            audit.User = username;
            audit.Date = DateTime.Now;
            audit.Name = "Add Product";
            audit.Description = "Add Product Details:" + Environment.NewLine + prod.Product_ID + Environment.NewLine + prod.Name + Environment.NewLine + categories.Name + Environment.NewLine + subCategories.Name + Environment.NewLine + prod.Price + Environment.NewLine + prod.Quantity + Environment.NewLine;
            _context.AuditTrail.Add(audit);
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
               var orderLines = _context.CustomerOrdersLine.Where(c => c.Product_ID == prod.Product_ID).ToList();
            if(orderLines.Count > 0)
            {
                return BadRequest("Cant delete product that appears on orders");
            }
            else
            {
                var userClaims = User;
                UserRoleVM uRVM = new UserRoleVM();
                var username = userClaims.FindFirstValue(ClaimTypes.Name);
                //var user = await _userManager.FindByNameAsync(username);
                AuditTrail audit = new AuditTrail();
                var categories = _context.Categories.Where(c => c.Category_ID == prod.Category_ID).First();
                var subCategories = _context.SubCategories.Where(c => c.SubCategory_ID == prod.SubCategory_ID).First();
                audit.User = username;
                audit.Date = DateTime.Now;
                audit.Name = "Delete Product";
                audit.Description = "Delete Product Details:" + Environment.NewLine + prod.Product_ID + Environment.NewLine + prod.Name + Environment.NewLine + categories.Name + Environment.NewLine + subCategories.Name + Environment.NewLine + prod.Price + Environment.NewLine + prod.Quantity + Environment.NewLine;
                _context.AuditTrail.Add(audit);
                _context.Products.Remove(prod);
                await _context.SaveChangesAsync();
            }

               

                return NoContent();
            }
            private bool ProductExists(int id)
            {
                return _context.Products.Any(e => e.Product_ID == id);
            }
        }
    }
