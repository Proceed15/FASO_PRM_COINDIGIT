using currencyAPI.Domain.Models;
using currencyAPI.Domain.Interfaces;
using currencyAPI.Infrastructure.Data;

namespace currencyAPI.Infrastructure.Repositories
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
            // _context.Currency.Add(currency);
            // _context.SaveChanges();
        }

        public Currency? GetById(int id) => _context.Currencies.Find(id);

        public List<Currency>? GetAll() => _context.Currencies.ToList();
        public void Delete(int id)
        {
            // var currency = _context.Currencies.Find(id);
            // if (currency != null)
            // {
            //     _context.Currencies.Remove(currency);
            //     _context.SaveChanges();
            // }
        }
        public Currency? GetByName(string name) => _context.Currencies.FirstOrDefault(u => u.Name == name);

        public void Update(Currency currency)
        {
            // _context.Currencies.Update(currency);
            // _context.SaveChanges();
        }
        //\função de Editar Assíncrona como Exemplo
        /*
        public async Task EditUserAsync(User user)
        {
            var existingUser = await _context.Users.FindAsync(user.Id);
            if (existingUser != null)
            {
                existingUser.Name = user.Name;
                existingUser.Email = user.Email;
                await _context.SaveChangesAsync();
            }
        }
        */

    }

}