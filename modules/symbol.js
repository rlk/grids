// Copyright (c) 2025 Robert Kooima

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const symbolOfSpelling = {
  ',0,,0,,0,,':      ['',    ''],
  ',0,,-1,,0,,':     ['mi',  ''],
  ',0,,-1,,-1,,':    ['dim', ''],
  ',0,,0,,1,,':      ['aug', ''],
  ',0,,,0,0,,':      ['sus', ''],

  ',0,,0,,0,0,':     ['',   '6'],
  ',0,,-1,,0,0,':    ['mi', '6'],
  ',0,,-1,,0,-1,':   ['mi', '♭6'],

  ',0,,0,,0,,0':     ['ma', '7'],
  ',0,0,0,,0,,0':    ['ma', '9'],
  ',0,0,0,,0,0,0':   ['ma', '13'],

  ',0,,0,,0,,-1':    ['',   '7'],
  ',0,0,0,,0,,-1':   ['',   '9'],
  ',0,0,0,,0,0,-1':  ['',   '13'],

  ',0,,,0,0,,-1':    ['sus', '7'],
  ',0,0,,0,0,,-1':   ['sus', '9'],
  ',0,0,,0,0,0,-1':  ['sus', '13'],

  ',0,,-1,,0,,-1':   ['mi', '7'],
  ',0,0,-1,,0,,-1':  ['mi', '9'],
  ',0,0,-1,,0,0,-1': ['mi', '13'],

  ',0,,0,,-1,,0':    ['ma', '7♭5'],
  ',0,,-1,,-1,,-1':  ['mi', '7♭5'],
  ',0,,0,,1,,0':     ['ma', '7♯5'],
  ',0,,-1,,1,,-1':   ['mi', '7♯5'],

  ',0,,-1,,-1,,-2':  ['dim', '7'],

  ',0,,0,,1,,-1':    ['', '7♯5'],
  ',0,,0,,-1,,-1':   ['', '7♭5'],
  ',0,1,0,,0,,-1':   ['', '7♯9'],
  ',0,-1,0,,0,,-1':  ['', '7♭9'],

  ',0,-1,0,,-1,,-1': ['', '7♭5♭9'],
  ',0,1,0,,-1,,-1':  ['', '7♭5♯9'],
  ',0,-1,0,,1,,-1':  ['', '7♯5♭9'],
  ',0,1,0,,1,,-1':   ['', '7♯5♯9'],

  ',0,0,0,,-1,,-1':  ['', '9♭5'],
  ',0,0,0,,1,,-1':   ['', '9♯5'],
  ',0,0,0,,-1,0,-1': ['', '13♭5'],
  ',0,0,0,,1,0,-1':  ['', '13♯5'],

  ',0,,0,1,0,,-1':   ['', '7♯11'],
  ',0,0,0,1,0,,-1':  ['', '9♯11'],
  ',0,0,0,1,0,0,-1': ['', '13♯11'],

  ',0,-1,-1,,,,-1':  ['mi', '7♭9'],
};

function add(spelling, interval, offset) {
  return Object.assign(new Array(8), {...spelling, [interval]: offset})
}

function findSpelling(root, spelling, bass) {
  const key = spelling.toString();
  if (key in symbolOfSpelling) {
    const [triad, extension] = symbolOfSpelling[key];
    return new Symbol(root, triad, extension, bass);
  }

  var symbol;
  if (!(5 in spelling)) {
    if ((symbol = findSpelling(root, add(spelling, 5, 0), bass))) {
      return symbol;
    }
  }
  if (!(3 in spelling)) {
    if ((symbol = findSpelling(root, add(spelling, 3, 0), bass))) {
      return symbol;
    }
  }
  return null;
}

export function symbolFromSpelling(root, spelling, bass = '') {
  var symbol;

  if ((symbol = findSpelling(root, spelling, bass))) {
    return symbol;
  } else {
    console.log(`Failed to interpret ${root} ${spelling} ${bass}`);
    return new Symbol(root, '?', '', bass);
  }
}

export class Symbol {
  constructor(root, triad = '', extension = '', bass = '') {
    this.root = root;
    this.triad = triad;
    this.extension = extension;
    this.bass = bass;
  }

  toString() {
    return `<${this.root}${this.triad}${this.extension}>`
  }

  toElement() {
    var symbol = document.createElement('span')
    symbol.setAttribute('class', 'symbol');

    var root = document.createElement('span')
    root.setAttribute('class', 'root');
    root.innerHTML = this.root + this.triad
    symbol.appendChild(root);

    if (this.extension) {
      var extension = document.createElement('span')
      extension.setAttribute('class', 'extension');
      extension.innerHTML = this.extension;
      symbol.appendChild(extension);
    }

    if (this.bass) {
      var bass = document.createElement('span')
      bass.setAttribute('class', 'bass');
      bass.innerHTML = `/${this.bass}`;
      symbol.appendChild(bass);
    }
    return symbol;
  }
}
