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
import { flatten, sharpen, toDegree, toPitch, toOffset, toNode, evaluate } from './utility.js'
import { Stop } from './stop.js';
import { Chord } from './chord.js';
import { Options } from './options.js';

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

// toNode

test('toNode handles Chord', () => {
  const node = toNode(new Chord(), 'abc');
  expect(node).toBeInstanceOf(Node);
  expect(node.localName).toBe('abc');
});

test('toNode handles Element', () => {
  const node = toNode(document.createElement('abc'), null);
  expect(node).toBeInstanceOf(Node);
  expect(node.localName).toBe('abc');
});

test('toNode handles text', () => {
  const node = toNode('abc', null);
  expect(node).toBeInstanceOf(Node);
  expect(node.wholeText).toBe(' abc ');
});

// evaluate

test('evaluate pushes number', () => {
  expect(evaluate('1')).toBe(1);
});

test('evaluate pushes symbol', () => {
  expect(evaluate('A')).toBe('A');
});

test('evaluate pushes stack', () => {
  expect(evaluate('A B')).toEqual(['A', 'B']);
});

// evaluate Chord

test('evaluate pushes Chord', () => {
  expect(evaluate('C 1 chord'))
    .toEqual(new Chord('C', 1));
});

test('evaluate adds Stop', () => {
  expect(evaluate('C 1 chord 5 3 1 +'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1, '+', false)]));
});

test('evaluate adds decor Stop', () => {
  expect(evaluate('C 1 chord 5 3 1 (+)'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1, '+', true)]));
});

test('evaluate adds labeled Stop', () => {
  expect(evaluate('C 1 chord 5 3 1 foo .'))
    .toEqual(new Chord('C', 1, [new Stop(5, 3, 1, 'foo', false)]));
});

test('evaluate adds Chord finger', () => {
  expect(evaluate('C 1 chord 5 1 #'))
    .toEqual(new Chord('C', 1, [], new Options().setFinger(5, 1)));
});

test('evaluate adds Chord fingers', () => {
  expect(evaluate('C 1 chord 5 1 # 4 3 #'))
    .toEqual(new Chord('C', 1, [], new Options().setFinger(5, 1).setFinger(4, 3)));
});

test('evaluate sets Optional', () => {
  expect(evaluate('C 1 chord ?'))
    .toEqual(new Chord('C', 1, [], new Options().setOptional(true)));
});

test('evaluate sets NoSymbol', () => {
  expect(evaluate('C 1 chord $'))
    .toEqual(new Chord('C', 1, [], new Options().setNoSymbol(true)));
});

test('evaluate sets Text', () => {
  expect(evaluate('C 1 chord hello !'))
    .toEqual(new Chord('C', 1, [], new Options().setText('hello')));
});

test('evaluate adds Chord', () => {
  expect(evaluate('C 1 chord'))
    .toEqual(new Chord('C', 1));
});

test('evaluate adds Chords', () => {
  expect(evaluate('C 1 chord C 2 chord'))
    .toEqual([new Chord('C', 1), new Chord('C', 2)]);
});

test('evaluate adds Chord with stops', () => {
  expect(evaluate('C 1 chord 5 3 1 + 4 2 3 + 3 0 5 +'))
    .toEqual(new Chord('C', 1, [
      new Stop(5, 3, 1),
      new Stop(4, 2, 3),
      new Stop(3, 0, 5),
    ]));
});

test('evaluate adds Chord drop', () => {
  expect(evaluate('C 1 chord C 2 chord drop'))
    .toEqual(new Chord('C', 1));
});

test('evaluate adds Chord swap', () => {
  expect(evaluate('C 1 chord C 2 chord swap'))
    .toEqual([new Chord('C', 2), new Chord('C', 1)]);
});

test('evaluate adds Chord dupe', () => {
  expect(evaluate('C 1 chord C 2 chord dupe'))
    .toEqual([new Chord('C', 1), new Chord('C', 2), new Chord('C', 2)]);
});

test('evaluate adds Chord over', () => {
  expect(evaluate('C 1 chord C 2 chord over'))
    .toEqual([new Chord('C', 1), new Chord('C', 2), new Chord('C', 1)]);
});

test('evaluate applies inc string', () => {
  expect(evaluate('C 1 chord 5 5 2 + s+'))
    .toEqual(new Chord('C', 1).add(6, 10, 2));
});

test('evaluate applies dec string', () => {
  expect(evaluate('C 1 chord 5 5 2 + s-'))
    .toEqual(new Chord('C', 1).add(4, 0, 2));
});

test('evaluate applies inc degree', () => {
  expect(evaluate('C 1 chord d+'))
    .toEqual(new Chord('C', 2));
});

test('evaluate applies dec degree', () => {
  expect(evaluate('C 2 chord d-'))
    .toEqual(new Chord('C', 1));
});

test('evaluate applies 4th up', () => {
  expect(evaluate('C 1 chord 4+'))
    .toEqual(new Chord('C', 4));
});

test('evaluate applies 5th down', () => {
  expect(evaluate('C 1 chord 5-'))
    .toEqual(new Chord('C', 4));
});

test('evaluate applies inc inversion', () => {
  expect(evaluate('C 1 chord 5 3 1 + 4 2 3 + 3 0 5 + i+'))
    .toEqual(new Chord('C', 1).add(5, 7, 3).add(4, 5, 5).add(3, 5, 1));
});

test('evaluate applies dec inversion', () => {
  expect(evaluate('C 1 chord 5 7 3 + 4 5 5 + 3 5 1 + i-'))
    .toEqual(new Chord('C', 1).add(5, 3, 1).add(4, 2, 3).add(3, 0, 5));
});

test('evaluate applies inc octave', () => {
  expect(evaluate('C 1 chord 5 3 1 + o+'))
    .toEqual(new Chord('C', 1).add(5, 15, 1));
});

test('evaluate applies dec octave', () => {
  expect(evaluate('C 1 chord 5 15 1 + o-'))
    .toEqual(new Chord('C', 1).add(5, 3, 1));
});

test('evaluate aligns Chords at fret', () => {
  expect(evaluate(
    'C 1 chord 4 10 1 + 3 9 3 + 2 8 5 + ' +
    'C 1 chord 3  5 1 + 2 5 3 + 1 3 4 + af'))
    .toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          options: expect.objectContaining({ gridMin: 2, gridMax: 10 })
        }),
        expect.objectContaining({
          options: expect.objectContaining({ gridMin: 2, gridMax: 10 })
        }),
      ]));
});

test('evaluate aligns Chords at mark', () => {
  expect(evaluate(
    'C 1 chord 4 10 1 + 3 9 3 + 2 8 5 + ' +
    'C 1 chord 3 5 1 + 2 5 3 + 1 3 4 + am'))
    .toEqual(expect.arrayContaining([
      expect.objectContaining({
        options: expect.objectContaining({ gridMin: 7, gridMax: 12 })
      }),
      expect.objectContaining({
        options: expect.objectContaining({ gridMin: 2, gridMax: 7 })
      }),
    ]));
});

// evaluate bar

test('evaluate adds start repeat bar ', () => {
  const element = evaluate('|:');
  expect(element.classList.contains('bar')).toBe(true);
  expect(element.innerHTML).toContain('𝄆');
});

test('evaluate adds bar', () => {
  const element = evaluate('|');
  expect(element.classList.contains('bar')).toBe(true);
  expect(element.innerHTML).toContain('𝄀');
});

test('evaluate adds end repeat bar ', () => {
  const element = evaluate(':|');
  expect(element.classList.contains('bar')).toBe(true);
  expect(element.innerHTML).toContain('𝄇');
});

// evaluate Elements

test('evaluate creates element', () => {
  const element = evaluate('span');
  expect(element.localName).toBe('span');
});

test('evaluate creates text element', () => {
  const element = evaluate('( abc span )');
  expect(element.localName).toBe('span');
  expect(element.innerHTML).toContain('abc');
});

test('evaluate creates Chord span', () => {
  const element = evaluate('( C 1 chord 5 3 1 + span )');
  expect(element.localName).toBe('span');
  expect(element.innerHTML).toContain('svg');
});

test('evaluate creates Chord spans', () => {
  const elements = evaluate('( C 1 chord span ) ( C 2 chord span )');
  expect(elements[0].localName).toBe('span');
  expect(elements[0].innerHTML).toContain('svg');
  expect(elements[1].localName).toBe('span');
  expect(elements[1].innerHTML).toContain('svg');
});

test('evaluate sets class', () => {
  const element = evaluate('span abc class');
  expect(element.localName).toBe('span');
  expect(element.className).toBe('abc');
});

// debug logging

test('debug logging appears', () => {
  const logSpy = jest.spyOn(console, 'log');

  expect(evaluate('( A B C', true)).toEqual([null, 'A', 'B', 'C']);

  expect(logSpy).toHaveBeenCalledWith('(');
  expect(logSpy).toHaveBeenCalledWith('( A');
  expect(logSpy).toHaveBeenCalledWith('( A B');
  expect(logSpy).toHaveBeenCalledWith('( A B C');
});
