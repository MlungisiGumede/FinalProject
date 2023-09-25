﻿using IBIS_API.Data;
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
using System;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Configuration;
using Twilio;
using Twilio.Types;
using Twilio.Rest.Api.V2010.Account;
using Twilio.TwiML.Voice;
using Microsoft.Identity.Client;
using Twilio.Clients;
using System.Data.Entity.Infrastructure.Design;

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
        private RoleManager<IdentityRole> _roleManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(DataContextcs context, UserManager<AppUser> userManager, IUserClaimsPrincipalFactory<AppUser> claimsPrincipalFactory, IConfiguration configuration,
            RoleManager<IdentityRole> roleManager, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userManager = userManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _roleManager = roleManager;
            _httpContextAccessor = httpContextAccessor;


        }

        [HttpGet]
        private ActionResult GenerateJWTToken(AppUser user, string role)
        {
            // Create JWT Token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(JwtRegisteredClaimNames.Name, user.UserName),
                new Claim("DateOfJoing","high")
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
            //DateTime.UtcNow.
            //var tokenCreate = new JwtSecurityTokenHandler().CreateToken(token);
            return Created("", new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = user.UserName,

            });
        }
        [HttpPost]
        [Route("AddRole")]
        public async Task<ActionResult> AddRole(string role) // unused?..?
        {
            if (!(await _roleManager.RoleExistsAsync("guest"))) // got from microsoft...
            {
                await _roleManager.CreateAsync(new IdentityRole("guest"));
            }
            return Ok();
        }



        [HttpGet]
        private ActionResult GenerateAdminJWTToken(AppUser user, double time)
        {
            var expiresAt = DateTime.Now.Add(TimeSpan.FromMinutes(time));
            var tokenExpiredAtClaim = new Claim("ActivtationTokenExpiredAt", expiresAt.ToUniversalTime().Ticks.ToString());
            // Create JWT Token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                 new Claim(JwtRegisteredClaimNames.Name, user.UserName)

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Tokens:Issuer"],
                _configuration["Tokens:Audience"],
                claims,
                signingCredentials: credentials,
               expires: DateTime.Now.AddHours(time)
            //tokenLifeSPan = 
            // expires: DateTime.UtcNow.AddMinutes(time)
            );
            //DateTime.UtcNow.
            var tokenLook = new JwtSecurityTokenHandler().WriteToken(token);
            return Created("", new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = user.UserName,

            });
        }
        [HttpPost]
        [Route("setNewPassword")]
        // [ValidateAntiForgeryToken]
        public async Task<ActionResult> SetNewPassword(User_Account uvm)
        {
            //UserManager<IdentityUser> userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>());
            // var result = _userManager.ChangePassword(_User.Id, userNewPassword, userView.Password);
            // _userManager.ChangePasswordAsync()
            var user = await _userManager.FindByNameAsync(uvm.Username);
            //string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            //IdentityResult passwordChangeResult = await _userManager.ResetPasswordAsync(user, resetToken, uvm.Password);
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, uvm.Password);
            var result = await _userManager.UpdateAsync(user);
            return Ok();
        }

        [HttpGet]
        [Route("CheckAuthentication")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> CheckAuthentication()
        {

            return Ok();
        }
        [HttpGet]
        [Route("getUserRole")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] // authorize thingy makes it work...
        public async Task<ActionResult> GetUserRole()
        {
            //var userClaims = User.Claims; // this works...
            // authorize makes all of it work...
            var accessToken = await HttpContext.GetTokenAsync("access_token");
            var userName = HttpContext.User.Identity.Name; // works as well
            var currentUser = _httpContextAccessor.HttpContext.User; // works
            var userClaims = User;
            UserRoleVM uRVM = new UserRoleVM();
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            var user = await _userManager.FindByNameAsync(username);
            var roles = await _userManager.GetRolesAsync(user);
            string roleName = roles.FirstOrDefault().ToString();
            uRVM.Role = roleName;
            uRVM.Permissions = user.Permissions;
            return Ok(uRVM);
            //return Created("", new
            //{
            //    roleName = roleName
            //});

        }
        [HttpPost]
        [Route("SendOTP")]

        public async Task<IActionResult> SendOTP(User_Account uvm)
        { // if failiure with otp then just log in...
            int otp = 4;
            String Message = "hi";
            try
            {
                int r = 0;
                var user = await _userManager.FindByNameAsync(uvm.Username);
                Random generator = new Random();
                r = generator.Next(100000, 1000000);
                otp = r;
                body = "Your OTP is : " + r;

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

       
        [HttpDelete]
        [Route("DeleteCustomer/{id:int}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {

            var cus = await _context.Customers.FindAsync(id);
            if (cus == null)
            {
                return NotFound();
            }
            else
            {
                using (var context = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var user = await _userManager.FindByEmailAsync(cus.Email);
                        if (user != null)
                        {
                            var claims = await _userManager.GetClaimsAsync(user);
                           
                           var result1 = await _userManager.RemoveFromRoleAsync(user, "guest");
                           var result2 = await _userManager.RemoveClaimsAsync(user, claims);
                            var result3 = await _userManager.DeleteAsync(user);
                            if(result1.Succeeded && result2.Succeeded && result3.Succeeded)
                            {


                                _context.Customers.Remove(cus);
                                await _context.SaveChangesAsync();
                                context.Commit();

                            }
                            else
                            {
                                context.Rollback();
                                return BadRequest("Customer could not be deleted");
                            }
                        }
                        else
                        {
                           var customerOrders = _context.CustomerOrders.Where(c => c.Customer_ID == cus.Customer_ID).ToList();
                            if(customerOrders.Count > 0)
                            {
                                return BadRequest("Cant Delete a Customer with orders");
                            }
                            _context.Customers.Remove(cus);
                            await _context.SaveChangesAsync();
                            context.Commit();
                        }
                       
                    }
                    catch (Exception ex)
                    {
                        context.Rollback();
                        return BadRequest("Customer could not be deleted");
                    }
                  }
                
            }

            return NoContent();
       }

        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(string id) // this is userID...
        {
            
           
            var user = await _userManager.FindByIdAsync(id);
            var employee = _context.Employees.Where(c => c.Email == user.Email).FirstOrDefault();
            if (user != null)
            {
                using (var context = _context.Database.BeginTransaction())
                {
                    
                    try
                    {
                        var claims = await _userManager.GetClaimsAsync(user);

                        var result1 = await _userManager.RemoveFromRoleAsync(user, "guest");
                        var result2 = await _userManager.RemoveClaimsAsync(user, claims);
                        var result3 = await _userManager.DeleteAsync(user);
                        if(result1.Succeeded && result2.Succeeded && result3.Succeeded)
                        {
                            if(employee == null)
                            {
                                context.Commit();
                            }
                            else
                            {
                                _context.Employees.Remove(employee);
                                await _context.SaveChangesAsync();
                                context.Commit();
                            }
                           
                        }
                        else
                        {
                            context.Rollback();
                            return BadRequest("Failed to delete user");
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Failed to delete user");
                    }
                }
            }
            else
            {
                return BadRequest("No user account for particular customer");
            }
            return NoContent();
        }

        [HttpDelete]
        [Route("DeleteEmployee/{id:int}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            var user = await _userManager.FindByEmailAsync(employee.Email);
            if (user != null)
            {
                using (var context = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var claims = await _userManager.GetClaimsAsync(user);

                        var result1 = await _userManager.RemoveFromRoleAsync(user, "guest");
                        var result2 = await _userManager.RemoveClaimsAsync(user, claims);
                        var result3 = await _userManager.DeleteAsync(user);
                        if (result1.Succeeded && result2.Succeeded && result3.Succeeded)
                        {
                            _context.Employees.Remove(employee);
                            context.Commit();
                        }
                        else
                        {
                            context.Rollback();
                            return BadRequest("Failed to delete user");
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Failed to delete user");
                    }
                }
            }
            else
            {
                return BadRequest("No user account for particular customer");
            }
            return NoContent();
        }


        [HttpPost]
        [Route("Authenticate")]
        public async Task<ActionResult> Authenticate(User_Account uvm)
        {
            var user = await _userManager.FindByNameAsync(uvm.Username);
            var role = _userManager.GetRolesAsync(user).ToString();
            try
            {
                //var principal = await _claimsPrincipalFactory.CreateAsync(user);
                //await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, principal);
                return GenerateJWTToken(user, role);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }



        }
        [HttpPost]
        [Route("AuthenticateAdmin")]
        public async Task<ActionResult> AuthenticateAdmin(User_Account uvm)
        {
            double time = (double)uvm.time;
            var user = await _userManager.FindByNameAsync(uvm.Username);

            try
            {
                //var principal = await _claimsPrincipalFactory.CreateAsync(user);
                //await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, principal);
                return GenerateAdminJWTToken(user, time);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }




        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult> Login(User_Account uvm)
        {
            var user = await _userManager.FindByNameAsync(uvm.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, uvm.Password))
            {
                var role = _userManager.GetRolesAsync(user);
                // var name = _roleManager.FindByIdAsync(int32(role.Id));
                //var roleId = (String)role.Id;
                // var r =  role.Id
                _roleManager.FindByNameAsync(uvm.Username);
                // _roleManager.FindByIdAsync(roleId);
                // var n = user.Roles.FirstOrDefault();
                var roles = await _userManager.GetRolesAsync(user);
                string roleName = roles.FirstOrDefault().ToString();

                //return Ok(roleName);
                return Created("", new
                {
                    roleName = roleName
                });
            }
            else
            {
                return NotFound("Does not exist");
            }
        }

        [HttpPost]
        [Route("fileUpload")]
        public async Task<IActionResult> PostFile(FileUpload file)
        {
            FileUpload fileFound = null;
            if (file.type == 1)
            {
                fileFound = _context.Files.Where(c => c.type == 1).FirstOrDefault();
                if (fileFound != null)
                {
                    _context.Remove(fileFound);
                    _context.Add(file);
                }
                else
                {
                    _context.Add(file);
                }

            }
            else
            {
                fileFound = _context.Files.Where(c => c.type == 2).FirstOrDefault();
                if (fileFound != null)
                {
                    _context.Remove(fileFound);
                    _context.Add(file);
                }
                else
                {
                    _context.Add(file);
                }






            }
            await _context.SaveChangesAsync();
            return Ok(file);
        }
        [HttpGet]
        [Route("getAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            List<UserVM> usersVM = new List<UserVM>();
            foreach (var user in users)
            {
                UserVM userVM = new UserVM();
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles[0];
                userVM.Role = role;
                userVM.Permissions = user.Permissions;
                userVM.UserName = user.UserName;
                userVM.Email = user.Email;
                userVM.Name = user.FullName;
                userVM.Id = user.Id;
                usersVM.Add(userVM);
            }
            return Ok(usersVM);
        }
        [HttpGet]
        [Route("insertRoles")]
        public async Task<IActionResult> InsertUserRoles()
        {
            await _roleManager.CreateAsync(new IdentityRole("manager"));
            await _roleManager.CreateAsync(new IdentityRole("employee"));
            await _roleManager.CreateAsync(new IdentityRole("enabledEmployee"));
            await _roleManager.CreateAsync(new IdentityRole("guest"));
            await _roleManager.CreateAsync(new IdentityRole("enabledGuest"));
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("updateUserRole")]
        public async Task<IActionResult> UpdateUserRole(UserVM userVm)
        {
            // could you pass through app user....
            var user = await _userManager.FindByNameAsync(userVm.UserName);
            user.Permissions = userVm.Permissions;
            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();
            //_userManager.RemoveFromRoleAsync(user,role);
            //_userManager.AddToRoleAsync(user,userVm.Role)
            return Ok();
        }
        [HttpPost]
        [Route("addUser")]
        public async Task<IActionResult> AddEmployee(Employee emp)
        {
            // could you pass through app user....
            // Employee emp = new Employee();
            //var customer = _context.Customers.Where(c => c.Email == emp.Email); this logic...
            _context.Employees.Add(emp);


            await _context.SaveChangesAsync();
            //_userManager.RemoveFromRoleAsync(user,role);
            //_userManager.AddToRoleAsync(user,userVm.Role)
            return Ok();
        }


        [HttpGet]
        [Route("getFile")]
        public async Task<IActionResult> GetFile()
        {
            var FileList = new List<FileUpload>();
            var imageFound = _context.Files.Where(c => c.type == 1).FirstOrDefault();
            var pdfFound = _context.Files.Where(c => c.type == 2).FirstOrDefault();
            FileList.Add(imageFound);
            FileList.Add(pdfFound);
            if (FileList.Count == 0)
            {
                return BadRequest("No File Found");
            }
            return Ok(FileList);

        }

        [HttpGet]
        [Route("getCustomerOrders")] // protect this maybe through code or... can actually check which user is accessing the route...
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> getCustomerOrders()
        {
            var userClaims = User;
            var username = userClaims.FindFirstValue(ClaimTypes.Name);
            var user = await _userManager.FindByNameAsync(username);
            var customer = _context.Customers.Where(c => c.Email == user.Email).First();
            var ordersList = new List<CustomerOrder>();
            foreach (var customerOrder in _context.CustomerOrders)
            {
                if (customerOrder.Customer_ID == customer.Customer_ID)
                {
                    ordersList.Add(customerOrder);
                }
            }
            return Ok(ordersList);

        }
        [HttpGet]
        [Route("SendSms")]
        public async Task<IActionResult> SendSms()
        {
            const string accountSid = "ACeb14bbf63263e7318c7f8971ea94df55";
            const string authToken = "089031f565b379487bbba7f4ab196e73";
            TwilioClient.Init(accountSid, authToken);

            //TwilioRestClient client = new TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN);
            //client.
            //client.SendMessage("(502) 276-8990", ToNumber.Text, Message.Text)
            var to = new PhoneNumber("+18035423230");
            //var message = MessageResource.Create(
            //    to,
            //    from: new PhoneNumber("+27828558028"), //  From number, must be an SMS-enabled Twilio number ( This will send sms from ur "To" numbers ).  
            //    body: $"Hello !! Welcome to Asp.Net Core With Twilio SMS API !!");

            MessageResource.Create(
      to: to,
      messagingServiceSid: "MG54aee30786d986ca151639e0f838cf63",
      body: "Hello from your Alpha sender 👏");
            return Ok();
        }



        [HttpGet]
        [Route("CreateAdmin")] // protect this maybe through code or... can actually check which user is accessing the route...
        public async Task<IActionResult> CreateAdmin()
        {
            var username = "u21482358";
            var email = "u21482358@tuks.co.za";
            var user = await _userManager.FindByIdAsync(username);

            if (user == null)
            {
                user = new AppUser
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = username,
                    Email = email,
                    Permissions = true
                };
                if (!(await _roleManager.RoleExistsAsync("manager"))) // got from microsoft...
                {
                    await _roleManager.CreateAsync(new IdentityRole("manager"));
                }
                var result = await _userManager.CreateAsync(user, "123456");
                //var roleResult = _userManager.AddToRoleAsync(user, role.Name);
                // https://learn.microsoft.com/en-us/answers/questions/623030/assign-user-to-role-during-registration
                if (result.Succeeded)
                {
                    var defaultrole = _roleManager.FindByNameAsync("manager").Result;

                    if (defaultrole != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(user, defaultrole.Name);
                    }


                    if (result.Errors.Count() > 0) return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
                }
                else
                {
                    return Forbid("Account already exists.");
                }


            }
            return Ok();
        }


        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(User_Account uvm)
        {
            var user = await _userManager.FindByIdAsync(uvm.Username);
            var statusText = "Account already exists";
            var customers = _context.Customers.ToList();
            var employees = _context.Employees.ToList();
            if (customers.Count == 0 && employees.Count == 0)
            {
                return BadRequest("Not registerd on the system");

            }
            var customer = _context.Customers.Where(c => c.Email == uvm.Email).FirstOrDefault();
            var employee = _context.Employees.Where(c => c.Email == uvm.Email).FirstOrDefault();
            if (customer == null && employee == null)
            {
                return Forbid("Not registerd on the system");
            }

            if (user == null)
            {
                using (var context = _context.Database.BeginTransaction())
                {
                    user = new AppUser
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserName = uvm.Username,
                        Email = uvm.Email,
                        Permissions = false

                    };
                    var result = await _userManager.CreateAsync(user, uvm.Password);
                    if (result.Succeeded)
                    {
                        IdentityResult roleresult = new IdentityResult();
                        if (customer != null) {
                             roleresult = await _userManager.AddToRoleAsync(user, "guest");
                        }else if(employee != null)
                        {
                             roleresult = await _userManager.AddToRoleAsync(user, "employee");
                        }
                        if (roleresult.Succeeded)
                        {
                            
                            context.Commit();
                            
                        }
                        else
                        {
                            context.Rollback();
                            return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
                        }
                    }
                    else
                    {
                        context.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
                    }
                   
                }


              
            }
            return Ok();

            //var roleResult = _userManager.AddToRoleAsync(user, role.Name);
            // https://learn.microsoft.com/en-us/answers/questions/623030/assign-user-to-role-during-registration



        }
    }
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



