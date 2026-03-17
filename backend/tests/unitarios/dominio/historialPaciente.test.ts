import { HistorialPaciente } from '../../../src/core/dominio/historialPaciente/HistorialPaciente.js';

describe('HistorialPaciente', () => {
  describe('constructor', () => {
    it('asigna idCita y diagnostico correctamente', () => {
      const entidad = new HistorialPaciente({
        idCita: 'cita-uuid-001',
        diagnostico: 'Hipertensión arterial grado II',
      });

      expect(entidad.idCita).toBe('cita-uuid-001');
      expect(entidad.diagnostico).toBe('Hipertensión arterial grado II');
    });

    it('asigna descripcion cuando se proporciona', () => {
      const entidad = new HistorialPaciente({
        idCita: 'cita-uuid-001',
        diagnostico: 'Diagnóstico de prueba',
        descripcion: 'Paciente en observación 48 horas',
      });

      expect(entidad.descripcion).toBe('Paciente en observación 48 horas');
    });

    it('asigna null a descripcion cuando no se proporciona', () => {
      const entidad = new HistorialPaciente({
        idCita: 'cita-uuid-001',
        diagnostico: 'Diagnóstico de prueba',
      });

      expect(entidad.descripcion).toBeNull();
    });

    it('asigna null a descripcion cuando se pasa explícitamente null', () => {
      const entidad = new HistorialPaciente({
        idCita: 'cita-uuid-001',
        diagnostico: 'Diagnóstico de prueba',
        descripcion: null,
      });

      expect(entidad.descripcion).toBeNull();
    });
  });
});
