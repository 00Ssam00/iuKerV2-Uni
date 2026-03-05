import { crearErrorDeDominio } from '../../../src/core/dominio/errores/manejoDeErrores.js';
import { CodigosDeError } from '../../../src/core/dominio/errores/codigosDeError.enum.js';
import { ErrorDeAplicacion } from '../../../src/core/dominio/errores/ErrorDeAplicacion.js';
import { EstadoHttp } from '../../../src/core/infraestructura/controladores/estadoHttp.enum.js';

describe('Sistema de Manejo de Errores', () => {
  describe('crearErrorDeDominio', () => {
    test('debería crear un error correctamente para el código (CITA_NO_EXISTE)', () => {
      const codigo = CodigosDeError.CITA_NO_EXISTE;
      const error = crearErrorDeDominio(codigo);

      expect(error).toBeInstanceOf(ErrorDeAplicacion);
      expect(error.codigoInterno).toBe(codigo);
      expect(error.estado).toBe(EstadoHttp.NO_ENCONTRADO);
      expect(error.message).toBe('La cita solicita no existe en el sistema');
    });

    test('debería crear un error correctamente para el código (PACIENTE_YA_EXISTE)', () => {
      const codigo = CodigosDeError.PACIENTE_YA_EXISTE;
      const error = crearErrorDeDominio(codigo);

      expect(error).toBeInstanceOf(ErrorDeAplicacion);
      expect(error.codigoInterno).toBe(codigo);
      expect(error.estado).toBe(EstadoHttp.CONFLICTO);
      expect(error.message).toBe('El paciente ya existe en el sistema');
    });

    test('debería devolver un error genérico para un código no mapeado', () => {
      // @ts-ignore - Forzamos un código inválido para probar el fallback
      const codigoInvalido = 'CODIGO_INEXISTENTE' as CodigosDeError;
      const error = crearErrorDeDominio(codigoInvalido);

      expect(error).toBeInstanceOf(ErrorDeAplicacion);
      expect(error.codigoInterno).toBe(CodigosDeError.PARAMETROS_INVALIDOS);
      expect(error.estado).toBe(EstadoHttp.PETICION_INVALIDA);
      expect(error.message).toContain('Error de dominio no mapeado');
    });
  });

  describe('ErrorDeAplicacion', () => {
    test('debería instanciarse correctamente con propiedades personalizadas', () => {
      const estado = EstadoHttp.ERROR_INTERNO_SERVIDOR;
      const mensaje = 'Mensaje de prueba';
      const codigo = CodigosDeError.PARAMETROS_INVALIDOS;

      const error = new ErrorDeAplicacion(estado, mensaje, codigo);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ErrorDeAplicacion');
      expect(error.estado).toBe(estado);
      expect(error.message).toBe(mensaje);
      expect(error.codigoInterno).toBe(codigo);
    });
  });
});
