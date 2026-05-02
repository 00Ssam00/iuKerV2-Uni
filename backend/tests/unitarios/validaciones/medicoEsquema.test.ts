import { describe, expect, test } from '@jest/globals';
import { crearMedicoEsquema } from '../../../src/core/infraestructura/esquemas/medicoEsquema.js';

describe('Validación crearMedicoEsquema', () => {
  const dtoBase = {
    tarjetaProfesional: 'MP001',
    tipoDoc: 1,
    numeroDoc: '12345678',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    fechaNacimiento: '1985-06-15',
    sexo: 'M',
    especialidad: 'Neurología',
    email: 'carlos@example.com',
    telefono: '3001234567',
  };

  test('valida correctamente un DTO válido', () => {
    const resultado = crearMedicoEsquema.safeParse(dtoBase);
    expect(resultado.success).toBe(true);
  });

  test('rechaza una fecha de nacimiento futura', () => {
    // Arrange
    const dto = { ...dtoBase, fechaNacimiento: '2099-12-31' };

    // Act
    const resultado = crearMedicoEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      const mensaje = resultado.error.issues[0].message;
      expect(mensaje).toBe('La fecha de nacimiento no puede ser una fecha futura');
    }
  });

  test('acepta una fecha de nacimiento en el pasado', () => {
    const resultado = crearMedicoEsquema.safeParse({ ...dtoBase, fechaNacimiento: '1990-01-01' });
    expect(resultado.success).toBe(true);
  });

  test('rechaza una fecha con formato inválido', () => {
    const dto = { ...dtoBase, fechaNacimiento: '15-06-1985' };
    const resultado = crearMedicoEsquema.safeParse(dto);
    expect(resultado.success).toBe(false);
  });

  test('rechaza especialidad vacía', () => {
    const dto = { ...dtoBase, especialidad: '' };
    const resultado = crearMedicoEsquema.safeParse(dto);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('especialidad');
    }
  });

  test('rechaza email inválido', () => {
    const dto = { ...dtoBase, email: 'no-es-un-email' };
    const resultado = crearMedicoEsquema.safeParse(dto);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('email');
    }
  });
});
