using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    public class Mortality : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
