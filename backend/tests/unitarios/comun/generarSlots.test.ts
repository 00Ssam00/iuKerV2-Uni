import { describe, expect, test } from '@jest/globals';
import { generarSlots } from '../../../src/common/generarSlots.js';

describe('generarSlots', () => {
  test('genera slots cada 30 minutos en una jornada de 2 horas', () => {
    const resultado = generarSlots('08:00', '10:00');
    expect(resultado).toEqual(['08:00', '08:30', '09:00', '09:30']);
  });

  test('genera un solo slot cuando la jornada dura exactamente 30 minutos', () => {
    const resultado = generarSlots('14:00', '14:30');
    expect(resultado).toEqual(['14:00']);
  });

  test('maneja el cambio de hora correctamente (09:30 → 10:00)', () => {
    const resultado = generarSlots('09:30', '10:30');
    expect(resultado).toEqual(['09:30', '10:00']);
  });

  test('retorna arreglo vacío cuando inicio y fin son iguales', () => {
    const resultado = generarSlots('08:00', '08:00');
    expect(resultado).toEqual([]);
  });

  test('retorna arreglo vacío cuando la jornada dura menos de 30 minutos', () => {
    const resultado = generarSlots('08:00', '08:29');
    expect(resultado).toEqual([]);
  });

  test('genera correctamente una jornada en horario nocturno', () => {
    const resultado = generarSlots('18:00', '20:00');
    expect(resultado).toEqual(['18:00', '18:30', '19:00', '19:30']);
  });
});
