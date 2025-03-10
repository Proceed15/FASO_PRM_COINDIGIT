public class UserRepository : IUserRepository
{
    private readonly UserDbContext _context;

    public UserRepository(UserDbContext context)
    {
        _context = context;
    }

    public void Add(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
    }

    public User? GetById(int id) => _context.Users.Find(id);
    
    public List<User>? GetAll() => _context.Users.ToList();
    public void Delete(int id)
    {
        var user = _context.Users.Find(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
    }
    public User? GetByEmail(string email) => _context.Users.FirstOrDefault(u => u.Email == email);
    public void Update(User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();
    }
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


}
