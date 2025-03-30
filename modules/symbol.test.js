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

import { Symbol, toFormula } from './symbol.js';

test('toFormula', () => {
  expect(toFormula(Object.assign(new Array(8), {3:-2}))).toBe('𝄫3');
});

test('toFormula', () => {
  expect(toFormula(Object.assign(new Array(8), {3:-1}))).toBe('♭3');
});

test('toFormula', () => {
  expect(toFormula(Object.assign(new Array(8), {3:0}))).toBe('3');
});

test('toFormula', () => {
  expect(toFormula(Object.assign(new Array(8), {3:1}))).toBe('♯3');
});

test('toFormula', () => {
  expect(toFormula(Object.assign(new Array(8), {3:2}))).toBe('𝄪3');
});

test('toFormula', () => {
  expect(toFormula(Object.assign(new Array(8), {1:0, 3:0, 5:0}))).toBe('1 3 5');
});

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
  expect(element.childElementCount).toBe(4);

  expect(element.children[0].textContent).toContain('A');
  expect(element.children[1].textContent).toContain('mi');
  expect(element.children[2].textContent).toContain('7');
  expect(element.children[3].textContent).toContain('E');
  expect(element.children[2].classList).toContain('extension');
});

test('Symbol.toElement default bass', () => {
  const element = new Symbol('A', 'mi', '7').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(3);

  expect(element.children[0].textContent).toContain('A');
  expect(element.children[1].textContent).toContain('mi');
  expect(element.children[2].textContent).toContain('7');
  expect(element.children[2].classList).toContain('extension');
});

test('Symbol.toElement default extension', () => {
  const element = new Symbol('A', 'mi').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(2);

  expect(element.children[0].textContent).toContain('A');
  expect(element.children[1].textContent).toContain('mi');
});

test('Symbol.toElement default triad', () => {
  const element = new Symbol('A').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(1);

  expect(element.children[0].textContent).toContain('A');
});

test('Symbol.toElement bass with no extension', () => {
  const element = new Symbol('A', 'mi', null, 'E').toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(3);

  expect(element.children[0].textContent).toContain('A');
  expect(element.children[1].textContent).toContain('mi');
  expect(element.children[2].textContent).toContain('E');
});

test('Symbol.toElement empty', () => {
  const element = new Symbol(null).toElement();

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(0);
});

test('Symbol.toElement optional', () => {
  const element = new Symbol('A', 'mi', '7', 'E').toElement(true);

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(6);

  expect(element.children[0].textContent).toContain('(');
  expect(element.children[5].textContent).toContain(')');
});

test('Symbol.toElement optional with default bass', () => {
  const element = new Symbol('A', 'mi', '7').toElement(true);

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(5);

  expect(element.children[0].textContent).toContain('(');
  expect(element.children[4].textContent).toContain(')');
});

test('Symbol.toElement optional with default extension', () => {
  const element = new Symbol('A', 'mi').toElement(true);

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(4);

  expect(element.children[0].textContent).toContain('(');
  expect(element.children[3].textContent).toContain(')');
});

test('Symbol.toElement optional with default triad', () => {
  const element = new Symbol('A').toElement(true);

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(3);

  expect(element.children[0].textContent).toContain('(');
  expect(element.children[2].textContent).toContain(')');
});

test('Symbol.toElement optional empty', () => {
  const element = new Symbol(null).toElement(true);

  expect(element.classList).toContain('symbol');
  expect(element.childElementCount).toBe(2);

  expect(element.children[0].textContent).toContain('(');
  expect(element.children[1].textContent).toContain(')');
});
