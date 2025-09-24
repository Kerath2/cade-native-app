export function formatPeruTime(dateString: string): string {
  // Crear fecha a partir del string en UTC
  const dateUTC = new Date(dateString);

  // Restar 5 horas (UTC-5) para Perú
  const peruTime = new Date(dateUTC.getTime() - 7 * 60 * 60 * 1000);

  // Formato hh:mm
  const hours = peruTime.getHours().toString().padStart(2, "0");
  const minutes = peruTime.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}
