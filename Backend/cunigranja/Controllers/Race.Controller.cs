using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    public class Race : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
