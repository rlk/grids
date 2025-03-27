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

import { Options } from './options.js';

// Defaults

test('default text', () => {
  expect(new Options().text).toBe(null);
});

test('default fingers', () => {
  expect(new Options().fingers).toEqual({});
});

test('default nosymbol', () => {
  expect(new Options().nosymbol).toBe(false);
});

test('default optional', () => {
  expect(new Options().optional).toBe(false);
});

test('default gridMin', () => {
  expect(new Options().gridMin).toBe(null);
});

test('default gridMax', () => {
  expect(new Options().gridMax).toBe(null);
});

// Setters

test('with text', () => {
  expect(new Options().setText('abc').text).toBe('abc');
});

test('with fingers', () => {
  expect(new Options().setFinger(1, 2).fingers).toEqual({1: 2});
});

test('with nosymbol', () => {
  expect(new Options().setNoSymbol(true).nosymbol).toBe(true);
});

test('with optional', () => {
  expect(new Options().setOptional(true).optional).toBe(true);
});

test('with gridMin', () => {
  expect(new Options().setGridMin(10).gridMin).toBe(10);
});

test('with gridMax', () => {
  expect(new Options().setGridMax(10).gridMax).toBe(10);
});

// toString

test('toString with text', () => {
  expect(new Options().setText('abc').toString()).toContain('"abc"');
});

test('toString with fingers', () => {
  expect(new Options().setFinger(1, 2).toString()).toContain('1:2');
});

test('toString with nosymbol', () => {
  expect(new Options().setNoSymbol(true).toString()).toContain('nosymbol');
});

test('toString with optional', () => {
  expect(new Options().setOptional(true).toString()).toContain('optional');
});

test('toString with gridMin and gridMax', () => {
  expect(new Options().setGridMin(10).setGridMax(12).toString()).toContain('10-12');
});
