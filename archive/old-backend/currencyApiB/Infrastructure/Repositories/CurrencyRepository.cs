using currencyApiB.Domain.Entities;
using currencyApiB.Application.Interfaces;
using currencyApiB.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;

namespace currencyApiB.Infrastructure.Repositories
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly CurrencyDbContext _context;

        public CurrencyRepository(CurrencyDbContext context)
        {
            _context = context;
        }

        public void Add(Currency currency)
        {
            _context.Currencies.Add(currency);
            _context.SaveChanges();
        }

        public Currency? GetById(int id)
        {
            return _context.Currencies.Find(id);
        }

        public List<Currency> GetAll()
        {
            return _context.Currencies.ToList();
        }

        public void Delete(int id)
        {
            var currency = _context.Currencies.Find(id);
            if (currency != null)
            {
                _context.Currencies.Remove(currency);
                _context.SaveChanges();
            }
        }

        public Currency? GetByName(string name)
        {
            return _context.Currencies.FirstOrDefault(c => c.Name == name);
        }

        public void Update(Currency currency)
        {
            _context.Currencies.Update(currency);
            _context.SaveChanges();
        }
    }
}