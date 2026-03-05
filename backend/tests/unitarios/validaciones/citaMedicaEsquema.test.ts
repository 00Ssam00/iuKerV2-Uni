import { crearCitaMedicaEsquema } from '../../../src/core/infraestructura/esquemas/citaMedicaEsquema.js';
describe('Validación crearCitaMedicaEsquema', () => {
  const dtoBase = {
    medico: 'MED123',
    tipoDocPaciente: 1,
    numeroDocPaciente: '100200300',
    fecha: '2025-11-25',
    horaInicio: '08:30',
  };

  test('Debe validar correctamente un DTO válido', () => {
    const resultado = crearCitaMedicaEsquema.safeParse(dtoBase);
    expect(resultado.success).toBe(true);
  });

  test('Debe fallar si el médico está vacío', () => {
    const dto = { ...dtoBase, medico: '' };
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('medico');
    }
  });

  test('Debe fallar si el ID del médico tiene menos de 5 caracteres', () => {
    const dto = { ...dtoBase, medico: 'MED' };
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('medico');
    }
  });

  test('Debe fallar si el ID del médico supera los 15 caracteres', () => {
    const dto = { ...dtoBase, medico: 'MED123456789012345' };
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('medico');
    }
  });

  test('Debe fallar si el ID del médico contiene caracteres no permitidos', () => {
    const dto = { ...dtoBase, medico: 'MED_123' };
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].message).toContain('solo debe contener letras y números');
    }
  });

  test('Debe fallar si el tipo de documento no es válido', () => {
    const dto = { ...dtoBase, tipoDocPaciente: 'XX' };
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('tipoDocPaciente');
    }
  });

  test('Debe fallar si el número de documento no cumple el formato', () => {
    const dto = { ...dtoBase, numeroDocPaciente: 'ABC-123' };
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('numeroDocPaciente');
    }
  });

  test('Debe fallar si la fecha no tiene formato válido YYYY-MM-DD', () => {
    const dto = { ...dtoBase, fecha: '25/11/2025' };
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('fecha');
    }
  });

  test('Debe fallar si la hora no cumple el formato HH:MM', () => {
    const dto = { ...dtoBase, horaInicio: '8:30' }; // formato incorrecto
    const resultado = crearCitaMedicaEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('horaInicio');
    }
  });
});
