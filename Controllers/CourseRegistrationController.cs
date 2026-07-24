using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentRegistrationWebApp.Data;
using StudentRegistrationWebApp.Models;

namespace StudentRegistrationWebApp.Controllers
{
    [Authorize(Roles = "Student")]
    public class CourseRegistrationController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CourseRegistrationController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Register()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound();

            var registeredCourseIds = await _context.CourseRegistrations
                .Where(cr => cr.StudentId == user.Id)
                .Select(cr => cr.CourseId)
                .ToListAsync();

            ViewBag.RegisteredCourseIds = registeredCourseIds;

            var courses = await _context.Courses.ToListAsync();
            return View(courses);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(int courseId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound();

            var alreadyRegistered = await _context.CourseRegistrations
                .AnyAsync(cr => cr.StudentId == user.Id && cr.CourseId == courseId);
            if (alreadyRegistered)
            {
                TempData["Message"] = "You are already registered for this course.";
                return RedirectToAction(nameof(Register));
            }

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return NotFound();

            var registration = new CourseRegistration
            {
                StudentId = user.Id,
                CourseId = courseId,
                RegisteredOn = DateTime.UtcNow
            };
            _context.CourseRegistrations.Add(registration);
            await _context.SaveChangesAsync();

            TempData["Message"] = $"You have successfully registered for '{course.Name}'.";
            return RedirectToAction("Index", "Profile");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Drop(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return NotFound();

            var registration = await _context.CourseRegistrations
                .FirstOrDefaultAsync(cr => cr.Id == id && cr.StudentId == user.Id);
            if (registration == null) return NotFound();

            _context.CourseRegistrations.Remove(registration);
            await _context.SaveChangesAsync();

            TempData["Message"] = "Course registration dropped successfully.";
            return RedirectToAction("Index", "Profile");
        }
    }
}
