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

import { Stop } from './stop.js';
import { Chord } from './chord.js';
import { Sequence } from './sequence.js';

const CMA7_5 = new Chord('C', 1, [  // Cma7 with the root on string 5
  new Stop(5, 3, 1),
  new Stop(4, 5, 5),
  new Stop(3, 4, 7),
  new Stop(2, 5, 3),
]);
const DMI7_5 = new Chord('C', 2, [  // Dmi7 with the root on string 5
  new Stop(5, 5, 2),
  new Stop(4, 7, 6),
  new Stop(3, 5, 1),
  new Stop(2, 6, 4),
]);
const FMA7_4 = new Chord('C', 4, [  // Fma7 with the root on string 4
  new Stop(4, 3, 4),
  new Stop(3, 5, 1),
  new Stop(2, 5, 3),
  new Stop(1, 5, 6),
]);
const G7_4 = new Chord('C', 5, [  // G7 with the root on string 4
  new Stop(4, 5, 5),
  new Stop(3, 7, 2),
  new Stop(2, 6, 4),
  new Stop(1, 7, 7),
]);

test('Sequence.constructor', () => {
  expect(new Sequence().add(CMA7_5).top()).toStrictEqual(CMA7_5);
});

test('Sequence.toString', () => {
  const string = new Sequence().add(CMA7_5).add(DMI7_5).toString();
  expect(string).toContain(CMA7_5.toString());
  expect(string).toContain(DMI7_5.toString());
});

// Sequence.add

test('Sequence.addNextUp', () => {
  expect(new Sequence().add(CMA7_5).addNextUp().top()).toStrictEqual(DMI7_5);
});

test('Sequence.addNextDown', () => {
  expect(new Sequence().add(DMI7_5).addNextDown().top()).toStrictEqual(CMA7_5);
});

test('Sequence.addFourthUp', () => {
  expect(new Sequence().add(CMA7_5).addFourthUp().top()).toStrictEqual(FMA7_4);
});

test('Sequence.addFifthDown', () => {
  expect(new Sequence().add(G7_4).addFifthDown().top()).toStrictEqual(CMA7_5);
});

test('Sequence.addNextPairUp', () => {
  const sequence = new Sequence().add(CMA7_5).add(FMA7_4).addNextPairUp();
  expect(sequence.top(2)).toStrictEqual(DMI7_5);
  expect(sequence.top(1)).toStrictEqual(G7_4);
});

test('Sequence.addNextPairDown', () => {
  const sequence = new Sequence().add(DMI7_5).add(G7_4).addNextPairDown();
  expect(sequence.top(2)).toStrictEqual(CMA7_5);
  expect(sequence.top(1)).toStrictEqual(FMA7_4);
});

// Sequence.align

test('Sequence.alignMarks default size', () => {
  const sequence = new Sequence().add(CMA7_5).addNextUp().addNextUp().alignMarks();

  expect(sequence.chords[0].mark() - sequence.chords[0].gridMin)
    .toBe(sequence.chords[1].mark() - sequence.chords[1].gridMin);

  expect(sequence.chords[0].gridMax - sequence.chords[0].mark())
    .toBe(sequence.chords[1].gridMax - sequence.chords[1].mark());

  expect(sequence.chords[0].gridMax - sequence.chords[0].gridMin).toBe(3);
  expect(sequence.chords[1].gridMax - sequence.chords[1].gridMin).toBe(3);
});

test('Sequence.alignMarks', () => {
  const sequence = new Sequence(5).add(CMA7_5).addNextUp().addNextUp().alignMarks();

  expect(sequence.chords[0].mark() - sequence.chords[0].gridMin)
    .toBe(sequence.chords[1].mark() - sequence.chords[1].gridMin);

    expect(sequence.chords[0].gridMax - sequence.chords[0].mark())
    .toBe(sequence.chords[1].gridMax - sequence.chords[1].mark());

  expect(sequence.chords[0].gridMax - sequence.chords[0].gridMin).toBe(5);
  expect(sequence.chords[1].gridMax - sequence.chords[1].gridMin).toBe(5);
});

test('Sequence.alignFrets default size', () => {
  const sequence = new Sequence().add(CMA7_5).addNextUp().addNextUp().alignFrets();
  expect(sequence.chords[0].gridMin).toBe(sequence.chords[1].gridMin);
  expect(sequence.chords[1].gridMin).toBe(sequence.chords[2].gridMin);
  expect(sequence.chords[0].gridMax).toBe(sequence.chords[1].gridMax);
  expect(sequence.chords[1].gridMax).toBe(sequence.chords[2].gridMax);
});

test('Sequence.alignFrets', () => {
  const sequence = new Sequence(5).add(CMA7_5).addNextUp().addNextUp().alignFrets();
  expect(sequence.chords[0].gridMin).toBe(sequence.chords[1].gridMin);
  expect(sequence.chords[1].gridMin).toBe(sequence.chords[2].gridMin);
  expect(sequence.chords[0].gridMax).toBe(sequence.chords[1].gridMax);
  expect(sequence.chords[1].gridMax).toBe(sequence.chords[2].gridMax);
});

test('Sequence.toElement', () => {
  const elements = new Sequence().add(CMA7_5).add(DMI7_5).toElement('span');
  expect(elements[0]).toStrictEqual(CMA7_5.toElement('span'));
  expect(elements[1]).toStrictEqual(DMI7_5.toElement('span'));
});
