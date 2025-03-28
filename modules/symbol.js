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

const symbolOfFormula = {
  '1': ["bass", null],
  '1 5': ["5", null],
  '1 2 3 4 5 6 7': ["major", null],
  '1 2 ♭3 4 5 6 ♭7': ["dor", null],
  '1 ♭2 ♭3 4 5 ♭6 ♭7': ["phr", null],
  '1 2 3 ♯4 5 6 7': ["lyd", null],
  '1 2 3 4 5 6 ♭7': ["mix", null],
  '1 2 ♭3 4 5 ♭6 ♭7': ["aeo", null],
  '1 ♭2 ♭3 4 ♭5 ♭6 ♭7': ["loc", null],
  '1 3 5': [null, null],
  '1 ♭3 5': ["mi", null],
  '1 ♭3 ♭5': ["dim", null],
  '1 3 ♯5': ["aug", null],
  '1 4 5': ["sus", null],
  '1 3 5 6': [null, "6"],
  '1 ♭3 5 6': ["mi", "6"],
  '1 ♭3 5 ♭6': ["mi", "♭6"],
  '1 2 3 5': [null, "add9"],
  '1 2 ♭3 5': ["mi", "add9"],
  '1 2 3 5 6': [null, "6/9"],
  '1 2 ♭3 5 6': ["mi", "6/9"],
  '1 3 5 7': ["ma", "7"],
  '1 2 3 5 7': ["ma", "9"],
  '1 2 3 5 6 7': ["ma", "13"],
  '1 3 5 ♭7': [null, "7"],
  '1 2 3 5 ♭7': [null, "9"],
  '1 2 3 5 6 ♭7': [null, "13"],
  '1 4 5 ♭7': ["sus", "7"],
  '1 2 4 5 ♭7': ["sus", "9"],
  '1 2 4 5 6 ♭7': ["sus", "13"],
  '1 ♭3 5 ♭7': ["mi", "7"],
  '1 2 ♭3 5 ♭7': ["mi", "9"],
  '1 2 ♭3 5 6 ♭7': ["mi", "13"],
  '1 3 ♭5 7': ["ma", "7♭5"],
  '1 ♭3 ♭5 ♭7': ["mi", "7♭5"],
  '1 3 ♯5 7': ["ma", "7♯5"],
  '1 ♭3 ♯5 ♭7': ["mi", "7♯5"],
  '1 3 ♯5 ♭7': [null, "7♯5"],
  '1 3 ♭5 ♭7': [null, "7♭5"],
  '1 ♯2 3 5 ♭7': [null, "7♯9"],
  '1 ♭2 3 5 ♭7': [null, "7♭9"],
  '1 ♭2 3 ♭5 ♭7': [null, "7♭5♭9"],
  '1 ♯2 3 ♭5 ♭7': [null, "7♭5♯9"],
  '1 ♭2 3 ♯5 ♭7': [null, "7♯5♭9"],
  '1 ♯2 3 ♯5 ♭7': [null, "7♯5♯9"],
  '1 2 3 ♭5 ♭7': [null, "9♭5"],
  '1 2 3 ♯5 ♭7': [null, "9♯5"],
  '1 2 3 ♭5 6 ♭7': [null, "13♭5"],
  '1 2 3 ♯5 6 ♭7': [null, "13♯5"],
  '1 3 ♯4 5 ♭7': [null, "7♯11"],
  '1 2 3 ♯4 5 ♭7': [null, "9♯11"],
  '1 2 3 ♯4 5 6 ♭7': [null, "13♯11"],
  '1 ♭2 ♭3 ♭7': ["mi", "7♭9"],
  '1 ♭3 ♭5 𝄫7': ["dim", "7"],
};

export function toFormula(offsets) {
  var formula = [];
  for (let i = 1; i < 8; i++) {
    switch (offsets[i]) {
      case -2:
        formula.push(`𝄫${i}`);
        break;
      case -1:
        formula.push(`♭${i}`);
        break;
      case 0:
        formula.push(`${i}`);
        break;
      case +1:
        formula.push(`♯${i}`);
        break;
      case +2:
        formula.push(`𝄪${i}`);
        break;
    }
  }
  return formula.join(' ');
}

function add(offsets, interval, offset) {
  return Object.assign(new Array(8), { ...offsets, [interval]: offset })
}

function findFormula(root, offsets, bass) {
  const formula = toFormula(offsets);
  if (formula in symbolOfFormula) {
    const [triad, extension] = symbolOfFormula[formula];
    return new Symbol(root, triad, extension, bass, formula);
  }

  var symbol;
  if (!(5 in offsets)) {
    if ((symbol = findFormula(root, add(offsets, 5, 0), bass))) {
      return symbol;
    }
  }
  if (!(3 in offsets)) {
    if ((symbol = findFormula(root, add(offsets, 3, 0), bass))) {
      return symbol;
    }
  }
  return null;
}

export function symbolFromOffsets(root, offsets, bass) {
  var symbol;

  if ((symbol = findFormula(root, offsets, bass))) {
    return symbol;
  } else {
    console.log(`Failed to interpret ${root} ${offsets} ${bass}`);
    return new Symbol(root, '?', null, bass, toFormula(offsets));
  }
}

export class Symbol {
  constructor(root, triad = null, extension = null, bass = null, formula = null) {
    this.root = root;
    this.triad = triad;
    this.extension = extension;
    this.bass = bass;
    this.formula = formula;
  }

  toElement(optional = false) {
    function span(innerHTML, className = null) {
      var e = document.createElement('span');
      if (className) {
        e.setAttribute('class', className);
      }
      if (innerHTML) {
        e.innerHTML = innerHTML;
      }
      return e;
    }

    var symbol = span(null, 'symbol');
    symbol.setAttribute('title', this.formula);

    if (optional) {
      symbol.appendChild(span('('));
    }
    if (this.root) {
      symbol.appendChild(span(this.root));
    }
    if (this.triad) {
      symbol.appendChild(span(this.triad));
    }
    if (this.extension) {
      symbol.appendChild(span(this.extension, 'extension'));
    }
    if (this.bass) {
      if (this.extension) {
        symbol.appendChild(span(`/&#8239;${this.bass}`));
      } else {
        symbol.appendChild(span(`&#8239;/&#8239;${this.bass}`));
      }
    }
    if (optional) {
      symbol.appendChild(span(')'));
    }
    return symbol;
  }

  toString() {
    return `${this.root}${this.triad}${this.extension}/${this.bass}`
  }
}
