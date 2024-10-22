using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    public class Feeding : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
