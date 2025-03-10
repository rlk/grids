/** @jest-environment jsdom */

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

import { createGrid } from './grid.js';
import { Chord } from './chord.js';

function dots(elements) {
  return [...elements].filter((c) => c.tagName == 'circle' && c.classList.contains('dot'));
}

test('createGrid returns a column', () => {
  const element = createGrid(new Chord('C', 1).add(5, 3, 1));
  expect(element.classList.contains('column')).toBe(true);
});

test('createGrid first child is a span', () => {
  const element = createGrid(new Chord('C', 1).add(5, 3, 1));
  expect(element.children.length).toBe(2);
  expect(element.children[0].localName).toBe('span');
});

test('createGrid second child is an svg', () => {
  const element = createGrid(new Chord('C', 1).add(5, 3, 1));
  expect(element.children.length).toBe(2);
  expect(element.children[1].localName).toBe('svg');
});

test('createGrid one Stop creates one dot', () => {
  const element = createGrid(new Chord('C', 1).add(5, 3, 1));
  const svg = element.children[1];
  expect(dots(svg.children)).toHaveLength(1);
});
