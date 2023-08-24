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
using Microsoft.AspNetCore.Cors;
using System.Net.Mail;
using System.Net;
using System.Reflection.Emit;

namespace IBIS_API.Controllers
{
   


    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors(origins:"*",PolicyName =)]
    public class UserController : ControllerBase
    {
        static string smtpAddress = "smtp.gmail.com";
        static int portNumber = 587;
        static bool enableSSL = true;
        static string emailFromAddress = "ma.gaitsmith@gmail.com"; //Sender Email Address  
                                                                   //Sender Password  
        static string emailToAddress = "ma.gaitsmith@gmail.com"; //Receiver Email Address  
        static string subject = "Hello";

        static string body = "Your OTP is: ";
        private readonly DataContextcs _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserClaimsPrincipalFactory<AppUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;


        public UserController(DataContextcs context,UserManager<AppUser> userManager, IUserClaimsPrincipalFactory<AppUser> claimsPrincipalFactory, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _claimsPrincipalFactory = claimsPrincipalFactory; 
            _configuration = configuration;



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

        [HttpGet]
        [Route("Authenticate")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> Authenticate()
        {
            return Ok();
        }
        [HttpPost]
        [Route("SendOTP")]

        public async Task<IActionResult> SendOTP( User_Account uvm){ // if failiure with otp then just log in...
            int otp= 4;
            String Message = "hi";
            try
            {
                int r = 0;
                var user = await _userManager.FindByNameAsync(uvm.Username);
                Random generator = new Random();
                r = generator.Next(100000, 1000000);
                otp = r;
                body = body + r;

                using (MailMessage mail = new MailMessage())
                {
                    // check when send email to someone who doesnt allow work emails or something...
                    mail.From = new MailAddress(emailFromAddress);
                    mail.To.Add(user.Email);
                    mail.Subject = subject;
                    mail.Body = body;
                    mail.IsBodyHtml = true;
                    //mail.Attachments.Add(new Attachment("D:\\TestFile.txt"));//--Uncomment this to send any attachment  
                    using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
                    {
                        //smtp.UseDefaultCredentials = false;
                        smtp.Credentials = new NetworkCredential(emailFromAddress, "sxkbtjguspnshajt");
                        smtp.UseDefaultCredentials = false;
                        smtp.EnableSsl = enableSSL;
                        //smtp.DeliveryMethod = SmtpDeliveryMethod.PickupDirectoryFromIis;
                        // 
                        // try
                        //  {
                        //      Ping myPing = new Ping(); // stack overflow...
                        //      String host = "google.com";
                        //       byte[] buffer = new byte[32];
                        //      int timeout = 1000;
                        //  PingOptions pingOptions = new PingOptions();
                        //      PingReply reply = myPing.Send(host, timeout, buffer, pingOptions);
                        //return (reply.Status == IPStatus.Success);
                        //   }
                        //   catch (Exception e)
                        //  {
                        //      return BadRequest("Couldnt connect to wifi"); // check status text in front end.
                        //  }



                        // if otp generated then navigate to the page...




                        // doesnt work if there is no internet connection so try and catch...
                        smtp.Send(mail);
                    }
                }
            }

            catch (SmtpException smtpE)
            {
                var error = smtpE.Message; // when not connected to wifi status text is Failure sending mail
                var statuscode = smtpE.StatusCode; // general failiure when not connected to the wifi
                                                   // ping functionality to see if specifically wifi problem...
                var baseExc = smtpE.GetBaseException;
                return BadRequest(error);
                // retry in front end for emails if this happens...
            }
                  return Ok(otp);
            


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
                    Email = uvm.Email,
                    
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



        //[HttpPost("authenticate")]

        //public async Task<IActionResult> Authenticate([FromBody] User_Account userobj)
        //{
     

        //        if (userobj == null)
        //        return BadRequest();

        //    var user = await _context.User_Accounts.
        //        FirstOrDefaultAsync(x => x.Username == userobj.Username && x.Password == userobj.Password);
        //    if (user == null)
        //        return NotFound(new { Message = "User not found" });

        //    return Ok(new
        //    {
                
        //        Message = "Login Success"

               
        //    });

           

        //}


        [HttpPost("registerUser")]
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
