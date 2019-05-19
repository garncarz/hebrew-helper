import React from 'react';
import SVG from '@svgdotjs/svg.js/src/svg.js';


const usLayout = [
  'wertyuiop',
  'asdfghjkl;',
  'zxcvbnm,.',
];

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


export class UsHeKeyboardPicture extends React.Component {

  constructor(props) {
    super(props);

    this.draw = SVG().viewbox(0, 0, 110, 35);
  }

  key(eng) {
    var he = us2heKeys[eng.toLowerCase()];
    eng = eng.toUpperCase();

    var key = this.draw.group();

    key.rect(10, 10).radius(1).fill({ color: 'grey' });
    key.rect(9, 9).radius(1).fill({ color: 'white' }).move(.5, .5);

    key.text(eng).font({ size: 5 }).fill({ color: 'black' })
       .move(![',', '.'].includes(eng) ? 0.8 : 2, 0);
    key.text(he).font({ size: 5 }).fill({ color: 'blue' })
       .move(eng !== 'W' ? 5 : 7, 3.5);

    return key;
  }

  row(keys) {
    var row = this.draw.group();

    keys.split('').forEach((eng, column) => {
      row.add(this.key(eng).move(column * 11, 0));
    });

    return row;
  }

  rows () {
    var rows = this.draw.group();

    rows.add(this.row(usLayout[0]).move(9, 0));
    rows.add(this.row(usLayout[1]).move(0, 11));
    rows.add(this.row(usLayout[2]).move(6, 22));

    return rows;
  }

  render() {
    this.rows();

    // TODO relative maximum width
    return (
      <div style={{ width: 800 }} dangerouslySetInnerHTML={{ __html: this.draw.svg() }} />
    );
  }

}
