using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentRegistrationWebApp.Data;
using StudentRegistrationWebApp.Models;

namespace StudentRegistrationWebApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class StudentsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public StudentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IActionResult> Index()
        {
            var students = await _userManager.GetUsersInRoleAsync("Student");
            return View(students);
        }

        public async Task<IActionResult> Details(string id)
        {
            if (id == null) return NotFound();
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            if (!await _userManager.IsInRoleAsync(user, "Student")) return NotFound();
            return View(user);
        }

        public async Task<IActionResult> Edit(string id)
        {
            if (id == null) return NotFound();
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            if (!await _userManager.IsInRoleAsync(user, "Student")) return NotFound();
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, string fullName, string address)
        {
            if (id == null) return NotFound();
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            if (!await _userManager.IsInRoleAsync(user, "Student")) return NotFound();

            user.FullName = fullName;
            user.Address = address;
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                TempData["Message"] = "Student updated successfully.";
                return RedirectToAction(nameof(Index));
            }
            foreach (var error in result.Errors)
                ModelState.AddModelError("", error.Description);
            return View(user);
        }

        public async Task<IActionResult> Delete(string id)
        {
            if (id == null) return NotFound();
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            if (!await _userManager.IsInRoleAsync(user, "Student")) return NotFound();
            return View(user);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user != null && await _userManager.IsInRoleAsync(user, "Student"))
            {
                await _userManager.DeleteAsync(user);
                TempData["Message"] = "Student deleted successfully.";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
