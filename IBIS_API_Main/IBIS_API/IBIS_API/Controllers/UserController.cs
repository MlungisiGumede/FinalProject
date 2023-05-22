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



        // GET: SuppliersController
     

        //  public async Task<ActionResult<List<User_Account>>> GetAccountDetails()
        // {
        //return Ok(await _context.User_Accounts.ToListAsync());

        // }
        //   }
    }
}
