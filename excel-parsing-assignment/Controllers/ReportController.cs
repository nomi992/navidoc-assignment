using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

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
        [HttpPost]
        public async Task<IActionResult> UploadExcel(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine(_env.WebRootPath, "uploads", fileName);

                // Ensure the directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                List<Dictionary<string, string>> reportData = ParseExcel(filePath);

                // Return the parsed data as JSON
                return Json(new { success = true, data = reportData });
            }
            return Json(new { success = false, message = "No file uploaded" });
        }
        private List<Dictionary<string, string>> ParseExcel(string filePath)
        {
            var dataList = new List<Dictionary<string, string>>();

            using (var package = new ExcelPackage(new FileInfo(filePath)))
            {
                var worksheet = package.Workbook.Worksheets[0]; // Get the first sheet
                var rowCount = worksheet.Dimension.Rows;
                var colCount = worksheet.Dimension.Columns;

                // Read header row (first row) to use as keys
                var headers = new List<string>();
                for (int col = 1; col <= colCount; col++)
                {
                    headers.Add(worksheet.Cells[1, col].Text);
                }

                // Read data from remaining rows
                for (int row = 2; row <= rowCount; row++) // Start from 2 to skip header
                {
                    var rowData = new Dictionary<string, string>();
                    for (int col = 1; col <= colCount; col++)
                    {
                        rowData[headers[col - 1]] = worksheet.Cells[row, col].Text;
                    }
                    dataList.Add(rowData);
                }
            }

            return dataList;
        }
    }
}
