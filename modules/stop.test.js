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

import { Stop  } from './stop.js';

// Stop.constructor

test('Stop.constructor', () => {
  const stop = new Stop(1, 2, 3, 'x');
  expect(stop.string).toBe(1);
  expect(stop.fret).toBe(2);
  expect(stop.degree).toBe(3);
  expect(stop.label).toBe('x');
});

test('Stop.constructor label default', () => {
  const stop = new Stop(1, 2, 3);
  expect(stop.string).toBe(1);
  expect(stop.fret).toBe(2);
  expect(stop.degree).toBe(3);
  expect(stop.label).toBe('+');
});

// Stop.toString

test('Stop.toString', () => {
  expect(new Stop(1, 2, 3, 'x').toString()).toBe('x:1:2')
});

// Stop.isValid

test('Stop.isValid', () => {
  expect(new Stop(1, 1, 1, '+').isValid()).toBe(true);
});

test('Stop.isValid string low', () => {
  expect(new Stop(0, 1, 1, '+').isValid()).toBe(false);
});

test('Stop.isValid string high', () => {
  expect(new Stop(7, 1, 1, '+').isValid()).toBe(false);
});

test('Stop.isValid fret low', () => {
  expect(new Stop(1, -1, 1, '+').isValid()).toBe(false);
});

test('Stop.isValid degree low', () => {
  expect(new Stop(1, 1, 0, '+').isValid()).toBe(false);
});

test('Stop.isValid degree high', () => {
  expect(new Stop(1, 1, 8, '+').isValid()).toBe(false);
});

test('Stop.isValid label unknown', () => {
  expect(new Stop(1, 1, 8, '@').isValid()).toBe(false);
});

// Stop.incString / Stop.decString

test('Stop.incString', () => {
  expect(new Stop(2, 1, 1).incString()).toStrictEqual(new Stop(3, 5, 1));
});

test('Stop.decString', () => {
  expect(new Stop(3, 5, 1).decString()).toStrictEqual(new Stop(2, 1, 1));
});

test('Stop.incString invalid', () => {
  expect(new Stop(6, 1, 4).incString().isValid()).toBe(false);
});

test('Stop.decString invalid', () => {
  expect(new Stop(1, 1, 4).decString().isValid()).toBe(false);
});

test('Stop.incString temporarily invalid', () => {
  expect(new Stop(6, 1, 4).incString().decString()).toStrictEqual(new Stop(6, 1, 4));
});

test('Stop.decString temporarily invalid', () => {
  expect(new Stop(1, 1, 4).decString().incString()).toStrictEqual(new Stop(1, 1, 4));
});

// Stop.incDegree / Stop.decDegree

test('Stop.incDegree', () => {
  expect(new Stop(2, 1, 1).incDegree()).toStrictEqual(new Stop(2, 3, 2));
});

test('Stop.decDegree', () => {
  expect(new Stop(2, 3, 2).decDegree()).toStrictEqual(new Stop(2, 1, 1));
});

test('Stop.decDegree invalid', () => {
  expect(new Stop(2, 0, 7).decDegree().isValid()).toBe(false);
});

test('Stop.decDegree temporarily invalid', () => {
  expect(new Stop(2, 0, 7).decDegree().incDegree()).toStrictEqual(new Stop(2, 0, 7));
});

// Stop.incToDegree / Stop.decToDegree

test('Stop.incToDegree', () => {
  expect(new Stop(2, 1, 1).incToDegree(3)).toStrictEqual(new Stop(2, 5, 3));
});

test('Stop.decToDegree', () => {
  expect(new Stop(2, 5, 3).decToDegree(1)).toStrictEqual(new Stop(2, 1, 1));
});

test('Stop.decToDegree invalid', () => {
  expect(new Stop(2, 1, 1).decToDegree(5).isValid()).toBe(false);
});

test('Stop.decToDegree temporarily invalid', () => {
  expect(new Stop(2, 1, 1).decToDegree(5).incToDegree(1)).toStrictEqual(new Stop(2, 1, 1));
});
