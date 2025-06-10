using System.Collections.Generic;
using currencyApiB.Application.Interfaces;
using currencyApiB.Domain.Entities;
using currencyApiB.Application.Interfaces;

namespace currencyApiB.Application.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly IHistoryRepository _historyRepository;

        public HistoryService(IHistoryRepository historyRepository)
        {
            _historyRepository = historyRepository;
        }

        public void AddHistory(History history)
        {
            _historyRepository.Add(history);
        }

        public History GetHistoryById(int id, System.DateTime date, decimal price)
        {
            return _historyRepository.GetById(id, date, price);
        }

        public List<History> GetAllHistories()
        {
            return _historyRepository.GetAll();
        }

        public void UpdateHistory(History history)
        {
            _historyRepository.Update(history);
        }

        public void DeleteHistory(int id, System.DateTime date, decimal price)
        {
            _historyRepository.Delete(id, date, price);
        }
    }
}
