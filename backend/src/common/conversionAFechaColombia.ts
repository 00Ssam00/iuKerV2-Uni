export function conversionAFechaColombia(fecha: string, horaInicio: string) {
  const fechaStr = `${fecha}T${horaInicio}:00-05:00`;
  const fechaColombia = new Date(fechaStr);

  return fechaColombia;
}
