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

var    stopSize     = 3.5;
var  stringDistance = 8;
var    fretDistance = 16;
var   labelDistance = 5;

function elem(tag, attributes, text) {
  var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for ([k, v] of attributes) {
    if (v) {
      e.setAttribute(k, v);
    }
  }
  if (text) {
    e.innerHTML = text;
  }
  return e
}

function color(elem, stroke, fill) {
  style = []

  if (stroke) {
    style.push(`stroke: ${stroke}`)
  }
  if (fill) {
    style.push(`fill: ${fill}`)
  }
  if (style.length > 0) {
    elem.setAttribute('style', style.join('; '))
  }
  return elem
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
  ftop = Math.max(fmin, 0)
  path = []
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

function createGrid(text) {
  var grid = elem('svg', []);
  var fmin = Number.MAX_VALUE;
  var smin = Number.MAX_VALUE;
  var fmax = 0;
  var smax = 0;
  var fgap = 0;
  var name = undefined;
  var extn = undefined;
  var note = undefined;
  var marks = [];

  function x(s) {
    return (1 + smax - s) * stringDistance;
  }
  function y(f) {
    return 1 + stopSize + (f - fmin) * fretDistance;
  }
  function t(f) {
    return Math.max(y(0), (y(f) + y(f - 1)) * 0.5);
  }
  function n(a) {
    if (isNaN(a)) {
      if ("A" <= a && a <= "Z") {
        return a.charCodeAt() - 55;
      }
      return NaN;
    }
    return a;
  }

  for (const t of text.split(/\s+/)) {
    if (t.length > 0) {
      var a = t.split(':');
      var d = a[0]
      var s = a[1]
      var f = a[2]
      var c = a[3]

      if (d != "n" && d != "e" && d != "N") {
        s = n(s);
        f = n(f);
        if (d != "f" && d != "F") {
          if (!isNaN(s)) {
            smin = Math.min(smin, s);
            smax = Math.max(smax, s);
          }
          if (!isNaN(f)) {
            fmin = Math.min(fmin, f);
            fmax = Math.max(fmax, f);
          }
        }
      }
      marks.push([d, s, f, c]);
    }
  }
  fmin = fmin - 1;

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

  for (const [d, s, f, c] of marks) {
    switch (d) {
      case "_": break;
      case "n": name = s; break;
      case "e": extn = s; break;
      case "N": note = s; break;
      case "+": grid.appendChild(color(    dot(x(s), t(f), 0.5), c, c)); break;
      case "o": grid.appendChild(color( circle(x(s), t(f), 1.0), c)); break;
      case "s": grid.appendChild(color( square(x(s), t(f), 1.0), c)); break;
      case "S": grid.appendChild(color( square(x(s), t(f), 1.2), c)); break;
      case "x": grid.appendChild(color(  cross(x(s), t(f), 1.0), c)); break;
      case "d": grid.appendChild(color(diamond(x(s), t(f), 1.2), c)); break;
      case "D": grid.appendChild(color(diamond(x(s), t(f), 1.6), c)); break;
      case "f": grid.appendChild(color(  label(x(s),  labelDistance + y(fmax), f.toString()), undefined, c)); fgap = 1; break;
      case "F": grid.appendChild(color(  label(x(smax) - labelDistance,  y(s), s.toString()), undefined, c));           break;
      default:  grid.appendChild(color(  label(x(s), t(f), d), undefined, c)); break;
    }
  }

  var width  = (smax - smin + 2) * stringDistance;
  var height = (fmax - fmin + fgap * 0.5) * fretDistance + 2 * stopSize;

  grid.setAttribute('width',  width);
  grid.setAttribute('height', height);

  if (name || extn || note) {
    column = document.createElement('span');
    column.setAttribute('class', 'column');

    if (name || extn) {
      var head = document.createElement('span')
      head.setAttribute('class', 'head');
      if (name) {
        var e = document.createElement('span')
        e.setAttribute('class', 'name');
        e.innerHTML = name;
        head.appendChild(e);
      }
      if (extn) {
        var e = document.createElement('span')
        e.setAttribute('class', 'extn');
        e.innerHTML = extn;
        head.appendChild(e);
      }
      column.appendChild(head)
    }
    column.appendChild(grid);
    if (note) {
      var e = document.createElement('span')
      e.setAttribute('class', 'note');
      e.innerHTML = note;
      column.appendChild(e);
    }
    return column
  }
  return grid;
}

function render() {
  for (element of document.getElementsByClassName('grid')) {
    element.replaceChildren(createGrid(element.innerHTML));
  }
}

document.addEventListener('DOMContentLoaded', function() { render() }, false);
