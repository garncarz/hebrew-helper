const us2heKeys = {
  'w': "'",
  'e': 'ק',
  'r': 'ר',
  't': 'א',
  'y': 'ט',
  'u': 'ו',
  'i': 'ן',
  'o': 'ם',
  'p': 'פ',
  'a': 'ש',
  's': 'ד',
  'd': 'ג',
  'f': 'כ',
  'g': 'ע',
  'h': 'י',
  'j': 'ח',
  'k': 'ל',
  'l': 'ך',
  ';': 'ף',
  'z': 'ז',
  'x': 'ס',
  'c': 'ב',
  'v': 'ה',
  'b': 'נ',
  'n': 'מ',
  'm': 'צ',
  ',': 'ת',
  '.': 'ץ',
};


export function removeNiqqud(str) {
  return str.replace(/[\u0591-\u05C7]/g, '');
}


export function us2heKeyboard(str_us) {
  var str_he = '', old_char;
  for (var i = 0; i < str_us.length; i++) {
    old_char = str_us.charAt(i);
    str_he += old_char.toLowerCase() in us2heKeys ? us2heKeys[old_char.toLowerCase()] : old_char;
  }
  return str_he;
}


export function blob2text(blob) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (e) => {
      reader.abort();
      reject(e);
    }
    reader.readAsText(blob);
  });
}
