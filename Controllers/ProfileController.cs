using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentRegistrationWebApp.Data;
using StudentRegistrationWebApp.Models;

namespace StudentRegistrationWebApp.Controllers
{
    [Authorize(Roles = "Student")]
    public class ProfileController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public ProfileController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound();

            var registrations = await (
                from cr in _context.CourseRegistrations
                join c in _context.Courses on cr.CourseId equals c.Id
                where cr.StudentId == user.Id
                select new { cr.Id, cr.RegisteredOn, c.CourseCode, c.Name, c.Description }
            ).ToListAsync();

            ViewBag.Registrations = registrations;
            ViewData["Registrations"] = registrations;
            return View(user);
        }

        public async Task<IActionResult> Edit()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound();
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string fullName, string address)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound();

            user.FullName = fullName;
            user.Address = address;
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                TempData["Message"] = "Profile updated successfully.";
                return RedirectToAction(nameof(Index));
            }
            foreach (var error in result.Errors)
                ModelState.AddModelError("", error.Description);
            return View(user);
        }
    }
}
