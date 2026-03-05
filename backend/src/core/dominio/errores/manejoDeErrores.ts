import { EstadoHttp } from '../../infraestructura/controladores/estadoHttp.enum.js';
import { CodigosDeError } from './codigosDeError.enum.js';
import { ErrorDeAplicacion } from './ErrorDeAplicacion.js';

const MAPA_ERRORES = {
  //Errores de Cita
  [CodigosDeError.CITA_NO_EXISTE]: {
    estado: EstadoHttp.NO_ENCONTRADO,
    mensaje: 'La cita solicita no existe en el sistema',
  },
  [CodigosDeError.CITA_CANCELADA]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'La cita está en estado: Cancelada',
  },
  [CodigosDeError.CITA_FINALIZADA]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'La cita está en estado: Finalizada',
  },
  [CodigosDeError.CITA_REPROGRAMADA]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'La cita está en estado: Reprogramada',
  },
  [CodigosDeError.AGENDADANDO_CITA_EN_EL_PASADO]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'Está intentando agendar una cita en el pasado',
  },
  //Errores de Paciente
  [CodigosDeError.PACIENTE_YA_EXISTE]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'El paciente ya existe en el sistema',
  },
  [CodigosDeError.PACIENTE_NO_EXISTE]: {
    estado: EstadoHttp.NO_ENCONTRADO,
    mensaje: 'El paciente no existe en el sistema',
  },
  [CodigosDeError.PACIENTE_CON_CITA_EN_MISMO_HORARIO]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'El paciente ya tiene una cita agendada en ese horario',
  },
  //Errores médico
  [CodigosDeError.MEDICO_NO_EXISTE]: {
    estado: EstadoHttp.NO_ENCONTRADO,
    mensaje: 'El médico no existe en el sistema',
  },
  [CodigosDeError.MEDICO_NO_DISPONIBLE]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'El médico no se encuentra disponible en ese horario',
  },
  [CodigosDeError.MEDICO_CON_CITA_EN_MISMO_HORARIO]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'Medico ya tiene una cita a esa hora',
  },
  [CodigosDeError.ASIGNACION_MEDICO_CONSULTORIO_YA_EXISTE]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'Esa asignación, con todos los datos proporcionados ya existe',
  },
  //Errores consultorio
  [CodigosDeError.CONSULTORIO_NO_EXISTE]: {
    estado: EstadoHttp.NO_ENCONTRADO,
    mensaje: 'El consultorio no existe en el sistema',
  },
  [CodigosDeError.CONCULTORIO_YA_EXISTE]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'El consultorio ya existe en el sistema',
  },
  [CodigosDeError.CONSULTORIO_OCUPADO]: {
    estado: EstadoHttp.CONFLICTO,
    mensaje: 'El consultorio está ocupado en ese rango de tiempo',
  },
  [CodigosDeError.PARAMETROS_INVALIDOS]: {
    estado: EstadoHttp.PETICION_INVALIDA,
    mensaje:
      '"Los parámetros o datos de entrada proporcionados son inválidos o faltantes."',
  },
};

export function crearErrorDeDominio(codigo: CodigosDeError): ErrorDeAplicacion {
  const definicion = MAPA_ERRORES[codigo];

  if (!definicion) {
    return new ErrorDeAplicacion(
      EstadoHttp.PETICION_INVALIDA,
      `Error de dominio no mapeado: ${codigo}`,
      CodigosDeError.PARAMETROS_INVALIDOS
    );
  }

  return new ErrorDeAplicacion(definicion.estado, definicion.mensaje, codigo);
}
