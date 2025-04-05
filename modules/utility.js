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

import { Chord, alignMarks, alignFrets } from './chord.js';

const offsetOfInterval = {
  1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11
};

export function flatten(name) {
  return (name + '♭').replace('♯♭', '').replace('♭♭', '𝄫');
}

export function sharpen(name) {
  return (name + '♯').replace('♭♯', '').replace('♯♯', '𝄪');
}

export function toDegree(degree) {
  if (degree < 1) {
    return toDegree(degree + 7);
  }
  if (degree > 7) {
    return toDegree(degree - 7);
  }
  return degree;
}

export function toPitch(pitch) {
  if (pitch < 1) {
    return toPitch(pitch + 12);
  }
  if (pitch > 12) {
    return toPitch(pitch - 12);
  }
  return pitch;
}

export function toOffset(offset) {
  if (offset < -2) {
    return offset + 12
  }
  if (offset > 2) {
    return offset - 12
  }
  return offset
}

export function calcOffset(root, pitch, interval) {
  return toOffset(pitch - toPitch(root + offsetOfInterval[interval]));
}

export function toElement(tagName, className, textContent) {
  var span = document.createElement(tagName);
  span.textContent = textContent;
  span.setAttribute('class', className);
  return span;
}

export function toNode(operand, tagName) {
  if (operand instanceof Chord) {
    return operand.toElement(tagName);
  }
  if (operand instanceof Element) {
    return operand;
  }
  return document.createTextNode(` ${operand} `);
}
