using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace StudentRegistrationWebApp.Controllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult Error(int? statusCode = null)
        {
            if (statusCode.HasValue)
            {
                ViewData["StatusCode"] = statusCode.Value;
                Response.StatusCode = statusCode.Value;
            }
            return View();
        }
    }
}
