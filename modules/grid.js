// Copyright (c) 2023 Robert Kooima

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

var   stopSize     = 3.5;
var stringDistance = 8;
var   fretDistance = 14;
var  labelDistance = 5;

function elem(tag, attributes, text) {
  var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of attributes) {
    if (v) {
      e.setAttribute(k, v);
    }
  }
  if (text) {
    e.innerHTML = text;
  }
  return e
}

function crossPath(x, y, d) {
  return `M ${x - d} ${y - d} L ${x + d} ${y + d} M ${x - d} ${y + d} L ${x + d} ${y - d}`
}

function diamondPath(x, y, d) {
  return `M ${x - d} ${y} L ${x} ${y + d} L ${x + d} ${y} L ${x} ${y - d} z`
}

function squarePath(x, y, d) {
  return `M ${x - d} ${y - d} L ${x - d} ${y + d} L ${x + d} ${y + d} L ${x + d} ${y - d} z`
}

function boardPath(smin, smax, fmin, fmax, x, y) {
  const ftop = Math.max(fmin, 0)
  var path = []
  if (fmin <= 0 <= fmax) {
    path.push(`M ${x(smin)} ${y(0)} L ${x(smin)} ${y(0) - 2} `
            + `L ${x(smax)} ${y(0) - 2} L ${x(smax)} ${y(0)} z`);
  }
  for (var f = ftop; f <= fmax; f++) {
    path.push(`M ${x(smin)} ${y(f)} L${x(smax)} ${y(f)}`);
  }
  for (var s = smin; s <= smax; s++) {
    path.push(`M ${x(s)} ${y(ftop)} L${x(s)} ${y(fmax)}`);
  }
  return path.join(' ')
}

export function createGrid(chord) {
  var grid = elem('svg', []);
  var smin = 1;
  var smax = 6;
  var fgap = 0;

  const fmin = chord.gridMin ?? Math.max(0, chord.minFret() - 1);
  const fmax = chord.gridMax ?? Math.max(0, chord.maxFret());

  function x(s) {
    return (1 + smax - s) * stringDistance;
  }
  function y(f) {
    return 1 + stopSize + (f - fmin) * fretDistance;
  }
  function t(f) {
    return Math.max(y(0), (y(f) + y(f - 1)) * 0.5);
  }

  function label(x, y, t) {
    return elem('text', [['class', 'label'], ['x', x], ['y', y]], t)
  }
  function dot(x, y, k) {
    return elem('circle', [['class', 'dot'], ['cx', x], ['cy', y], ['r', stopSize * k]])
  }
  function circle(x, y, k) {
    return elem('circle', [['class', 'circle'], ['cx', x], ['cy', y], ['r', stopSize * k]])
  }
  function cross(x, y, k) {
    return elem('path', [['class', 'cross'], ['d', crossPath(x, y, stopSize * k)]])
  }
  function diamond(x, y, k) {
    return elem('path', [['class', 'diamond'], ['d', diamondPath(x, y, stopSize * k)]])
  }
  function square(x, y, k) {
    return elem('path', [['class', 'square'], ['d', squarePath(x, y, stopSize * k)]])
  }
  function board() {
    return elem('path', [['class', 'board'], ['d', boardPath(smin, smax, fmin, fmax, x, y)]])
  }

  grid.appendChild(board())

  for (const stop of chord.stops) {
    const s = stop.string;
    const f = stop.fret;
    const l = stop.label.toString();

    switch (l) {
      case '_': break;
      case '+': grid.appendChild(    dot(x(s), t(f), 0.5)); break;
      case 'x': grid.appendChild(  cross(x(s), t(f), 1.0)); break;
      case '=': grid.appendChild( square(x(s), t(f), 1.0)); break;
      case '^': grid.appendChild(diamond(x(s), t(f), 1.2)); break;
      case 'o': grid.appendChild( circle(x(s), t(f), 1.0)); break;
      default:  grid.appendChild(  label(x(s), t(f),   l)); break;
    }
  }

  if (chord.mark()) {
    grid.appendChild(label(x(smax) - labelDistance, y(chord.mark()), chord.mark().toString()));
  }
  if (chord.finger) {
    for (const s in chord.finger) {
      grid.appendChild(label(x(s), labelDistance + y(fmax), chord.finger[s].toString()));
    }
    fgap = 1;
  }

  var width  = (smax - smin + 2) * stringDistance;
  var height = (fmax - fmin + fgap * 0.5) * fretDistance + 2 * stopSize;

  grid.setAttribute('width',  width);
  grid.setAttribute('height', height);

  var column = document.createElement('span');
  column.setAttribute('class', 'column');
  column.appendChild(chord.symbol().toElement());
  column.appendChild(grid);

  if (chord.note) {
    var note = document.createElement('span');
    note.setAttribute('class', 'note');
    note.innerHTML = chord.note;
    column.appendChild(note);
  }
  return column;
}
