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

import { jest } from '@jest/globals'
import { flatten, sharpen, toDegree, toPitch, toOffset, generateGrid } from './utility.js'
import { Stop } from './stop.js';
import { Chord } from './chord.js';
import { Bar } from './bar.js';

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

test('generateGrid pushes number', () => {
  expect(generateGrid('1')).toBe(1);
});

test('generateGrid pushes symbol', () => {
  expect(generateGrid('A')).toBe('A');
});

test('generateGrid pushes stack', () => {
  expect(generateGrid('A B')).toEqual(['A', 'B']);
});

// generateGrid Chord

test('generateGrid pushes Chord', () => {
  expect(generateGrid('C 1 cho'))
    .toEqual(new Chord('C', 1));
});

test('generateGrid adds Stop', () => {
  expect(generateGrid('C 1 cho 5 3 1 +'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1, '+', false)]));
});

test('generateGrid adds decor Stop', () => {
  expect(generateGrid('C 1 cho 5 3 1 (+)'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1, '+', true)]));
});

test('generateGrid adds labeled Stop', () => {
  expect(generateGrid('C 1 cho 5 3 1 foo .'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1, 'foo', false)]));
});

test('generateGrid adds Chord finger', () => {
  expect(generateGrid('C 1 cho 5 1 #'))
  .toEqual(new Chord('C', 1).setFingers({ 5: 1 }));
});

test('generateGrid adds Chord fingers', () => {
  expect(generateGrid('C 1 cho 5 1 # 4 3 #'))
  .toEqual(new Chord('C', 1).setFingers({ 5: 1, 4: 3 }));
});

test('generateGrid sets Optional', () => {
  expect(generateGrid('C 1 cho ?'))
    .toEqual(new Chord('C', 1).setOptional(true));
});

test('generateGrid sets NoSymbol', () => {
  expect(generateGrid('C 1 cho $'))
    .toEqual(new Chord('C', 1).setNoSymbol(true));
});

test('generateGrid sets Text', () => {
  expect(generateGrid('C 1 cho hello !'))
  .toEqual(new Chord('C', 1).setText('hello'));
});

test('generateGrid adds Chord', () => {
  expect(generateGrid('C 1 cho'))
    .toEqual(new Chord('C', 1));
});

test('generateGrid adds Chords', () => {
  expect(generateGrid('C 1 cho C 2 cho'))
    .toEqual([new Chord('C', 1), new Chord('C', 2)]);
});

test('generateGrid adds Chord with stops', () => {
  expect(generateGrid('C 1 cho 5 3 1 + 4 2 3 + 3 0 5 +'))
    .toEqual(new Chord('C', 1, [
      new Stop(5, 3, 1),
      new Stop(4, 2, 3),
      new Stop(3, 0, 5),
    ]));
});

test('generateGrid adds Chord drop', () => {
  expect(generateGrid('C 1 cho C 2 cho drop'))
    .toEqual(new Chord('C', 1));
});

test('generateGrid adds Chord swap', () => {
  expect(generateGrid('C 1 cho C 2 cho swap'))
    .toEqual([new Chord('C', 2), new Chord('C', 1)]);
});

test('generateGrid adds Chord dupe', () => {
  expect(generateGrid('C 1 cho C 2 cho dupe'))
    .toEqual([new Chord('C', 1), new Chord('C', 2), new Chord('C', 2)]);
});

test('generateGrid adds Chord over', () => {
  expect(generateGrid('C 1 cho C 2 cho over'))
    .toEqual([new Chord('C', 1), new Chord('C', 2), new Chord('C', 1)]);
});

test('generateGrid applies inc string', () => {
  expect(generateGrid('C 1 cho 5 5 2 + s+'))
    .toEqual(new Chord('C', 1).add(6, 10, 2));
});

test('generateGrid applies dec string', () => {
  expect(generateGrid('C 1 cho 5 5 2 + s-', true))
    .toEqual(new Chord('C', 1).add(4, 0, 2));
});

test('generateGrid applies inc degree', () => {
  expect(generateGrid('C 1 cho d+'))
    .toEqual(new Chord('C', 2));
});

test('generateGrid applies dec degree', () => {
  expect(generateGrid('C 2 cho d-'))
    .toEqual(new Chord('C', 1));
});

test('generateGrid applies 4th up', () => {
  expect(generateGrid('C 1 cho 4+'))
    .toEqual(new Chord('C', 4));
});

test('generateGrid applies 5th down', () => {
  expect(generateGrid('C 1 cho 5-'))
    .toEqual(new Chord('C', 4));
});

test('generateGrid applies inc inversion', () => {
  expect(generateGrid('C 1 cho 5 3 1 + 4 2 3 + 3 0 5 + i+', true))
    .toEqual(new Chord('C', 1).add(5, 7, 3).add(4, 5, 5).add(3, 5, 1));
});

test('generateGrid applies dec inversion', () => {
  expect(generateGrid('C 1 cho 5 7 3 + 4 5 5 + 3 5 1 + i-', true))
    .toEqual(new Chord('C', 1).add(5, 3, 1).add(4, 2, 3).add(3, 0, 5));
});

test('generateGrid applies inc octave', () => {
  expect(generateGrid('C 1 cho 5 3 1 + o+'))
    .toEqual(new Chord('C', 1).add(5, 15, 1));
});

test('generateGrid applies dec octave', () => {
  expect(generateGrid('C 1 cho 5 15 1 + o-'))
    .toEqual(new Chord('C', 1).add(5, 3, 1));
});

test('generateGrid aligns Chords at fret', () => {
  expect(generateGrid(
    'C 1 cho 4 10 1 + 3 9 3 + 2 8 5 + ' +
    'C 1 cho 3  5 1 + 2 5 3 + 1 3 4 + af'))
    .toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gridMin: 2, gridMax: 10 }),
        expect.objectContaining({ gridMin: 2, gridMax: 10 }),
      ]));
});

test('generateGrid aligns Chords at mark', () => {
  expect(generateGrid(
    'C 1 cho 4 10 1 + 3 9 3 + 2 8 5 + ' +
    'C 1 cho 3 5 1 + 2 5 3 + 1 3 4 + am'))
    .toEqual(expect.arrayContaining([
      expect.objectContaining({ gridMin: 7, gridMax: 12 }),
      expect.objectContaining({ gridMin: 2, gridMax: 7 }),
    ]));
});

// generateGrid Bar

test('generateGrid adds start repeat Bar ', () => {
  expect(generateGrid('|:')).toEqual(new Bar('&#x1D106;'));
});

test('generateGrid adds Bar', () => {
  expect(generateGrid('|')).toEqual(new Bar('&#x1D100;'));
});

test('generateGrid adds end repeat Bar ', () => {
  expect(generateGrid(':|')).toEqual(new Bar('&#x1D107;'));
});

test('generateGrid adds space Bar', () => {
  expect(generateGrid('spc')).toEqual(new Bar('&nbsp;'));
});

// generateGrid toElement

test('generateGrid creates Chord span', () => {
  expect(generateGrid('C 1 cho 5 3 1 + span'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1)]).toElement('span'));
});

test('generateGrid creates Chord td', () => {
  expect(generateGrid('C 1 cho 5 3 1 + td'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1)]).toElement('td'));
});

// debug logging

test('debug logging appears', () => {
  const logSpy = jest.spyOn(console, 'log');

  expect(generateGrid('A B C', true)).toEqual(['A', 'B', 'C']);

  expect(logSpy).toHaveBeenCalledWith('A');
  expect(logSpy).toHaveBeenCalledWith('A B');
  expect(logSpy).toHaveBeenCalledWith('A B C');
});
