export function removeNiqqud(str) {
  return str.replace(/[\u0591-\u05C7]/g, '');
}
