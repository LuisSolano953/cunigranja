using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

namespace cunigranja.Services
{
    public class MortalityServices
    {
        private readonly AppDbContext _context;

        public MortalityServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<MortalityModel> GetAll()
        {
            return _context.mortality.Include(t => t.user).Include(t => t.rabbitmodel).ToList();
        }

        public MortalityModel GetById(int id)
        {
            return _context.mortality.Find(id);
        }

        public void Add(MortalityModel entity)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                Console.WriteLine($"=== DEBUGGING MORTALITY SERVICE ===");
                Console.WriteLine($"Datos recibidos - Id_rabbit: {entity.Id_rabbit}, Id_user: {entity.Id_user}");
                Console.WriteLine($"Fecha: {entity.fecha_mortality}, Causa: {entity.causa_mortality}");

                // Validar que los IDs no sean 0 o negativos
                if (entity.Id_rabbit <= 0)
                {
                    Console.WriteLine($"ERROR: ID del conejo inválido: {entity.Id_rabbit}");
                    throw new ArgumentException($"ID del conejo inválido: {entity.Id_rabbit}");
                }

                if (entity.Id_user <= 0)
                {
                    Console.WriteLine($"ERROR: ID del usuario inválido: {entity.Id_user}");
                    throw new ArgumentException($"ID del usuario inválido: {entity.Id_user}");
                }

                // Verificar que el conejo existe y obtenerlo para actualizar
                var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == entity.Id_rabbit);
                if (rabbit == null)
                {
                    Console.WriteLine($"ERROR: No se encontró el conejo con ID {entity.Id_rabbit}");

                    // Mostrar todos los conejos disponibles para debugging
                    var allRabbits = _context.rabbit.Select(r => new { r.Id_rabbit, r.name_rabbit, r.estado }).ToList();
                    Console.WriteLine("Conejos disponibles en la base de datos:");
                    foreach (var r in allRabbits)
                    {
                        Console.WriteLine($"  - ID: {r.Id_rabbit}, Nombre: {r.name_rabbit}, Estado: {r.estado}");
                    }

                    throw new ArgumentException($"No se encontró el conejo con ID {entity.Id_rabbit}");
                }

                Console.WriteLine($"Conejo encontrado: {rabbit.name_rabbit} (Estado actual: {rabbit.estado})");

                var user = _context.user.FirstOrDefault(u => u.Id_user == entity.Id_user);

                if (user == null)
                {
                    Console.WriteLine($"ERROR: No se encontró el usuario con ID {entity.Id_user}");

                    var allUsers = _context.user.Select(u => new { u.Id_user, u.name_user }).ToList();

                    Console.WriteLine("Usuarios disponibles en la base de datos:");
                    foreach (var u in allUsers)
                    {
                        Console.WriteLine($"  - ID: {u.Id_user}, Nombre: {u.name_user}");
                    }

                    throw new ArgumentException($"No se encontró el usuario con ID {entity.Id_user}");
                }

                Console.WriteLine($"Usuario encontrado: {user.name_user}");

                // Verificar que el conejo esté activo
                if (rabbit.estado != "Activo")
                {
                    Console.WriteLine($"ADVERTENCIA: El conejo {rabbit.name_rabbit} no está activo (Estado actual: {rabbit.estado})");
                    // No lanzar excepción, solo advertir
                }

                Console.WriteLine("Todas las validaciones pasaron. Registrando mortalidad...");

                // 1. Primero registrar la mortalidad
                _context.mortality.Add(entity);
                _context.SaveChanges();
                Console.WriteLine("✅ Mortalidad registrada en la base de datos");

                // 2. Luego actualizar el estado del conejo
                Console.WriteLine($"Cambiando estado del conejo de '{rabbit.estado}' a 'Inactivo'...");
                rabbit.estado = "Inactivo";

                // Marcar explícitamente la entidad como modificada
                _context.Entry(rabbit).State = EntityState.Modified;
                _context.SaveChanges();
                Console.WriteLine("✅ Estado del conejo actualizado");

                // 3. Confirmar la transacción
                transaction.Commit();
                Console.WriteLine($"✅ Proceso completado exitosamente. Conejo {rabbit.name_rabbit} (ID: {rabbit.Id_rabbit}) marcado como Inactivo.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error en MortalityServices.Add: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                // Rollback de la transacción en caso de error
                transaction.Rollback();
                throw; // Re-lanzar la excepción para que el controlador la maneje
            }
        }

        public void UpdateMortality(int Id, MortalityModel updatedMortality)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                Console.WriteLine($"=== INICIANDO UPDATE DE MORTALIDAD ===");
                Console.WriteLine($"ID Mortalidad: {Id}");
                Console.WriteLine($"Conejo Nuevo: {updatedMortality.Id_rabbit}");

                // 1. Buscar el registro de mortalidad actual
                var mortality = _context.mortality.SingleOrDefault(u => u.Id_mortality == Id);
                if (mortality == null)
                {
                    throw new ArgumentException($"No se encontró la mortalidad con ID {Id}");
                }

                Console.WriteLine($"Mortalidad encontrada: ID {mortality.Id_mortality}");
                Console.WriteLine($"Conejo Original en BD: {mortality.Id_rabbit}");

                // 2. Verificar si cambió el conejo
                int originalRabbitId = mortality.Id_rabbit;
                bool rabbitChanged = originalRabbitId != updatedMortality.Id_rabbit;
                Console.WriteLine($"¿Cambió el conejo? {rabbitChanged} (Original: {originalRabbitId} -> Nuevo: {updatedMortality.Id_rabbit})");

                if (rabbitChanged)
                {
                    // 3. Reactivar el conejo original
                    var originalRabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == originalRabbitId);
                    if (originalRabbit != null)
                    {
                        Console.WriteLine($"Reactivando conejo original: {originalRabbit.name_rabbit} (ID: {originalRabbit.Id_rabbit})");
                        originalRabbit.estado = "Activo";
                        _context.Entry(originalRabbit).State = EntityState.Modified;
                        Console.WriteLine($"✅ Conejo {originalRabbit.name_rabbit} reactivado");
                    }
                    else
                    {
                        Console.WriteLine($"⚠️ No se encontró el conejo original con ID {originalRabbitId}");
                    }

                    // 4. Desactivar el nuevo conejo
                    var newRabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == updatedMortality.Id_rabbit);
                    if (newRabbit == null)
                    {
                        throw new ArgumentException($"No se encontró el conejo con ID {updatedMortality.Id_rabbit}");
                    }

                    Console.WriteLine($"Desactivando nuevo conejo: {newRabbit.name_rabbit} (ID: {newRabbit.Id_rabbit})");
                    newRabbit.estado = "Inactivo";
                    _context.Entry(newRabbit).State = EntityState.Modified;
                    Console.WriteLine($"✅ Conejo {newRabbit.name_rabbit} desactivado");
                }
                else
                {
                    Console.WriteLine("No cambió el conejo, no se modifican estados");
                }

                // 5. Verificar que el usuario existe
                var user = _context.user.FirstOrDefault(u => u.Id_user == updatedMortality.Id_user);
                if (user == null)
                {
                    throw new ArgumentException($"No se encontró el usuario con ID {updatedMortality.Id_user}");
                }

                Console.WriteLine($"Usuario encontrado: {user.name_user}");

                // 6. Actualizar los datos de la mortalidad
                mortality.causa_mortality = updatedMortality.causa_mortality;
                mortality.fecha_mortality = updatedMortality.fecha_mortality;
                mortality.Id_rabbit = updatedMortality.Id_rabbit;
                mortality.Id_user = updatedMortality.Id_user;

                _context.Entry(mortality).State = EntityState.Modified;
                Console.WriteLine("✅ Datos de mortalidad actualizados");

                // 7. Guardar todos los cambios
                _context.SaveChanges();
                Console.WriteLine("✅ Cambios guardados en la base de datos");

                // 8. Confirmar la transacción
                transaction.Commit();
                Console.WriteLine("✅ Transacción completada exitosamente");

                if (rabbitChanged)
                {
                    Console.WriteLine($"✅ RESUMEN: Conejo original (ID: {originalRabbitId}) reactivado, nuevo conejo (ID: {updatedMortality.Id_rabbit}) desactivado");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error en UpdateMortality: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                // Rollback de la transacción en caso de error
                transaction.Rollback();
                throw; // Re-lanzar la excepción para que el controlador la maneje
            }
        }

        public bool DeleteById(int id)
        {
            var mortality = _context.mortality.Find(id);
            if (mortality != null)
            {
                _context.mortality.Remove(mortality);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public IEnumerable<MortalityModel> GetMortalityInRange(int startId, int endId)
        {
            return _context.mortality
                           .Where(u => u.Id_mortality >= startId && u.Id_mortality <= endId)
                           .ToList();
        }
    }
}
