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

function filterElements(elements, localName, className) {
  return [...elements].filter(
    (c) => c.localName == localName && c.classList.contains(className));
}

// createGrid SVG elements

test('createGrid Chord has a board', () => {
  const svg = createGrid(new Chord('A', 1));
  expect(filterElements(svg.children, 'path', 'board')).toHaveLength(1);
});

test('createGrid one Stop creates one dot', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1));
  expect(filterElements(svg.children, 'circle', 'dot')).toHaveLength(1);
});

test('createGrid two Stops creates two dots', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1).add(4, 5, 5));
  expect(filterElements(svg.children, 'circle', 'dot')).toHaveLength(2);
});

test('createGrid _ Stop creates zero dots', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1, '_'));
  expect(filterElements(svg.children, 'circle', 'dot')).toHaveLength(0);
});

test('createGrid x Stop creates cross', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1, 'x'));
  expect(filterElements(svg.children, 'path', 'cross')).toHaveLength(1);
});

test('createGrid = Stop creates square', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1, '='));
  expect(filterElements(svg.children, 'path', 'square')).toHaveLength(1);
});

test('createGrid ^ Stop creates diamond', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1, '^'));
  expect(filterElements(svg.children, 'path', 'diamond')).toHaveLength(1);
});

test('createGrid o Stop creates circle', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1, 'o'));
  expect(filterElements(svg.children, 'circle', 'circle')).toHaveLength(1);
});

test('createGrid generic Stop creates label', () => {
  const svg = createGrid(new Chord('A', 1).add(5, 0, 1, 'A'));
  expect(filterElements(svg.children, 'text', 'label')).toHaveLength(1);
});

test('createGrid mark creates label', () => {
  const svg = createGrid(new Chord('C', 1).add(5, 3, 1));
  expect(filterElements(svg.children, 'text', 'label')).toHaveLength(1);
});

test('createGrid finger creates label', () => {
  const svg = createGrid(new Chord('A', 1).setFinger(5, 3));
  expect(filterElements(svg.children, 'text', 'label')).toHaveLength(1);
});

test('createGrid two finger creates two labels', () => {
  const svg = createGrid(new Chord('A', 1).setFinger(5, 3).setFinger(4, 2));
  expect(filterElements(svg.children, 'text', 'label')).toHaveLength(2);
});
