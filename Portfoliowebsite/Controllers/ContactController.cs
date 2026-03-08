using Microsoft.AspNetCore.Mvc;
using Portfoliowebsite.Services;

namespace Portfoliowebsite.Controllers
{
    public class ContactController : Controller
    {

        private readonly IEmailSender _email;
        private static readonly Dictionary<string, DateTime> SubmissionTokens = new();

        public ContactController(IEmailSender email) => _email = email;

        public IActionResult Index()
        {
            string token = Guid.NewGuid().ToString();
            SubmissionTokens[token] = DateTime.UtcNow;
            ViewData["SubmissionToken"] = token;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(string Name, string Email, string Subject, string Message, string submissionToken)
        {
            if (string.IsNullOrEmpty(submissionToken) || !SubmissionTokens.ContainsKey(submissionToken))
            {
                ModelState.AddModelError("", "Formulier ongeldig. Laad de pagina opnieuw.");
                ViewData["SubmissionToken"] = Guid.NewGuid().ToString();
                return View();
            }
            
            if (string.IsNullOrWhiteSpace(Name))
                ModelState.AddModelError(nameof(Name), "Naam is verplicht");
            if (string.IsNullOrWhiteSpace(Email))
                ModelState.AddModelError(nameof(Email), "E-mailadres is verplicht");
            if (string.IsNullOrWhiteSpace(Subject) || Subject.Trim().Length < 2)
                ModelState.AddModelError(nameof(Subject), "Onderwerp moet minimaal 2 tekens zijn");
            if (string.IsNullOrWhiteSpace(Message))
                ModelState.AddModelError(nameof(Message), "Bericht is verplicht");

            if (!ModelState.IsValid)
            {
                ViewData["SubmissionToken"] = Guid.NewGuid().ToString();
                return View();
            }
            
            SubmissionTokens.Remove(submissionToken);
            
            var cutoff = DateTime.UtcNow.AddMinutes(-10);
            var oldTokens = SubmissionTokens.Where(x => x.Value < cutoff).Select(x => x.Key).ToList();
            foreach (var oldToken in oldTokens)
            {
                SubmissionTokens.Remove(oldToken);
            }

            await _email.SendAsync(Name, Email, Subject, Message);

            TempData["ThanksName"] = Name;
            TempData["ThanksEmail"] = Email;
            TempData["ThanksMessage"] = Message;

            return RedirectToAction(nameof(Thanks));
        }

        public IActionResult Thanks()
        {
            return View();
        }
    }
}
