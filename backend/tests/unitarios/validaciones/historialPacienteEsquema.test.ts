import { crearHistorialEsquema } from '../../../src/core/infraestructura/esquemas/historialPacienteEsquema.js';

const UUID_VALIDO = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

describe('crearHistorialEsquema', () => {
  describe('idCita', () => {
    it('acepta un UUID válido', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: 'Diagnóstico válido',
      });
      expect(resultado.success).toBe(true);
    });

    it('rechaza un idCita que no es UUID', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: 'no-es-un-uuid',
        diagnostico: 'Diagnóstico válido',
      });
      expect(resultado.success).toBe(false);
    });

    it('rechaza cuando idCita está ausente', () => {
      const resultado = crearHistorialEsquema.safeParse({
        diagnostico: 'Diagnóstico válido',
      });
      expect(resultado.success).toBe(false);
    });
  });

  describe('diagnostico', () => {
    it('rechaza un diagnóstico vacío', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: '',
      });
      expect(resultado.success).toBe(false);
    });

    it('rechaza un diagnóstico con menos de 5 caracteres', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: 'Grip',
      });
      expect(resultado.success).toBe(false);
    });

    it('rechaza un diagnóstico que supera los 500 caracteres', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: 'A'.repeat(501),
      });
      expect(resultado.success).toBe(false);
    });

    it('acepta un diagnóstico en el límite exacto de 500 caracteres', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: 'A'.repeat(500),
      });
      expect(resultado.success).toBe(true);
    });
  });

  describe('descripcion', () => {
    it('acepta la ausencia de descripcion (campo opcional)', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: 'Diagnóstico válido',
      });
      expect(resultado.success).toBe(true);
    });

    it('acepta una descripcion dentro del límite de 1000 caracteres', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: 'Diagnóstico válido',
        descripcion: 'Detalle adicional de la consulta',
      });
      expect(resultado.success).toBe(true);
    });

    it('rechaza una descripcion que supera los 1000 caracteres', () => {
      const resultado = crearHistorialEsquema.safeParse({
        idCita: UUID_VALIDO,
        diagnostico: 'Diagnóstico válido',
        descripcion: 'B'.repeat(1001),
      });
      expect(resultado.success).toBe(false);
    });
  });
});
