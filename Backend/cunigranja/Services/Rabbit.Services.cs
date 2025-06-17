using cunigranja.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace cunigranja.Services
{
    public class RabbitServices
    {
        private readonly AppDbContext _context;
        private readonly IServiceProvider _serviceProvider;
        private readonly CageServices _cageServices;

        public RabbitServices(AppDbContext context, IServiceProvider serviceProvider, CageServices cageServices)
        {
            _context = context;
            _serviceProvider = serviceProvider;
            _cageServices = cageServices;
        }

        public IEnumerable<RabbitModel> GetRabbit()
        {
            return _context.rabbit
                .Include(r => r.cagemodel)
                .Include(r => r.racemodel)
                .ToList();
        }

        public RabbitModel GetRabbitById(int id)
        {
            return _context.rabbit.FirstOrDefault(c => c.Id_rabbit == id);
        }

        public bool Add(RabbitModel entity)
        {
            // Validar capacidad de la jaula antes de registrar
            if (!_cageServices.CheckCageCapacity(entity.Id_cage))
            {
                return false;
            }

            // Al registrar un nuevo conejo: peso_actual = peso_inicial solo una vez
            if (entity.peso_actual == 0)
            {
                entity.peso_actual = entity.peso_inicial;
            }

            _context.rabbit.Add(entity);
            _context.SaveChanges();
            return true;
        }

        public bool UpdateRabbit(int Id, RabbitModel updatedRabbit)
        {
            var rabbit = _context.rabbit.SingleOrDefault(u => u.Id_rabbit == Id);

            if (rabbit != null)
            {
                // Validar cambio de jaula si se cambió Id_cage
                if (rabbit.Id_cage != updatedRabbit.Id_cage)
                {
                    if (!_cageServices.CheckCageCapacity(updatedRabbit.Id_cage))
                    {
                        return false;
                    }
                }

                // Guardar el peso inicial anterior para verificar si cambió
                int previousPesoInicial = rabbit.peso_inicial;

                rabbit.name_rabbit = updatedRabbit.name_rabbit;
                rabbit.fecha_registro = updatedRabbit.fecha_registro;
                rabbit.peso_inicial = updatedRabbit.peso_inicial;
                rabbit.sexo_rabbit = updatedRabbit.sexo_rabbit;
                rabbit.estado = updatedRabbit.estado;
                rabbit.peso_actual = updatedRabbit.peso_actual;
                rabbit.Id_cage = updatedRabbit.Id_cage;
                rabbit.Id_race = updatedRabbit.Id_race;

                _context.SaveChanges();

                // Siempre recalcular el peso actual y las ganancias de los pesajes
                // independientemente de si cambió el peso inicial o no
                using (var scope = _serviceProvider.CreateScope())
                {
                    var weighingService = scope.ServiceProvider.GetRequiredService<WeighingServices>();
                    weighingService.RecalculateRabbitCurrentWeight(Id, updatedRabbit.peso_inicial);
                }

                return true;
            }

            return false;
        }

        public void Delete(int id)
        {
            var rabbit = _context.rabbit.FirstOrDefault(c => c.Id_rabbit == id);
            if (rabbit != null)
            {
                _context.rabbit.Remove(rabbit);
                _context.SaveChanges();
            }
        }

        public IEnumerable<RabbitModel> GetRabbitInRange(int startId, int endId)
        {
            return _context.rabbit
                           .Where(u => u.Id_rabbit >= startId && u.Id_rabbit <= endId)
                           .ToList();
        }
    }
}