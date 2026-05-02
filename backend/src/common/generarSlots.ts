export function generarSlots(inicioJornada: string, finJornada: string): string[] {
  const partsInicio = inicioJornada.split(':').map(Number);
  const partsFin    = finJornada.split(':').map(Number);
  let h  = partsInicio[0] ?? 0;
  let m  = partsInicio[1] ?? 0;
  const fh = partsFin[0] ?? 0;
  const fm = partsFin[1] ?? 0;

  const slots: string[] = [];
  while (h * 60 + m + 30 <= fh * 60 + fm) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += 30;
    if (m >= 60) { h++; m -= 60; }
  }
  return slots;
}
