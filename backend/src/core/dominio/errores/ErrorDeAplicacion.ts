import { EstadoHttp } from '../../infraestructura/controladores/estadoHttp.enum.js';
import { CodigosDeError } from './codigosDeError.enum.js';

export class ErrorDeAplicacion extends Error {
  public readonly estado: EstadoHttp;
  public readonly codigoInterno: CodigosDeError;

  constructor(
    estado: EstadoHttp,
    mensaje: string,
    codigoInterno: CodigosDeError
  ) {
    super(mensaje);
    this.name = 'ErrorDeAplicacion';
    this.estado = estado;
    this.codigoInterno = codigoInterno;

    Object.setPrototypeOf(this, ErrorDeAplicacion.prototype);
  }
}
