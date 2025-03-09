/** @jest-environment jsdom */

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

import { Symbol } from './symbol.js';

test('Symbol.constructor', () => {
  const symbol = new Symbol('A', 'mi', '7', 'E');
  expect(symbol.root).toBe('A');
  expect(symbol.triad).toBe('mi');
  expect(symbol.extension).toBe('7');
  expect(symbol.bass).toBe('E');
});

test('Symbol.constructor default bass', () => {
  const symbol = new Symbol('A', 'mi', '7');
  expect(symbol.root).toBe('A');
  expect(symbol.triad).toBe('mi');
  expect(symbol.extension).toBe('7');
  expect(symbol.bass).toBeNull();
});

test('Symbol.constructor default extension', () => {
  const symbol = new Symbol('A', 'mi');
  expect(symbol.root).toBe('A');
  expect(symbol.triad).toBe('mi');
  expect(symbol.extension).toBeNull();
  expect(symbol.bass).toBeNull();
});

test('Symbol.constructor default triad', () => {
  const symbol = new Symbol('A');
  expect(symbol.root).toBe('A');
  expect(symbol.triad).toBeNull();
  expect(symbol.extension).toBeNull();
  expect(symbol.bass).toBeNull();
});


test('Symbol.toString', () => {
  const string = new Symbol('A', 'mi', '7', 'E').toString();
  expect(string).toContain('A');
  expect(string).toContain('mi');
  expect(string).toContain('7');
  expect(string).toContain('E');
});

test('Symbol.toElement', () => {
  const element = new Symbol('A', 'mi', '7', 'E').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(3);

  expect(element.children[0].classList).toContain('root');
  expect(element.children[0].innerHTML).toContain('A');
  expect(element.children[0].innerHTML).toContain('mi');

  expect(element.children[1].classList).toContain('extension');
  expect(element.children[1].innerHTML).toContain('7');

  expect(element.children[2].classList).toContain('bass');
  expect(element.children[2].innerHTML).toContain('E');
});

test('Symbol.toElement default bass', () => {
  const element = new Symbol('A', 'mi', '7').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(2);

  expect(element.children[0].classList).toContain('root');
  expect(element.children[0].innerHTML).toContain('A');
  expect(element.children[0].innerHTML).toContain('mi');

  expect(element.children[1].classList).toContain('extension');
  expect(element.children[1].innerHTML).toContain('7');
});

test('Symbol.toElement default extension', () => {
  const element = new Symbol('A', 'mi').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(1);

  expect(element.children[0].classList).toContain('root');
  expect(element.children[0].innerHTML).toContain('A');
  expect(element.children[0].innerHTML).toContain('mi');
});

test('Symbol.toElement default triad', () => {
  const element = new Symbol('A').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(1);

  expect(element.children[0].classList).toContain('root');
  expect(element.children[0].innerHTML).toContain('A');
});
