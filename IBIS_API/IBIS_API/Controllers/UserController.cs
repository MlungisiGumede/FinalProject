using IBIS_API.Data;
using IBIS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using NuGet.Protocol.Core.Types;

namespace IBIS_API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly DataContextcs _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserClaimsPrincipalFactory<AppUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;


        public UserController(DataContextcs context)
        {
            _context = context;
        }

         [HttpGet]
        private ActionResult GenerateJWTToken(AppUser user)
        {
            // Create JWT Token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Tokens:Issuer"],
                _configuration["Tokens:Audience"],
                claims,
                signingCredentials: credentials,
                expires: DateTime.UtcNow.AddHours(3)
            );

            return Created("", new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = user.UserName
            });
        }



        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult> Login(User_Account uvm)
        {
            var user = await _userManager.FindByNameAsync(uvm.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, uvm.Password))
            {
                try
                {
                    //var principal = await _claimsPrincipalFactory.CreateAsync(user);
                    //await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, principal);
                    return GenerateJWTToken(user);
                }
                catch (Exception)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
                }
            }
            else
            {
                return NotFound("Does not exist");
            }
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(User_Account uvm)
        {
            var user = await _userManager.FindByIdAsync(uvm.Username);

            if (user == null)
            {
                user = new AppUser
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = uvm.Username,
                    Email = uvm.Username,
                    
                };

                var result = await _userManager.CreateAsync(user, uvm.Password);

                if (result.Errors.Count() > 0) return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
            else
            {
                return Forbid("Account already exists.");
            }

            return Ok();
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

           // await _context.User_Accounts.AddAsync(userobj);
            await _context.SaveChangesAsync();
            return Ok(new
            {

                Message = "User Registered!"
            });

        }


    

     
    }
    
}
