using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
namespace excel_parsing_assignment.Controllers
{
    public class ReportController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public ReportController(IWebHostEnvironment env)
        {
            _env = env;
        }

        public IActionResult Index()
        {
            return View("~/Views/Home/ExcelReport.cshtml");
        }
        //[HttpPost]
        //public async Task<IActionResult> UploadExcel(IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //    {
        //        return Json(new { success = false, message = "No file uploaded" });
        //    }

        //    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", file.FileName);

        //    // Ensure the directory exists
        //    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

        //    // Save the file
        //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        await file.CopyToAsync(stream);
        //    }

        //    // Return success (No need to return the data as ExcelJS will handle it on the client side)
        //    return Json(new { success = true });
        //}
        [HttpPost]
        public async Task<IActionResult> UploadExcel(IFormFile file)
        {
            // Validate that the file is not empty or null
            if (file == null || file.Length == 0)
            {
                return Json(new { success = false, message = "No file uploaded." });
            }

            // Validate file extension (only allow .xlsx files)
            if (!file.FileName.EndsWith(".xlsx"))
            {
                return Json(new { success = false, message = "Only Excel files (.xlsx) are allowed." });
            }

            // Check for file size (limit to 10MB for example)
            if (file.Length > 10 * 1024 * 1024) // 10MB
            {
                return Json(new { success = false, message = "File size exceeds the allowed limit (10MB)." });
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", file.FileName);

            // Ensure the directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            try
            {
                // Use FileShare.ReadWrite to allow concurrent access
                using (var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.ReadWrite))
                {
                    // Copy the file to the server
                    await file.CopyToAsync(stream);
                }

                // Return success response
                return Json(new { success = true, message = "File uploaded successfully." });
            }
            catch (IOException ioEx)
            {
                // Log and return the error
                Console.Error.WriteLine("IOException: " + ioEx.Message);
                return Json(new { success = false, message = "File is being used by another process or there's an issue with the file." });
            }
            catch (Exception ex)
            {
                // Log and return the error
                Console.Error.WriteLine("Exception: " + ex.Message);
                return Json(new { success = false, message = "An unexpected error occurred while uploading the file." });
            }
        }

        public PartialViewResult ReportPartial()
        {
            return PartialView("~/Views/Home/ExcelReport.cshtml");
        }
    }

}

