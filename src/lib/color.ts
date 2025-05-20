export function textColor(hex: string) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness < 140 ? 'text-white' : 'text-black';
}
