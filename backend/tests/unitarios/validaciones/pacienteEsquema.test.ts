import { describe, expect, test } from '@jest/globals';
import { pacienteEsquema } from '../../../src/core/infraestructura/esquemas/pacienteEsquema.js';

describe('Validación pacienteEsquema', () => {
  const dtoBase = {
    numeroDoc: '12345678',
    tipoDoc: 1,
    nombre: 'Ana',
    apellido: 'García',
    fechaNacimiento: '1990-03-20',
    sexo: 'F',
    email: 'ana@example.com',
    telefono: '3009876543',
    direccion: 'Calle 123 #45-67',
  };

  test('valida correctamente un DTO válido', () => {
    const resultado = pacienteEsquema.safeParse(dtoBase);
    expect(resultado.success).toBe(true);
  });

  test('rechaza una fecha de nacimiento futura', () => {
    // Arrange
    const dto = { ...dtoBase, fechaNacimiento: '2099-12-31' };

    // Act
    const resultado = pacienteEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      const mensaje = resultado.error.issues[0].message;
      expect(mensaje).toBe('La fecha de nacimiento no puede ser una fecha futura');
    }
  });

  test('acepta una fecha de nacimiento en el pasado', () => {
    const resultado = pacienteEsquema.safeParse({ ...dtoBase, fechaNacimiento: '2000-07-15' });
    expect(resultado.success).toBe(true);
  });

  test('rechaza una fecha con formato inválido', () => {
    const dto = { ...dtoBase, fechaNacimiento: '20-03-1990' };
    const resultado = pacienteEsquema.safeParse(dto);
    expect(resultado.success).toBe(false);
  });

  test('rechaza dirección demasiado corta', () => {
    const dto = { ...dtoBase, direccion: 'Cll 1' };
    const resultado = pacienteEsquema.safeParse(dto);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('direccion');
    }
  });

  test('rechaza teléfono con caracteres no numéricos', () => {
    const dto = { ...dtoBase, telefono: 'abc123456' };
    const resultado = pacienteEsquema.safeParse(dto);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('telefono');
    }
  });

  test('rechaza email con formato inválido', () => {
    const dto = { ...dtoBase, email: 'no-es-email' };
    const resultado = pacienteEsquema.safeParse(dto);
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('email');
    }
  });
});
