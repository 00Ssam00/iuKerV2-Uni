import { describe, test, expect } from '@jest/globals';
import { CrearConsultorioEsquema } from '../../../src/core/infraestructura/esquemas/consultorioEsquema.js';
// No son necesarios Mocks para probar los esquemas, ya que no usa dependencias internas
// solo usa la libreria ZOD
describe('Validación CrearConsultorioEsquema', () => {
  const dtoBase = {
    idConsultorio: 'C101',
    ubicacion: 'Edificio A, Piso 2',
  };

  test('Debe validar correctamente un DTO válido con ubicación', () => {
    const resultado = CrearConsultorioEsquema.safeParse(dtoBase);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.idConsultorio).toBe('C101');
      expect(resultado.data.ubicacion).toBe('Edificio A, Piso 2');
    }
  });

  test('Debe validar correctamente un DTO sin ubicación (opcional)', () => {
    const dto = { idConsultorio: 'C102' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.idConsultorio).toBe('C102');
      expect(resultado.data.ubicacion).toBeNull();
    }
  });

  test('Debe transformar ubicación undefined a null', () => {
    const dto = { idConsultorio: 'C103', ubicacion: undefined };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.ubicacion).toBeNull();
    }
  });

  test('Debe fallar si el ID del consultorio está vacío', () => {
    const dto = { ...dtoBase, idConsultorio: '' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe fallar si el ID del consultorio supera los 5 caracteres', () => {
    const dto = { ...dtoBase, idConsultorio: 'C10001' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
      expect(resultado.error.issues[0].message).toContain('no puede superar los 5 caracteres');
    }
  });

  test('Debe fallar si el ID del consultorio contiene caracteres no permitidos', () => {
    const dto = { ...dtoBase, idConsultorio: 'C-101' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
      expect(resultado.error.issues[0].message).toContain('debe seguir el esquema CXXX');
    }
  });

  test('Debe fallar si el ID del consultorio contiene espacios', () => {
    const dto = { ...dtoBase, idConsultorio: 'C 101' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe fallar si el ID del consultorio contiene caracteres especiales', () => {
    const dto = { ...dtoBase, idConsultorio: 'C@101' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].message).toContain('debe seguir el esquema CXXX');
    }
  });

  test('Debe aceptar ID con solo letras', () => {
    const dto = { ...dtoBase, idConsultorio: 'ABCDE' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ID con solo números', () => {
    const dto = { ...dtoBase, idConsultorio: '12345' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ID mixto de letras y números', () => {
    const dto = { ...dtoBase, idConsultorio: 'C1A2B' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
  });

  test('Debe fallar si falta el ID del consultorio', () => {
    const dto = { ubicacion: 'Edificio A' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe validar correctamente con ubicación vacía (string vacío se convierte a null)', () => {
    const dto = { idConsultorio: 'C104', ubicacion: '' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Si el string está vacío, Zod puede fallar en la validación antes de la transformación
    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ubicaciones con caracteres especiales', () => {
    const dto = { idConsultorio: 'C105', ubicacion: 'Edificio A, Piso 2 - Consultorio 1 (Principal)' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.ubicacion).toBe('Edificio A, Piso 2 - Consultorio 1 (Principal)');
    }
  });

  test('Debe manejar ubicaciones muy largas', () => {
    const ubicacionLarga = 'A'.repeat(500);
    const dto = { idConsultorio: 'C106', ubicacion: ubicacionLarga };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // El esquema no tiene límite de longitud para ubicación, así que debería pasar
    expect(resultado.success).toBe(true);
  });

  test('Debe fallar si el tipo de dato del ID no es string', () => {
    const dto = { idConsultorio: 123, ubicacion: 'Edificio A' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe aceptar ID de 1 carácter (mínimo válido)', () => {
    const dto = { ...dtoBase, idConsultorio: 'C' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ID de 5 caracteres (máximo válido)', () => {
    const dto = { ...dtoBase, idConsultorio: 'C1234' };
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    expect(resultado.success).toBe(true);
  });
});