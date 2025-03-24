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
  expect(new Options().withText('abc').text).toBe('abc');
});

test('with fingers', () => {
  expect(new Options().withFinger(1, 2).fingers).toEqual({1: 2});
});

test('with nosymbol', () => {
  expect(new Options().withNoSymbol(true).nosymbol).toBe(true);
});

test('with optional', () => {
  expect(new Options().withOptional(true).optional).toBe(true);
});

test('with gridMin', () => {
  expect(new Options().withGridMin(10).gridMin).toBe(10);
});

test('with gridMax', () => {
  expect(new Options().withGridMax(10).gridMax).toBe(10);
});

// Repeat setters

test('repeat text', () => {
  expect(new Options().withText('abc').withText('def').text).toBe('def');
});

test('repeat fingers', () => {
  expect(new Options().withFinger(1, 2).withFinger(3, 4).fingers).toEqual({1: 2, 3: 4});
});

test('repeat nosymbol', () => {
  expect(new Options().withNoSymbol(true).withNoSymbol(false).nosymbol).toBe(false);
});

test('repeat optional', () => {
  expect(new Options().withOptional(true).withOptional(false).optional).toBe(false);
});

test('repeat gridMin', () => {
  expect(new Options().withGridMin(10).withGridMin(12).gridMin).toBe(12);
});

test('repeat gridMax', () => {
  expect(new Options().withGridMax(10).withGridMax(12).gridMax).toBe(12);
});

// Multiple setters

test('with something and fingers', () => {
  var options = new Options().withText('abc').withFinger(1, 2);
  expect(options.text).toBe('abc');
  expect(options.fingers).toEqual({1: 2});
});

test('with something and nosymbol', () => {
  var options = new Options().withText('abc').withNoSymbol(true);
  expect(options.text).toBe('abc');
  expect(options.nosymbol).toBe(true);
});

test('with something and optional', () => {
  var options = new Options().withText('abc').withOptional(true);
  expect(options.text).toBe('abc');
  expect(options.optional).toBe(true);
});

test('with something and gridMin', () => {
  var options = new Options().withText('abc').withGridMin(10);
  expect(options.text).toBe('abc');
  expect(options.gridMin).toBe(10);
});

test('with something and gridMax', () => {
  var options = new Options().withText('abc').withGridMax(10);
  expect(options.text).toBe('abc');
  expect(options.gridMax).toBe(10);
});

test('with fingers and something', () => {
  var options = new Options().withFinger(1, 2).withText('abc');
  expect(options.text).toBe('abc');
  expect(options.fingers).toEqual({1: 2});
});

test('with nosymbol and something', () => {
  var options = new Options().withNoSymbol(true).withText('abc');
  expect(options.text).toBe('abc');
  expect(options.nosymbol).toBe(true);
});

test('with optional and something', () => {
  var options = new Options().withOptional(true).withText('abc');
  expect(options.text).toBe('abc');
  expect(options.optional).toBe(true);
});

test('with gridMin and something', () => {
  var options = new Options().withGridMin(10).withText('abc');
  expect(options.text).toBe('abc');
  expect(options.gridMin).toBe(10);
});

test('with gridMax and something', () => {
  var options = new Options().withGridMax(10).withText('abc');
  expect(options.text).toBe('abc');
  expect(options.gridMax).toBe(10);
});

// toString

test('toString with text', () => {
  expect(new Options().withText('abc').toString()).toContain('"abc"');
});

test('toString with fingers', () => {
  expect(new Options().withFinger(1, 2).toString()).toContain('1:2');
});

test('toString with nosymbol', () => {
  expect(new Options().withNoSymbol(true).toString()).toContain('nosymbol');
});

test('toString with optional', () => {
  expect(new Options().withOptional(true).toString()).toContain('optional');
});

test('toString with gridMin and gridMax', () => {
  expect(new Options().withGridMin(10).withGridMax(12).toString()).toContain('10-12');
});
