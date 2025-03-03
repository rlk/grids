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

const AMI7_5 = new Chord('C', 6, [  // Ami7 with the root on string 5
  new Stop(5, 0, 6),
  new Stop(4, 2, 3),
  new Stop(3, 0, 5),
  new Stop(2, 1, 1),
]);
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
const EMI7_5 = new Chord('C', 3, [  // Emi7 with the root on string 5
  new Stop(5, 7, 3),
  new Stop(4, 9, 7),
  new Stop(3, 7, 2),
  new Stop(2, 8, 5),
]);
const CMA7_6 = new Chord('C', 1, [  // Cma7 with the root on string 6
  new Stop(6, 8, 1),
  new Stop(5, 10, 5),
  new Stop(4, 9, 7),
  new Stop(3, 9, 3),
]);

const GDOM7_0 = new Chord('C', 5, [  // G7 inversion 0
  new Stop(4, 0, 2),
  new Stop(3, 0, 5),
  new Stop(2, 0, 7),
  new Stop(1, 1, 4),
]);
const GDOM7_1 = new Chord('C', 5, [  // G7 inversion 1
  new Stop(4, 3, 4),
  new Stop(3, 4, 7),
  new Stop(2, 3, 2),
  new Stop(1, 3, 5),
]);
const GDOM7_2 = new Chord('C', 5, [  // G7 inversion 2
  new Stop(4, 5, 5),
  new Stop(3, 7, 2),
  new Stop(2, 6, 4),
  new Stop(1, 7, 7),
]);
const GDOM7_3 = new Chord('C', 5, [  // G7 inversion 3
  new Stop(4, 9, 7),
  new Stop(3, 10, 4),
  new Stop(2, 8, 5),
  new Stop(1, 10, 2),
]);
const GDOM7_4 = new Chord('C', 5, [  // G7 inversion 4
  new Stop(4, 12, 2),
  new Stop(3, 12, 5),
  new Stop(2, 12, 7),
  new Stop(1, 13, 4),
]);
const GDOM7_5 = new Chord('C', 5, [  // G7 inversion 5
  new Stop(4, 15, 4),
  new Stop(3, 16, 7),
  new Stop(2, 15, 2),
  new Stop(1, 15, 5),
]);

test('Sequence.constructor', () => {
  expect(new Sequence().add(CMA7_5).top()).toStrictEqual(CMA7_5);
});

test('Sequence.addNextUp', () => {
  expect(new Sequence().add(CMA7_5).addNextUp().top()).toStrictEqual(DMI7_5);
});

test('Sequence.addNextDown', () => {
  expect(new Sequence().add(DMI7_5).addNextDown().top()).toStrictEqual(CMA7_5);
});

test('Sequence.alignMarks', () => {
  const sequence = new Sequence().add(CMA7_5).addNextUp().addNextUp().alignMarks();

  expect(sequence.chords[0].mark() - sequence.chords[0].minFret)
    .toBe(sequence.chords[1].mark() - sequence.chords[1].minFret);

  expect(sequence.chords[0].maxFret - sequence.chords[0].mark())
    .toBe(sequence.chords[1].maxFret - sequence.chords[1].mark());

  expect(sequence.chords[0].maxFret - sequence.chords[0].minFret).toBe(2);
  expect(sequence.chords[1].maxFret - sequence.chords[1].minFret).toBe(2);
});

test('Sequence.alignMarks with size', () => {
  const sequence = new Sequence().add(CMA7_5).addNextUp().addNextUp().alignMarks(5);

  expect(sequence.chords[0].mark() - sequence.chords[0].minFret)
    .toBe(sequence.chords[1].mark() - sequence.chords[1].minFret);

    expect(sequence.chords[0].maxFret - sequence.chords[0].mark())
    .toBe(sequence.chords[1].maxFret - sequence.chords[1].mark());

  expect(sequence.chords[0].maxFret - sequence.chords[0].minFret).toBe(5);
  expect(sequence.chords[1].maxFret - sequence.chords[1].minFret).toBe(5);
});

test('Sequence.alignFrets', () => {
  const sequence = new Sequence().add(CMA7_5).addNextUp().addNextUp().alignFrets();
  expect(sequence.chords[0].minFret).toBe(sequence.chords[1].minFret);
  expect(sequence.chords[1].minFret).toBe(sequence.chords[2].minFret);
  expect(sequence.chords[0].maxFret).toBe(sequence.chords[1].maxFret);
  expect(sequence.chords[1].maxFret).toBe(sequence.chords[2].maxFret);
});
