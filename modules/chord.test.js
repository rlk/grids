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
import { Chord, Optional, alignFrets, alignMarks } from './chord.js';
import { Symbol } from './symbol.js';

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

// Chord.toString

test('Chord.toString', () => {
  const string = new Chord('C', 1, [new Stop(1, 1, 1)]).toString();
  expect(string).toContain('C');
  expect(string).toContain('1 1 1 +');
});

test('Chord.setNote.toString', () => {
  const string = new Chord('C', 1, [new Stop(1, 1, 1)]).setNote('abc').toString();
  expect(string).toContain('C');
  expect(string).toContain('1 1 1 +');
  expect(string).toContain('abc');
});

// Chord.isValid

test('Chord.isValid', () => {
  expect(new Chord('C', 1, [new Stop(1, 1, 1)]).isValid()).toBe(true);
})

test('Chord.isValid bad stop', () => {
  expect(new Chord('C', 1, [new Stop(0, 1, 1)]).isValid()).toBe(false);
})

test('Chord.isValid degree low', () => {
  expect(new Chord('C', 0, [new Stop(1, 1, 1)]).isValid()).toBe(false);
})

test('Chord.isValid degree high', () => {
  expect(new Chord('C', 8, [new Stop(1, 1, 1)]).isValid()).toBe(false);
})

test('Chord.isValid bad key', () => {
  expect(new Chord('X', 1, [new Stop(1, 1, 1)]).isValid()).toBe(false);
})

// Chord builders

test('Chord.add', () => {
  expect(new Chord('C', 5).add(4, 5, 1, 'x', true))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, 'x', true)]));
})

test('Chord.add default decor', () => {
  expect(new Chord('C', 5).add(4, 5, 1, 'x'))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, 'x', false)]));
})

test('Chord.add default label', () => {
  expect(new Chord('C', 5).add(4, 5, 1))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, '+', false)]));
})

test('Chord.add multiple', () => {
  expect(new Chord('C', 5).add(4, 5, 1).add(3, 7, 5).add(2, 6, 7).add(1, 7, 3))
    .toStrictEqual(
      new Chord('C', 5, [
        new Stop(4, 5, 5, '+'),
        new Stop(3, 7, 2, '+'),
        new Stop(2, 6, 4, '+'),
        new Stop(1, 7, 7, '+')]));
})

// Chord.setFinger

test('Chord.setFinger', () => {
  expect(new Chord('C', 5).setFinger(1, 2).finger)
    .toEqual(expect.objectContaining({1: 2}));
})

// Chord.setNote

test('Chord.setNote', () => {
  expect(new Chord('C', 5).setNote('abc').note).toBe('abc');
})

// Chord.incString / Chord.decString

test('Chord.incString', () => {
  expect(CMA7_5.incString()).toStrictEqual(CMA7_6);
});

test('Chord.decString', () => {
  expect(CMA7_6.decString()).toStrictEqual(CMA7_5);
});

test('Chord.incString invalid', () => {
  expect(CMA7_6.incString().isValid()).toBe(false);
});

test('Chord.incString temporarily invalid', () => {
  expect(CMA7_6.incString().decString()).toStrictEqual(CMA7_6);
});

test('Chord.decString invalid', () => {
  expect(CMA7_5.decString().isValid()).toBe(false);
});

test('Chord.decString temporarily invalid', () => {
  expect(CMA7_5.decString().incString()).toStrictEqual(CMA7_5);
});

// Chord.incDegree / Chord.decDegree

test('Chord.incDegree', () => {
  expect(CMA7_5.incDegree()).toStrictEqual(DMI7_5);
});

test('Chord.decDegree', () => {
  expect(DMI7_5.decDegree()).toStrictEqual(CMA7_5);
});

test('Chord.decDegree invalid', () => {
  expect(AMI7_5.decDegree().isValid()).toBe(false);
});

test('Chord.decDegree temporarily invalid', () => {
  expect(AMI7_5.decDegree().incDegree()).toStrictEqual(AMI7_5);
});

// Chord.incInversion / Chord.decInversion

test('Chord.incInversion', () => {
  expect(GDOM7_0.incInversion()).toStrictEqual(GDOM7_1);
  expect(GDOM7_1.incInversion()).toStrictEqual(GDOM7_2);
  expect(GDOM7_2.incInversion()).toStrictEqual(GDOM7_3);
  expect(GDOM7_3.incInversion()).toStrictEqual(GDOM7_4);
});

test('Chord.decInversion', () => {
  expect(GDOM7_4.decInversion()).toStrictEqual(GDOM7_3);
  expect(GDOM7_3.decInversion()).toStrictEqual(GDOM7_2);
  expect(GDOM7_2.decInversion()).toStrictEqual(GDOM7_1);
  expect(GDOM7_1.decInversion()).toStrictEqual(GDOM7_0);
});

test('Chord.decInversion invalid', () => {
  expect(GDOM7_0.decInversion().isValid()).toBe(false);
});

test('Chord.decInversion temporarily invalid', () => {
  expect(GDOM7_0.decInversion().incInversion()).toStrictEqual(GDOM7_0);
});

// Chord.mark

test('Chord.mark one root', () => {
    expect(new Chord('C', 1).add(5, 3, 1).add(4, 5, 5).add(3, 4, 7).add(2, 5, 3).mark())
      .toBe(3);
});

test('Chord.mark two root', () => {
    expect(new Chord('C', 1).add(5, 3, 1).add(4, 5, 5).add(3, 5, 1).add(2, 5, 3).mark())
      .toBe(3);
});

test('Chord.mark no root', () => {
    expect(new Chord('C', 1).add(4, 5, 5).add(3, 4, 7).add(2, 5, 3).mark())
      .toBe(4);
});

// Chord.symbol

test('Chord.symbol ma', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).symbol())
    .toStrictEqual(new Symbol('B'));
});

test('Chord.symbol mi', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).symbol())
    .toStrictEqual(new Symbol('B', 'mi'));
});

test('Chord.symbol dim', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 3, 5).symbol())
    .toStrictEqual(new Symbol('B', 'dim'));
});

test('Chord.symbol aug', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 5, 5).symbol())
    .toStrictEqual(new Symbol('B', 'aug'));
});

test('Chord.symbol sus', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).symbol())
    .toStrictEqual(new Symbol('B', 'sus'));
});

test('Chord.symbol ma6', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 1, 6).symbol())
    .toStrictEqual(new Symbol('B', null, '6'));
});

test('Chord.symbol mi6', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 1, 6).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '6'));
});

test('Chord.symbol ma7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 3, 7).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '7'));
});

test('Chord.symbol ma9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 3, 7).add(2, 2, 2).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '9'));
});

test('Chord.symbol ma13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 3, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '13'));
});

test('Chord.symbol 7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 2, 7).symbol())
    .toStrictEqual(new Symbol('B', null, '7'));
});

test('Chord.symbol 9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toStrictEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol 13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toStrictEqual(new Symbol('B', null, '13'));
});

test('Chord.symbol sus7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).add(3, 2, 7).symbol())
    .toStrictEqual(new Symbol('B', 'sus', '7'));
});

test('Chord.symbol sus9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toStrictEqual(new Symbol('B', 'sus', '9'));
});

test('Chord.symbol sus13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toStrictEqual(new Symbol('B', 'sus', '13'));
});

test('Chord.symbol mi7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 2, 7).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '7'));
});

test('Chord.symbol mi9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '9'));
});

test('Chord.symbol mi13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '13'));
});

test('Chord.symbol ma7flat5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 3, 5).add(3, 3, 7).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '7♭5'));
});

test('Chord.symbol mi7flat5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 3, 5).add(3, 2, 7).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '7♭5'));
});

test('Chord.symbol ma7sharp5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 5, 5).add(3, 3, 7).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '7♯5'));
});

test('Chord.symbol mi7sharp5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 5, 5).add(3, 2, 7).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '7♯5'));
});

test('Chord.symbol dim7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 3, 5).add(3, 1, 7).symbol())
    .toStrictEqual(new Symbol('B', 'dim', '7'));
});

// Chord.symbol edge cases

test('Chord.symbol 7 flat root', () => {
  expect(new Chord('A', 2).add(6, 6, 1).add(5, 5, 3).add(4, 3, 5).add(3, 1, 7).symbol())
    .toStrictEqual(new Symbol('B♭', null, '7'));
});

test('Chord.symbol 7 sharp root', () => {
  expect(new Chord('A', 2).add(6, 8, 1).add(5, 7, 3).add(4, 5, 5).add(3, 3, 7).symbol())
    .toStrictEqual(new Symbol('B♯', null, '7'));
});

test('Chord.symbol offset underflow', () => {
  expect(new Chord('F', 1).add(4, 3, 1).add(3, 1, 3).add(2, 0, 5).symbol())
    .toStrictEqual(new Symbol('F', 'dim'));
});

test('Chord.symbol offset overflow', () => {
  expect(new Chord('E', 1).add(4, 2, 1).add(3, 1, 3).add(2, 1, 5).symbol())
    .toStrictEqual(new Symbol('E', 'aug'));
});

test('Chord.symbol omit 5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(3, 2, 7).add(2, 2, 2).symbol())
    .toStrictEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol omit 3', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toStrictEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol omit 3 omit 5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(3, 2, 7).add(2, 2, 2).symbol())
    .toStrictEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol unknown', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(6, 9, 2).symbol())
    .toStrictEqual(new Symbol('B', '?'));
});

// Chord.symbol of computed chords

test('Chord.symbol inc_degree', () => {
  expect(EMI7_5.symbol()).toStrictEqual(DMI7_5.incDegree().symbol());
});

test('Chord.symbol dec_degree', () => {
  expect(DMI7_5.symbol()).toStrictEqual(EMI7_5.decDegree().symbol());
});

test('Chord.symbol inc_string', () => {
  expect(CMA7_5.symbol()).toStrictEqual(CMA7_5.incString().symbol());
});

test('Chord.symbol dec_string', () => {
  expect(CMA7_6.symbol()).toStrictEqual(CMA7_6.decString().symbol());
});

test('Chord.symbol incInversion root', () => {
  expect(GDOM7_3.symbol().root).toBe(GDOM7_3.incInversion().symbol().root);
});

test('Chord.symbol incInversion triad', () => {
  expect(GDOM7_3.symbol().triad).toBe(GDOM7_3.incInversion().symbol().triad);
});

test('Chord.symbol incInversion extension', () => {
  expect(GDOM7_3.symbol().extension).toBe(GDOM7_3.incInversion().symbol().extension);
});

test('Chord.symbol incInversion bass', () => {
  expect(GDOM7_3.symbol().bass).not.toBe(GDOM7_3.incInversion().symbol().bass);
});

test('Chord.symbol decInversion root', () => {
  expect(GDOM7_3.symbol().root).toBe(GDOM7_3.decInversion().symbol().root);
});

test('Chord.symbol decInversion triad', () => {
  expect(GDOM7_3.symbol().triad).toBe(GDOM7_3.decInversion().symbol().triad);
});

test('Chord.symbol decInversion extension', () => {
  expect(GDOM7_3.symbol().extension).toBe(GDOM7_3.decInversion().symbol().extension);
});

test('Chord.symbol decInversion bass', () => {
  expect(GDOM7_3.symbol().bass).not.toBe(GDOM7_3.decInversion().symbol().bass);
});

// Chord.bass

test('Chord.bass', () => {
  expect(new Chord('C', 1).add(3, 5, 1).add(2, 5, 3).add(1, 3, 5).add(4, 5, 5, '+', true).bass())
    .toBe('G');
});

test('Chord.bass sharpened', () => {
  expect(new Chord('C', 1).add(3, 5, 1).add(2, 5, 3).add(1, 3, 5).add(4, 6, 5, '+', true).bass())
    .toBe('G♯');
});

test('Chord.bass flattened', () => {
  expect(new Chord('C', 1).add(3, 5, 1).add(2, 5, 3).add(1, 3, 5).add(4, 4, 5, '+', true).bass())
    .toBe('G♭');
});

test('Chord.bass root position', () => {
  expect(GDOM7_2.bass()).toBeNull();
});

test('Chord.bass 1st inversion', () => {
  expect(GDOM7_3.bass()).toBe('B');
});

test('Chord.bass 2st inversion', () => {
  expect(GDOM7_4.bass()).toBe('D');
});

test('Chord.bass 3st inversion', () => {
  expect(GDOM7_5.bass()).toBe('F');
});

test('Chord.bass no stops', () => {
  expect(new Chord('C', 1).bass()).toBe(null);
});

// Chord.toElement

test('Chord.toElement has grid span', () => {
  const element = CMA7_5.toElement('span');
  expect(element.localName).toBe('span');
  expect(element.className).toBe('grid');
  expect(element.childElementCount).toBe(1);
});

test('Chord.toElement grid has column span', () => {
  const column = CMA7_5.toElement('span').children[0];
  expect(column.localName).toBe('span');
  expect(column.className).toBe('column');
  expect(column.childElementCount).toBe(2);
});

test('Chord.toElement column has symbol span', () => {
  const symbol = CMA7_5.toElement('span').children[0].children[0];
  expect(symbol.localName).toBe('span');
  expect(symbol.className).toBe('symbol');
});

test('Chord.toElement column has svg', () => {
  const svg = CMA7_5.toElement('span').children[0].children[1];
  expect(svg.localName).toBe('svg');
});

test('Chord.toElement (with note) has column span', () => {
  const column = CMA7_5.setNote('hello').toElement('span').children[0];
  expect(column.localName).toBe('span');
  expect(column.className).toBe('column');
  expect(column.childElementCount).toBe(3);
});

test('Chord.toElement (with note) column has note span', () => {
  const note = CMA7_5.setNote('hello').toElement('span').children[0].children[2];
  expect(note.localName).toBe('span');
  expect(note.className).toBe('note');
});

// Optional.toElement

test('Optional.toElement has grid span', () => {
  const element = new Optional('C', 1).add(5, 3, 1).toElement('span');
  expect(element.localName).toBe('span');
  expect(element.className).toBe('grid');
  expect(element.childElementCount).toBe(1);
});

// alignMarks / alignFrets

test('alignMarks default size', () => {
  const chords = alignMarks([CMA7_5, DMI7_5, EMI7_5], 0);

  expect(chords[0].mark() - chords[0].gridMin).toBe(chords[1].mark() - chords[1].gridMin);
  expect(chords[0].gridMax - chords[0].mark()).toBe(chords[1].gridMax - chords[1].mark());

  expect(chords[0].gridMax - chords[0].gridMin).toBe(3);
  expect(chords[1].gridMax - chords[1].gridMin).toBe(3);
});

test('alignMarks', () => {
  const chords = alignMarks([CMA7_5, DMI7_5, EMI7_5], 5);

  expect(chords[0].mark() - chords[0].gridMin).toBe(chords[1].mark() - chords[1].gridMin);
  expect(chords[0].gridMax - chords[0].mark()).toBe(chords[1].gridMax - chords[1].mark());

  expect(chords[0].gridMax - chords[0].gridMin).toBe(5);
  expect(chords[1].gridMax - chords[1].gridMin).toBe(5);
});

test('alignFrets default size', () => {
  const chords = alignFrets([CMA7_5, DMI7_5, EMI7_5], 0);

  expect(chords[0].gridMin).toBe(chords[1].gridMin);
  expect(chords[1].gridMin).toBe(chords[2].gridMin);
  expect(chords[0].gridMax).toBe(chords[1].gridMax);
  expect(chords[1].gridMax).toBe(chords[2].gridMax);
});

test('alignFrets', () => {
  const chords = alignFrets([CMA7_5, DMI7_5, EMI7_5], 5);

  expect(chords[0].gridMin).toBe(chords[1].gridMin);
  expect(chords[1].gridMin).toBe(chords[2].gridMin);
  expect(chords[0].gridMax).toBe(chords[1].gridMax);
  expect(chords[1].gridMax).toBe(chords[2].gridMax);
});
