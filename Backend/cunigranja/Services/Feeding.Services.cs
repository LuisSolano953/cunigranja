using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

public class FeedingServices
{
    private readonly AppDbContext _context;
    public FeedingServices(AppDbContext context)
    {
        _context = context;
    }

    public IEnumerable<FeedingModel> GetAll()
    {
        return _context.feeding.Include(f => f.foodmodel).ToList();
    }

    public FeedingModel GetFeedingById(int id)
    {
        return _context.feeding.FirstOrDefault(c => c.Id_feeding == id);
    }

    public void Add(FeedingModel entity)
    {
        _context.feeding.Add(entity);
        _context.SaveChanges();
    }

    public void UpdateFeeding(int Id, FeedingModel updatedFeeding)
    {
        var feeding = _context.feeding.SingleOrDefault(u => u.Id_feeding == Id);
        if (feeding != null)
        {
            _context.Entry(feeding).CurrentValues.SetValues(updatedFeeding);
            _context.SaveChanges();
        }
    }

    public bool DeleteById(int Id_feeding)
    {
        var feeding = _context.feeding.Find(Id_feeding);
        if (feeding != null)
        {
            _context.feeding.Remove(feeding);
            _context.SaveChanges();
            return true;
        }
        return false;
    }

    public IEnumerable<FeedingModel> GetFeedingInRange(int startId, int endId)
    {
        return _context.feeding
                       .Where(u => u.Id_feeding >= startId && u.Id_feeding <= endId)
                       .ToList();
    }
}
