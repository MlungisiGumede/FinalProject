using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBIS_API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly DataContextcs _context;

        public UserController(DataContextcs context)
        {
            _context = context;
        }



        [HttpPost("authenticate")]

        public async Task<IActionResult> Authenticate([FromBody] User_Account userobj)
        {
     

                if (userobj == null)
                return BadRequest();

            var user = await _context.User_Accounts.
                FirstOrDefaultAsync(x => x.Username == userobj.Username && x.Password == userobj.Password);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(new
            {
                
                Message = "Login Success"

               
            });

           

        }


        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser([FromBody] User_Account userobj)
        {

            if (userobj == null)

                return BadRequest();

            await _context.User_Accounts.AddAsync(userobj);
            await _context.SaveChangesAsync();
            return Ok(new
            {

                Message = "User Registered!"
            });

        }


    

     
    }
    
}
