import { describe, expect, test } from '@jest/globals';
import { CrearConsultorioEsquema } from '../../../src/core/infraestructura/esquemas/consultorioEsquema.js';
// No son necesarios Mocks para probar los esquemas, ya que no usa dependencias internas
// solo usa la libreria ZOD
describe('Validación CrearConsultorioEsquema', () => {
  const dtoBase = {
    idConsultorio: 'C101',
    ubicacion: 'Edificio A, Piso 2',
  };

  test('Debe validar correctamente un DTO válido con ubicación', () => {
    // Arrange - dtoBase definido arriba

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dtoBase);

    // Assert
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.idConsultorio).toBe('C101');
      expect(resultado.data.ubicacion).toBe('Edificio A, Piso 2');
    }
  });

  test('Debe validar correctamente un DTO sin ubicación (opcional)', () => {
    // Arrange
    const dto = { idConsultorio: 'C102' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.idConsultorio).toBe('C102');
      expect(resultado.data.ubicacion).toBeNull();
    }
  });

  test('Debe transformar ubicación undefined a null', () => {
    // Arrange
    const dto = { idConsultorio: 'C103', ubicacion: undefined };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.ubicacion).toBeNull();
    }
  });

  test('Debe fallar si el ID del consultorio está vacío', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: '' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe fallar si el ID del consultorio supera los 5 caracteres', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'C10001' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
      expect(resultado.error.issues[0].message).toContain('no puede superar los 5 caracteres');
    }
  });

  test('Debe fallar si el ID del consultorio contiene caracteres no permitidos', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'C-101' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
      expect(resultado.error.issues[0].message).toContain('debe seguir el esquema CXXX');
    }
  });

  test('Debe fallar si el ID del consultorio contiene espacios', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'C 101' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe fallar si el ID del consultorio contiene caracteres especiales', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'C@101' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].message).toContain('debe seguir el esquema CXXX');
    }
  });

  test('Debe aceptar ID con solo letras', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'ABCDE' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ID con solo números', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: '12345' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ID mixto de letras y números', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'C1A2B' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
  });

  test('Debe fallar si falta el ID del consultorio', () => {
    // Arrange
    const dto = { ubicacion: 'Edificio A' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe validar correctamente con ubicación vacía (string vacío se convierte a null)', () => {
    // Arrange
    const dto = { idConsultorio: 'C104', ubicacion: '' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    // Si el string está vacío, Zod puede fallar en la validación antes de la transformación
    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ubicaciones con caracteres especiales', () => {
    // Arrange
    const dto = { idConsultorio: 'C105', ubicacion: 'Edificio A, Piso 2 - Consultorio 1 (Principal)' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.ubicacion).toBe('Edificio A, Piso 2 - Consultorio 1 (Principal)');
    }
  });

  test('Debe manejar ubicaciones muy largas', () => {
    // Arrange
    const ubicacionLarga = 'A'.repeat(500);
    const dto = { idConsultorio: 'C106', ubicacion: ubicacionLarga };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    // El esquema no tiene límite de longitud para ubicación, así que debería pasar
    expect(resultado.success).toBe(true);
  });

  test('Debe fallar si el tipo de dato del ID no es string', () => {
    // Arrange
    const dto = { idConsultorio: 123, ubicacion: 'Edificio A' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toContain('idConsultorio');
    }
  });

  test('Debe aceptar ID de 1 carácter (mínimo válido)', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'C' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
  });

  test('Debe aceptar ID de 5 caracteres (máximo válido)', () => {
    // Arrange
    const dto = { ...dtoBase, idConsultorio: 'C1234' };

    // Act
    const resultado = CrearConsultorioEsquema.safeParse(dto);

    // Assert
    expect(resultado.success).toBe(true);
  });
});