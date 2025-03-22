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
  var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of attributes) {
    element.setAttribute(k, v);
  }
  if (text) {
    element.innerHTML = text;
  }
  return element
}

function classify(element, degree, pitch, interval) {
  var value = element.getAttribute('class');
  element.setAttribute('class', `${value} degree${degree} pitch${pitch} interval${interval}`);
  return element;
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
  if (fmin <= 0 && 0 <= fmax) {
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
function board(smin, smax, fmin, fmax, x, y) {
  return elem('path', [['class', 'board'], ['d', boardPath(smin, smax, fmin, fmax, x, y)]])
}

export function createGrid(chord) {
  var grid = elem('svg', []);
  var smin = 1;
  var smax = 6;
  var fgap = Object.keys(chord.fingers).length ? 1.0 : 0.25;

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

  grid.appendChild(board(smin, smax, fmin, fmax, x, y));

  for (const stop of chord.stops) {
    const set = (e) => classify(e, stop.degree, stop.pitch(), stop.interval(chord.degree));
    const s = stop.string;
    const f = stop.fret;
    const l = stop.label.toString();

    switch (l) {
      case '_': break;
      case '+': grid.appendChild(set(    dot(x(s), t(f), 0.7))); break;
      case 'x': grid.appendChild(set(  cross(x(s), t(f), 1.0))); break;
      case '=': grid.appendChild(set( square(x(s), t(f), 1.0))); break;
      case '^': grid.appendChild(set(diamond(x(s), t(f), 1.2))); break;
      case 'o': grid.appendChild(set( circle(x(s), t(f), 1.0))); break;
      default:  grid.appendChild(set(  label(x(s), t(f),   l))); break;
    }
  }

  if (chord.mark()) {
    grid.appendChild(label(x(smax) - labelDistance, y(chord.mark()), chord.mark().toString()));
  }
  for (const s in chord.fingers) {
    grid.appendChild(label(x(s), labelDistance + y(fmax), chord.fingers[s].toString()));
  }

  var width  = (smax - smin + 2) * stringDistance;
  var height = (fmax - fmin + fgap * 0.5) * fretDistance + 2 * stopSize;

  grid.setAttribute('width',  width);
  grid.setAttribute('height', height);

  return grid;
}
