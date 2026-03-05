export enum CodigosDeError {
  //Errores de Cita - [CITA]
  CITA_NO_EXISTE = 'CITA001',
  CITA_CANCELADA = 'CITA002',
  CITA_FINALIZADA = 'CITA003',
  CITA_REPROGRAMADA = 'CITA004',
  AGENDADANDO_CITA_EN_EL_PASADO = 'CITA005',

  //Errores de Paciente - [PAC]
  PACIENTE_YA_EXISTE = 'PAC001',
  PACIENTE_NO_EXISTE = 'PAC002',
  PACIENTE_CON_CITA_EN_MISMO_HORARIO = 'PAC003',

  // Errores de Médico y de Asignación - [MED] & [ASIG]
  MEDICO_NO_EXISTE = 'MED001',
  MEDICO_NO_DISPONIBLE = 'MED002', //No se encuentra disponible en ese horario
  MEDICO_CON_CITA_EN_MISMO_HORARIO = 'MED003',
  ASIGNACION_MEDICO_CONSULTORIO_YA_EXISTE = 'ASIG001',

  //Errores de consultorio - [CONS]
  CONSULTORIO_NO_EXISTE = 'CONS001',
  CONCULTORIO_YA_EXISTE = 'CONS002',
  CONSULTORIO_OCUPADO = 'CONS003', //Ocupado en ese rango de tiempo

  // Errores Generales/Validación de Entrada - [GEN]
  PARAMETROS_INVALIDOS = 'GEN001',
}
