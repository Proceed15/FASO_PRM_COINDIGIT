using System.Collections.Generic;
using currencyApiB.Domain.Entities;

namespace currencyApiB.Application.Interfaces
{
    public interface IHistoryService
    {
        void AddHistory(History history);
        History GetHistoryById(int id, System.DateTime date, decimal price);
        List<History> GetAllHistories();
        void UpdateHistory(History history);
        void DeleteHistory(int id, System.DateTime date, decimal price);
    }
}
