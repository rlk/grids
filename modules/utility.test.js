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

import { flatten, sharpen, toDegree, toPitch, toOffset, generateGrid } from './utility.js'
import { Stop } from './stop.js';

// flatten

test('flatten to flat', () => {
  expect(flatten('A')).toBe('A♭');
});

test('flatten to double flat', () => {
  expect(flatten('A♭')).toBe('A𝄫');
});

test('flatten to natural', () => {
  expect(flatten('A♯')).toBe('A');
});

// sharpen

test('sharpen to sharp', () => {
  expect(sharpen('A')).toBe('A♯');
});

test('sharpen to double sharp', () => {
  expect(sharpen('A♯')).toBe('A𝄪');
});

test('sharpen to natural', () => {
  expect(sharpen('A♭')).toBe('A');
});

// toDegree

test('toDegree underflow wraps', () => {
  expect(toDegree(0)).toBe(7);
});

test('toDegree low equals', () => {
  expect(toDegree(1)).toBe(1);
});

test('toDegree high equals', () => {
  expect(toDegree(7)).toBe(7);
});

test('toDegree overflow wraps', () => {
  expect(toDegree(8)).toBe(1);
});

// toPitch

test('toPitch underflow wraps', () => {
  expect(toPitch(0)).toBe(12);
});

test('toPitch low equals', () => {
  expect(toPitch(1)).toBe(1);
});

test('toPitch high equals', () => {
  expect(toPitch(12)).toBe(12);
});

test('toPitch overflow wraps', () => {
  expect(toPitch(13)).toBe(1);
});

// toOffset

test('toOffset equal ok', () => {
  expect(toOffset(6 - 6)).toBe(0);
});

test('toOffset flat ok', () => {
  expect(toOffset(5 - 6)).toBe(-1);
});

test('toOffset sharp ok', () => {
  expect(toOffset(6 - 5)).toBe(+1);
});

test('toOffset flat wraps', () => {
  expect(toOffset(12 - 1)).toBe(-1);
});

test('toOffset sharp wraps', () => {
  expect(toOffset(1 - 12)).toBe(+1);
});

test('toOffset double flat ok', () => {
  expect(toOffset(5 - 7)).toBe(-2);
});

test('toOffset double sharp ok', () => {
  expect(toOffset(7 - 5)).toBe(+2);
});

test('toOffset double flat wraps', () => {
  expect(toOffset(12 - 2)).toBe(-2);
  expect(toOffset(11 - 1)).toBe(-2);
});

test('toOffset double sharp wraps', () => {
  expect(toOffset(2 - 12)).toBe(+2);
  expect(toOffset(1 - 11)).toBe(+2);
});

// generateGrid

test('generateGrid creates Chord', () => {
  expect(generateGrid('C 1 cho'))
    .toEqual(expect.objectContaining({ key: 'C', degree: 1 }));
});

test('generateGrid creates Stop', () => {
  expect(generateGrid('C 1 cho 5 3 1 +'))
    .toEqual(expect.objectContaining({
      stops: expect.arrayContaining([
        expect.objectContaining(new Stop(5, 3, 1, '+', false))
      ])
    }));
});

test('generateGrid creates decor Stop', () => {
  expect(generateGrid('C 1 cho 5 3 1 (+)'))
  .toEqual(expect.objectContaining({
    stops: expect.arrayContaining([
      expect.objectContaining(new Stop(5, 3, 1, '+', true))
    ])
  }));
});
