using currencyApiB.Domain.Entities;
using currencyApiB.Application.Interfaces;
using currencyApiB.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System;

namespace currencyApiB.Infrastructure.Repositories
{
    public class HistoryRepository : IHistoryRepository
    {
        private readonly CurrencyDbContext _context;

        public HistoryRepository(CurrencyDbContext context)
        {
            _context = context;
        }

        public void Add(History history)
        {
            _context.Histories.Add(history);
            _context.SaveChanges();
        }

        public History GetById(int id, DateTime date, decimal price)
        {
            return _context.Histories.Find(id, date, price);
        }

        public List<History> GetAll()
        {
            return _context.Histories.ToList();
        }

        public void Update(History history)
        {
            _context.Histories.Update(history);
            _context.SaveChanges();
        }

        public void Delete(int id, DateTime date, decimal price)
        {
            var history = _context.Histories.Find(id, date, price);
            if (history != null)
            {
                _context.Histories.Remove(history);
                _context.SaveChanges();
            }
        }
    }
}
