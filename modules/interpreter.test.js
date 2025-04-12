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
import { Stop } from './stop.js';
import { Chord } from './chord.js';
import { Options } from './options.js';
import { interpret } from './interpreter.js'

// interpret

test('interpret pushes number', () => {
  expect(interpret('1')).toBe(1);
});

test('interpret pushes symbol', () => {
  expect(interpret('A')).toBe('A');
});

test('interpret pushes stack', () => {
  expect(interpret('A B')).toEqual(['A', 'B']);
});

// interpret Chord

test('interpret pushes Chord', () => {
  expect(interpret('C 1 chord'))
    .toEqual(new Chord('C', 1));
});

test('interpret pushes Chords', () => {
  expect(interpret('C 1 chord C 2 chord'))
    .toEqual([new Chord('C', 1), new Chord('C', 2)]);
});

test('interpret adds Stop', () => {
  expect(interpret('C 5 chord 5 5 1 +'))
    .toEqual(new Chord('C', 5, [new Stop(5, 5, 5, '+', false)]));
});

test('interpret adds decor Stop', () => {
  expect(interpret('C 5 chord 5 5 1 (+)'))
    .toEqual(new Chord('C', 5, [new Stop(5, 5, 5, '+', true)]));
});

test('interpret adds labeled Stop', () => {
  expect(interpret('C 5 chord 5 5 1 foo .'))
    .toEqual(new Chord('C', 5, [new Stop(5, 5, 5, 'foo', false)]));
});

test('interpret adds multiple stops', () => {
  expect(interpret('C 1 chord 5 3 1 + 4 2 3 + 3 0 5 +'))
    .toEqual(new Chord('C', 1, [
      new Stop(5, 3, 1),
      new Stop(4, 2, 3),
      new Stop(3, 0, 5),
    ]));
});

test('interpret rotates stops', () => {
  expect(interpret('C 1 chord 5 3 1 + 4 2 3 + 3 0 5 + @'))
    .toEqual(new Chord('C', 1, [
      new Stop(4, 2, 3),
      new Stop(3, 0, 5),
      new Stop(5, 3, 1),
    ]));
});

test('interpret quotes Stop', () => {
  expect(interpret("C 5 chord 5 5 1 + C 1 chord 0 ' "))
    .toEqual([
      new Chord('C', 5, [new Stop(5, 5, 5, '+', false)]),
      new Chord('C', 1, [new Stop(5, 5, 5, '+', false)])]);
});

test('interpret sets Optional', () => {
  expect(interpret('C 1 chord *'))
    .toEqual(new Chord('C', 1, [], new Options().setOptional(true)));
});

test('interpret sets NoSymbol', () => {
  expect(interpret('C 1 chord $'))
    .toEqual(new Chord('C', 1, [], new Options().setNoSymbol(true)));
});

test('interpret sets Text', () => {
  expect(interpret('C 1 chord hello !'))
    .toEqual(new Chord('C', 1, [], new Options().setText('hello')));
});

test('interpret sets Chord finger', () => {
  expect(interpret('C 1 chord 5 1 #'))
    .toEqual(new Chord('C', 1, [], new Options().setFinger(5, 1)));
});

test('interpret sets Chord fingers', () => {
  expect(interpret('C 1 chord 5 1 # 4 3 #'))
    .toEqual(new Chord('C', 1, [], new Options().setFinger(5, 1).setFinger(4, 3)));
});

test('interpret chooses first valid', () => {
  expect(interpret('C 1 chord 2 1 1 + C 2 chord 2 3 2 + ?'))
    .toEqual(new Chord('C', 1, [new Stop(2, 1, 1)]));
});

test('interpret chooses left valid', () => {
  expect(interpret('C 1 chord 2 1 1 + C 2 chord 0 1 1 + ?'))
    .toEqual(new Chord('C', 1, [new Stop(2, 1, 1)]));
});

test('interpret chooses right valid', () => {
  expect(interpret('C 2 chord 0 1 1 + C 1 chord 2 1 1 + ?'))
    .toEqual(new Chord('C', 1, [new Stop(2, 1, 1)]));
});

test('interpret drops Chord', () => {
  expect(interpret('C 1 chord C 2 chord drop'))
    .toEqual(new Chord('C', 1));
});

test('interpret swaps Chords', () => {
  expect(interpret('C 1 chord C 2 chord swap'))
    .toEqual([new Chord('C', 2), new Chord('C', 1)]);
});

test('interpret dupes Chord', () => {
  expect(interpret('C 1 chord C 2 chord dupe'))
    .toEqual([new Chord('C', 1), new Chord('C', 2), new Chord('C', 2)]);
});

test('interpret overs Chord', () => {
  expect(interpret('C 1 chord C 2 chord over'))
    .toEqual([new Chord('C', 1), new Chord('C', 2), new Chord('C', 1)]);
});

test('interpret applies inc octave', () => {
  expect(interpret('C 1 chord 5 3 1 + o+'))
    .toEqual(new Chord('C', 1).add(5, 15, 1));
});

test('interpret applies dec octave', () => {
  expect(interpret('C 1 chord 5 15 1 + o-'))
    .toEqual(new Chord('C', 1).add(5, 3, 1));
});

test('interpret applies inc string', () => {
  expect(interpret('C 1 chord 5 5 2 + s+'))
    .toEqual(new Chord('C', 1).add(6, 10, 2));
});

test('interpret applies dec string', () => {
  expect(interpret('C 1 chord 5 5 2 + s-'))
    .toEqual(new Chord('C', 1).add(4, 0, 2));
});

test('interpret applies inc fret', () => {
  expect(interpret('C 1 chord f+'))
    .toEqual(new Chord('C♯', 1));
});

test('interpret applies dec fret', () => {
  expect(interpret('C 1 chord f-'))
    .toEqual(new Chord('B', 1));
});

test('interpret applies inc degree', () => {
  expect(interpret('C 1 chord d+'))
    .toEqual(new Chord('C', 2));
});

test('interpret applies dec degree', () => {
  expect(interpret('C 2 chord d-'))
    .toEqual(new Chord('C', 1));
});

test('interpret applies 4th up', () => {
  expect(interpret('C 1 chord 4+'))
    .toEqual(new Chord('C', 4));
});

test('interpret applies 5th down', () => {
  expect(interpret('C 1 chord 5-'))
    .toEqual(new Chord('C', 4));
});

test('interpret applies inc inversion', () => {
  expect(interpret('C 1 chord 5 3 1 + 4 2 3 + 3 0 5 + i+'))
    .toEqual(new Chord('C', 1).add(5, 7, 3).add(4, 5, 5).add(3, 5, 1));
});

test('interpret applies dec inversion', () => {
  expect(interpret('C 1 chord 5 7 3 + 4 5 5 + 3 5 1 + i-'))
    .toEqual(new Chord('C', 1).add(5, 3, 1).add(4, 2, 3).add(3, 0, 5));
});

test('interpret aligns Chords at fret', () => {
  expect(interpret(
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

test('interpret aligns Chords at mark', () => {
  expect(interpret(
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

// interpret bar

test('interpret adds start repeat bar ', () => {
  const element = interpret('|:');
  expect(element.classList.contains('bar')).toBe(true);
  expect(element.textContent).toContain('𝄆');
});

test('interpret adds bar', () => {
  const element = interpret('|');
  expect(element.classList.contains('bar')).toBe(true);
  expect(element.textContent).toContain('𝄀');
});

test('interpret adds end repeat bar ', () => {
  const element = interpret(':|');
  expect(element.classList.contains('bar')).toBe(true);
  expect(element.textContent).toContain('𝄇');
});

// interpret dupe

test('interpret dupe text', () => {
  expect(interpret('abc dupe'))
    .toEqual(['abc', 'abc']);
});

test('interpret dupe Chord', () => {
  expect(interpret('C 1 chord dupe'))
    .toEqual([new Chord('C', 1), new Chord('C', 1)]);
});

test('interpret dupe Element', () => {
  expect(interpret('( span ) dupe'))
    .toEqual([document.createElement('span'), document.createElement('span')]);
});

// interpret Elements

test('interpret creates element', () => {
  const element = interpret('( span )');
  expect(element.localName).toBe('span');
});

test('interpret creates text element', () => {
  const element = interpret('( abc span )');
  expect(element.localName).toBe('span');
  expect(element.textContent).toContain('abc');
});

test('interpret creates Chord span', () => {
  const element = interpret('( C 1 chord 5 3 1 + span )');
  expect(element.localName).toBe('span');
  expect(element.innerHTML).toContain('svg');
});

test('interpret creates Chord spans', () => {
  const elements = interpret('( C 1 chord span ) ( C 2 chord span )');
  expect(elements[0].localName).toBe('span');
  expect(elements[0].innerHTML).toContain('svg');
  expect(elements[1].localName).toBe('span');
  expect(elements[1].innerHTML).toContain('svg');
});

test('interpret sets class', () => {
  const element = interpret('( span ) abc class');
  expect(element.localName).toBe('span');
  expect(element.className).toBe('abc');
});

test('interpret creates outer element', () => {
  const element = interpret('( ( abc b ) ( xyz i ) span )');
  expect(element.localName).toBe('span');
  expect(element.children[0].localName).toBe('b');
  expect(element.children[0].textContent).toContain('abc');
  expect(element.children[1].localName).toBe('i');
  expect(element.children[1].textContent).toContain('xyz');
});

test('interpret creates inner element', () => {
  const elements = interpret('[ ( abc b ) ( xyz i ) span ]');
  expect(elements[0].localName).toBe('span');
  expect(elements[0].children[0].localName).toBe('b');
  expect(elements[0].children[0].textContent).toContain('abc');
  expect(elements[1].localName).toBe('span');
  expect(elements[1].children[0].localName).toBe('i');
  expect(elements[1].children[0].textContent).toContain('xyz');
});

// definition

test('interpret creates 1-word definition', () => {
  expect(interpret(': p 1 ; p p')).toEqual([1, 1]);
});

test('interpret creates 3-word definition', () => {
  expect(interpret(': p 2 3 4 ; p p')).toEqual([2, 3, 4, 2, 3, 4]);
});

test('interpret persists definitions', () => {
  expect(interpret(': p 1 ;')).toEqual([]);
  expect(interpret('p p')).toEqual([1, 1]);
});

test('interpret creates chord function', () => {
  expect(interpret(': dd d+ d+ ; C 1 chord dd'))
    .toEqual(new Chord('C', 3));
});

test('interpret creates element function', () => {
  const elements = interpret(': a ( abc span ) ; a a');
  expect(elements[0].localName).toBe('span');
  expect(elements[0].textContent).toContain('abc');
  expect(elements[1].localName).toBe('span');
  expect(elements[1].textContent).toContain('abc');
});

// debug logging

test('debug logging appears', () => {
  const logSpy = jest.spyOn(console, 'log');

  expect(interpret('A B C', true)).toEqual(['A', 'B', 'C']);

  expect(logSpy).toHaveBeenCalledWith('← A');
  expect(logSpy).toHaveBeenCalledWith('A ← B');
  expect(logSpy).toHaveBeenCalledWith('A B ← C');
  expect(logSpy).toHaveBeenCalledWith('A B C');
});

test('debug logging displays HTML', () => {
  const logSpy = jest.spyOn(console, 'log');

  expect(interpret('( A b )', true).outerHTML).toBe("<b> A </b>");

  expect(logSpy).toHaveBeenCalledWith('← (');
  expect(logSpy).toHaveBeenCalledWith('( ← A');
  expect(logSpy).toHaveBeenCalledWith('( A ← b');
  expect(logSpy).toHaveBeenCalledWith('( A b ← )');
  expect(logSpy).toHaveBeenCalledWith('<b> A </b>');
});
