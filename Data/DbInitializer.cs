using Microsoft.AspNetCore.Identity;
using StudentRegistrationWebApp.Models;

namespace StudentRegistrationWebApp.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roles = { "Admin", "Student" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            const string adminEmail = "admin@studentapp.com";
            const string adminPassword = "Admin@123";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = "Administrator",
                    RegisteredOn = DateTime.UtcNow
                };
                await userManager.CreateAsync(adminUser, adminPassword);
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            if (!context.Courses.Any())
            {
                context.Courses.AddRange(
                    new Course { Name = "Introduction to Computer Science", CourseCode = "CS101", Description = "Fundamentals of computer science and programming." },
                    new Course { Name = "Data Structures and Algorithms", CourseCode = "CS201", Description = "Study of data structures and algorithm design." },
                    new Course { Name = "Database Systems", CourseCode = "CS301", Description = "Relational databases, SQL, and database design." },
                    new Course { Name = "Web Development", CourseCode = "CS202", Description = "Modern web technologies and frameworks." },
                    new Course { Name = "Software Engineering", CourseCode = "CS401", Description = "Software development lifecycle and methodologies." }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
