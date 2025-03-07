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

  ',0,-1,0,,0,,-1':  ['', '7♭9'],
  ',0,0,0,1,0,,-1':  ['', '9♯11'],
};

function copySpelling(spelling) {
  var copy = new Array(8);
  spelling.forEach((element, index) => copy[index] = element);
  return copy;
}

function add5(spelling) {
  var copy = copySpelling(spelling);
  copy[5] = 0;
  return copy
}

function add3(spelling) {
  var copy = copySpelling(spelling);
  copy[3] = 0;
  return copy;
}

function findSpelling(root, spelling) {
  const key = spelling.toString();
  if (key in symbolOfSpelling) {
    const [triad, extension] = symbolOfSpelling[key];
    return new Symbol(root, triad, extension);
  }

  var symbol;
  if (!(5 in spelling)) {
    if ((symbol = findSpelling(root, add5(spelling)))) {
      return symbol;
    }
  }
  if (!(3 in spelling)) {
    if ((symbol = findSpelling(root, add3(spelling)))) {
      return symbol;
    }
  }
  return null;
}

export function symbolFromSpelling(root, spelling) {
  var symbol;

  if ((symbol = findSpelling(root, spelling))) {
    return symbol;
  } else {
    return new Symbol(root, '?', '');
  }
}

export class Symbol {
  constructor(root, triad = '', extension = '') {
    this.root = root;
    this.triad = triad;
    this.extension = extension;
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
    return symbol;
  }
}
