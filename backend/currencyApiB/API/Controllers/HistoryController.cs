using Microsoft.AspNetCore.Mvc;
using currencyApiB.Application.Interfaces;
using currencyApiB.Domain.Entities;
using System;
using System.Collections.Generic;

namespace currencyApiB.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpPost]
        public IActionResult AddHistory(History history)
        {
            // Ensure Id is not set to avoid conflict with auto-increment
            history.Id = 0;
            _historyService.AddHistory(history);
            return Ok();
        }

        [HttpGet]
        public ActionResult<List<History>> GetAllHistories()
        {
            var histories = _historyService.GetAllHistories();
            return Ok(histories);
        }

        [HttpGet("{id}/{date}/{price}")]
        public ActionResult<History> GetHistoryById(int id, DateTime date, decimal price)
        {
            var history = _historyService.GetHistoryById(id, date, price);
            if (history == null)
            {
                return NotFound();
            }
            return Ok(history);
        }

        [HttpPut("{id}/{date}/{price}")]
        public IActionResult UpdateHistory(int id, DateTime date, decimal price, History history)
        {
            var existingHistory = _historyService.GetHistoryById(id, date, price);
            if (existingHistory == null)
            {
                return NotFound();
            }
            _historyService.UpdateHistory(history);
            return NoContent();
        }

        [HttpDelete("{id}/{date}/{price}")]
        public IActionResult DeleteHistory(int id, DateTime date, decimal price)
        {
            var existingHistory = _historyService.GetHistoryById(id, date, price);
            if (existingHistory == null)
            {
                return NotFound();
            }
            _historyService.DeleteHistory(id, date, price);
            return NoContent();
        }
    }
}
