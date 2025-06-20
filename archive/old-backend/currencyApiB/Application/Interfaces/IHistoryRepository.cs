using System;
using System.Collections.Generic;
using currencyApiB.Domain.Entities;

namespace currencyApiB.Application.Interfaces
{
    public interface IHistoryRepository
    {
        void Add(History history);
        History GetById(int id, System.DateTime date, decimal price);
        List<History> GetAll();
        void Update(History history);
        void Delete(int id, System.DateTime date, decimal price);
    }
}
