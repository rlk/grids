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
import { Chord, alignFrets, alignMarks } from './chord.js';
import { Options } from './options.js';
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
const CMA7_5_15 = new Chord('C', 1, [  // Cma7 with the root on string 5 fret 15
  new Stop(5, 15, 1),
  new Stop(4, 17, 5),
  new Stop(3, 16, 7),
  new Stop(2, 17, 3),
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

const CMA7_TEXT = new Chord('C', 1, [  // Cma7 with text annotation
  new Stop(5, 3, 1),
  new Stop(4, 5, 5),
  new Stop(3, 4, 7),
  new Stop(2, 5, 3),
], new Options().setText('abc'));

// Chord setters

test('Chord.setDegree', () => {
  expect(new Chord().setDegree(2).degree).toEqual(2);
});

test('Chord.setStops', () => {
  expect(new Chord().setStops([new Stop(5, 3, 1)]).stops[0].string).toBe(5);
});

test('Chord.setOptions', () => {
  expect(new Chord().setOptions(new Options().setNoSymbol(true)).options.nosymbol).toBe(true);
});

// Chord.copy

test('Chord.copy', () => {
  expect(CMA7_5.copy()).toEqual(CMA7_5);
});

// Chord builders

test('Chord.add', () => {
  expect(new Chord('C', 5).add(4, 5, 1, 'x', true))
    .toEqual(new Chord('C', 5, [new Stop(4, 5, 5, 'x', true)]));
})

test('Chord.add default decor', () => {
  expect(new Chord('C', 5).add(4, 5, 1, 'x'))
    .toEqual(new Chord('C', 5, [new Stop(4, 5, 5, 'x', false)]));
})

test('Chord.add default label', () => {
  expect(new Chord('C', 5).add(4, 5, 1))
    .toEqual(new Chord('C', 5, [new Stop(4, 5, 5, '+', false)]));
})

test('Chord.add multiple', () => {
  expect(new Chord('C', 5).add(4, 5, 1).add(3, 7, 5).add(2, 6, 7).add(1, 7, 3))
    .toEqual(
      new Chord('C', 5, [
        new Stop(4, 5, 5, '+'),
        new Stop(3, 7, 2, '+'),
        new Stop(2, 6, 4, '+'),
        new Stop(1, 7, 7, '+')]));
})

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

// Chord.incString / Chord.decString

test('Chord.incString', () => {
  expect(CMA7_5.incString()).toEqual(CMA7_6);
});

test('Chord.decString', () => {
  expect(CMA7_6.decString()).toEqual(CMA7_5);
});

test('Chord.incString invalid', () => {
  expect(CMA7_6.incString().isValid()).toBe(false);
});

test('Chord.incString temporarily invalid', () => {
  expect(CMA7_6.incString().decString()).toEqual(CMA7_6);
});

test('Chord.decString invalid', () => {
  expect(CMA7_5.decString().isValid()).toBe(false);
});

test('Chord.decString temporarily invalid', () => {
  expect(CMA7_5.decString().incString()).toEqual(CMA7_5);
});

// Chord.incDegree / Chord.decDegree

test('Chord.incDegree', () => {
  expect(CMA7_5.incDegree()).toEqual(DMI7_5);
});

test('Chord.decDegree', () => {
  expect(DMI7_5.decDegree()).toEqual(CMA7_5);
});

test('Chord.decDegree invalid', () => {
  expect(AMI7_5.decDegree().isValid()).toBe(false);
});

test('Chord.decDegree temporarily invalid', () => {
  expect(AMI7_5.decDegree().incDegree()).toEqual(AMI7_5);
});

// Chord.incInversion / Chord.decInversion

test('Chord.incInversion', () => {
  expect(GDOM7_0.incInversion()).toEqual(GDOM7_1);
  expect(GDOM7_1.incInversion()).toEqual(GDOM7_2);
  expect(GDOM7_2.incInversion()).toEqual(GDOM7_3);
  expect(GDOM7_3.incInversion()).toEqual(GDOM7_4);
});

test('Chord.decInversion', () => {
  expect(GDOM7_4.decInversion()).toEqual(GDOM7_3);
  expect(GDOM7_3.decInversion()).toEqual(GDOM7_2);
  expect(GDOM7_2.decInversion()).toEqual(GDOM7_1);
  expect(GDOM7_1.decInversion()).toEqual(GDOM7_0);
});

test('Chord.decInversion invalid', () => {
  expect(GDOM7_0.decInversion().isValid()).toBe(false);
});

test('Chord.decInversion temporarily invalid', () => {
  expect(GDOM7_0.decInversion().incInversion()).toEqual(GDOM7_0);
});

// Chord.incOctave / Chord.decOctave

test('Chord.incOctave', () => {
  expect(CMA7_5.incOctave()).toEqual(CMA7_5_15);
});

test('Chord.decOctave', () => {
  expect(CMA7_5_15.decOctave()).toEqual(CMA7_5);
});

test('Chord.decOctave invalid', () => {
  expect(CMA7_5.decOctave().isValid()).toBe(false);
});

test('Chord.decOctave temporarily invalid', () => {
  expect(CMA7_5.decOctave().incOctave()).toEqual(CMA7_5);
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
    .toEqual(new Symbol('B'));
});

test('Chord.symbol mi', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).symbol())
    .toEqual(new Symbol('B', 'mi'));
});

test('Chord.symbol dim', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 3, 5).symbol())
    .toEqual(new Symbol('B', 'dim'));
});

test('Chord.symbol aug', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 5, 5).symbol())
    .toEqual(new Symbol('B', 'aug'));
});

test('Chord.symbol sus', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).symbol())
    .toEqual(new Symbol('B', 'sus'));
});

test('Chord.symbol ma6', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 1, 6).symbol())
    .toEqual(new Symbol('B', null, '6'));
});

test('Chord.symbol mi6', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 1, 6).symbol())
    .toEqual(new Symbol('B', 'mi', '6'));
});

test('Chord.symbol ma7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 3, 7).symbol())
    .toEqual(new Symbol('B', 'ma', '7'));
});

test('Chord.symbol ma9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 3, 7).add(2, 2, 2).symbol())
    .toEqual(new Symbol('B', 'ma', '9'));
});

test('Chord.symbol ma13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 3, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toEqual(new Symbol('B', 'ma', '13'));
});

test('Chord.symbol 7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 2, 7).symbol())
    .toEqual(new Symbol('B', null, '7'));
});

test('Chord.symbol 9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol 13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toEqual(new Symbol('B', null, '13'));
});

test('Chord.symbol sus7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).add(3, 2, 7).symbol())
    .toEqual(new Symbol('B', 'sus', '7'));
});

test('Chord.symbol sus9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toEqual(new Symbol('B', 'sus', '9'));
});

test('Chord.symbol sus13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 7, 4).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toEqual(new Symbol('B', 'sus', '13'));
});

test('Chord.symbol mi7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 2, 7).symbol())
    .toEqual(new Symbol('B', 'mi', '7'));
});

test('Chord.symbol mi9', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toEqual(new Symbol('B', 'mi', '9'));
});

test('Chord.symbol mi13', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).add(1, 4, 6).symbol())
    .toEqual(new Symbol('B', 'mi', '13'));
});

test('Chord.symbol ma7flat5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 3, 5).add(3, 3, 7).symbol())
    .toEqual(new Symbol('B', 'ma', '7♭5'));
});

test('Chord.symbol mi7flat5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 3, 5).add(3, 2, 7).symbol())
    .toEqual(new Symbol('B', 'mi', '7♭5'));
});

test('Chord.symbol ma7sharp5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(4, 5, 5).add(3, 3, 7).symbol())
    .toEqual(new Symbol('B', 'ma', '7♯5'));
});

test('Chord.symbol mi7sharp5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 5, 5).add(3, 2, 7).symbol())
    .toEqual(new Symbol('B', 'mi', '7♯5'));
});

test('Chord.symbol dim7', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 5, 3).add(4, 3, 5).add(3, 1, 7).symbol())
    .toEqual(new Symbol('B', 'dim', '7'));
});

// Chord.symbol edge cases

test('Chord.symbol 7 flat root', () => {
  expect(new Chord('A', 2).add(6, 6, 1).add(5, 5, 3).add(4, 3, 5).add(3, 1, 7).symbol())
    .toEqual(new Symbol('B♭', null, '7'));
});

test('Chord.symbol 7 sharp root', () => {
  expect(new Chord('A', 2).add(6, 8, 1).add(5, 7, 3).add(4, 5, 5).add(3, 3, 7).symbol())
    .toEqual(new Symbol('B♯', null, '7'));
});

test('Chord.symbol offset underflow', () => {
  expect(new Chord('F', 1).add(4, 3, 1).add(3, 1, 3).add(2, 0, 5).symbol())
    .toEqual(new Symbol('F', 'dim'));
});

test('Chord.symbol offset overflow', () => {
  expect(new Chord('E', 1).add(4, 2, 1).add(3, 1, 3).add(2, 1, 5).symbol())
    .toEqual(new Symbol('E', 'aug'));
});

test('Chord.symbol omit 5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(5, 6, 3).add(3, 2, 7).add(2, 2, 2).symbol())
    .toEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol omit 3', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(4, 4, 5).add(3, 2, 7).add(2, 2, 2).symbol())
    .toEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol omit 3 omit 5', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(3, 2, 7).add(2, 2, 2).symbol())
    .toEqual(new Symbol('B', null, '9'));
});

test('Chord.symbol unknown', () => {
  expect(new Chord('A', 2).add(6, 7, 1).add(6, 8, 2).symbol())
    .toEqual(new Symbol('B', '?'));
});

// Chord.symbol of computed chords

test('Chord.symbol incDegree', () => {
  expect(DMI7_5.incDegree().symbol()).toEqual(EMI7_5.symbol());
});

test('Chord.symbol decDegree', () => {
  expect(EMI7_5.decDegree().symbol()).toEqual(DMI7_5.symbol());
});

test('Chord.symbol incString', () => {
  expect(CMA7_5.incString().symbol()).toEqual(CMA7_5.symbol());
});

test('Chord.symbol decString', () => {
  expect(CMA7_6.decString().symbol()).toEqual(CMA7_6.symbol());
});

test('Chord.symbol incInversion root', () => {
  expect(GDOM7_3.incInversion().symbol().root).toBe(GDOM7_3.symbol().root);
});

test('Chord.symbol incInversion triad', () => {
  expect(GDOM7_3.incInversion().symbol().triad).toBe(GDOM7_3.symbol().triad);
});

test('Chord.symbol incInversion extension', () => {
  expect(GDOM7_3.incInversion().symbol().extension).toBe(GDOM7_3.symbol().extension);
});

test('Chord.symbol incInversion bass', () => {
  expect(GDOM7_3.incInversion().symbol().bass).not.toBe(GDOM7_3.symbol().bass);
});

test('Chord.symbol decInversion root', () => {
  expect(GDOM7_3.decInversion().symbol().root).toBe(GDOM7_3.symbol().root);
});

test('Chord.symbol decInversion triad', () => {
  expect(GDOM7_3.decInversion().symbol().triad).toBe(GDOM7_3.symbol().triad);
});

test('Chord.symbol decInversion extension', () => {
  expect(GDOM7_3.decInversion().symbol().extension).toBe(GDOM7_3.symbol().extension);
});

test('Chord.symbol decInversion bass', () => {
  expect(GDOM7_3.decInversion().symbol().bass).not.toBe(GDOM7_3.symbol().bass);
});

test('Chord.symbol incOctave', () => {
  expect(CMA7_5.incOctave().symbol()).toEqual(CMA7_5.symbol());
});

test('Chord.symbol decOctave', () => {
  expect(CMA7_5.decOctave().symbol()).toEqual(CMA7_5.symbol());
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

test('Chord.toElement has grid class', () => {
  const element = CMA7_5.toElement('foo');
  expect(element.localName).toBe('foo');
  expect(element.classList.contains('grid')).toBe(true);
});

test('Chord.toElement has two children', () => {
  const element = CMA7_5.toElement('foo');
  expect(element.localName).toBe('foo');
  expect(element.childElementCount).toBe(2);
});

test('Chord.toElement with text has three children', () => {
  const element = CMA7_TEXT.toElement('foo');
  expect(element.localName).toBe('foo');
  expect(element.childElementCount).toBe(3);
});

test('Chord.toElement has symbol span', () => {
  const symbol = CMA7_5.toElement().children[0];
  expect(symbol.localName).toBe('span');
  expect(symbol.className).toBe('symbol');
});

test('Chord.toElement has svg', () => {
  const svg = CMA7_5.toElement().children[1];
  expect(svg.localName).toBe('svg');
});

test('Chord.toElement with text has text span', () => {
  const text = CMA7_TEXT.toElement().children[2];
  expect(text.localName).toBe('span');
  expect(text.className).toBe('text');
});

// Chord.toString

test('Chord.toString', () => {
  const string = new Chord('C', 1, [new Stop(1, 1, 1)]).toString();
  expect(string).toContain('C');
  expect(string).toContain('1 1 1 +');
  expect(string).toContain('<>');
});

test('Chord.toString with Options', () => {
  const string = new Chord('C', 1, [new Stop(1, 1, 1)], new Options().setText('abc')).toString();
  expect(string).toContain('C');
  expect(string).toContain('1 1 1 +');
  expect(string).toContain('abc');
});

// alignMarks / alignFrets

test('alignMarks default size', () => {
  const chords = [CMA7_5, DMI7_5, EMI7_5];

  alignMarks(chords, 0);

  expect(chords[0].mark() - chords[0].options.gridMin).toBe(chords[1].mark() - chords[1].options.gridMin);
  expect(chords[0].options.gridMax - chords[0].mark()).toBe(chords[1].options.gridMax - chords[1].mark());

  expect(chords[0].options.gridMax - chords[0].options.gridMin).toBe(3);
  expect(chords[1].options.gridMax - chords[1].options.gridMin).toBe(3);
});

test('alignMarks', () => {
  const chords = [CMA7_5, DMI7_5, EMI7_5];

  alignMarks(chords, 5);

  expect(chords[0].mark() - chords[0].options.gridMin).toBe(chords[1].mark() - chords[1].options.gridMin);
  expect(chords[0].options.gridMax - chords[0].mark()).toBe(chords[1].options.gridMax - chords[1].mark());

  expect(chords[0].options.gridMax - chords[0].options.gridMin).toBe(5);
  expect(chords[1].options.gridMax - chords[1].options.gridMin).toBe(5);
});

test('alignFrets default size', () => {
  const chords = [CMA7_5, DMI7_5, EMI7_5];

  alignFrets(chords, 0);

  expect(chords[0].options.gridMin).toBe(chords[1].options.gridMin);
  expect(chords[1].options.gridMin).toBe(chords[2].options.gridMin);
  expect(chords[0].options.gridMax).toBe(chords[1].options.gridMax);
  expect(chords[1].options.gridMax).toBe(chords[2].options.gridMax);
});

test('alignFrets', () => {
  const chords = [CMA7_5, DMI7_5, EMI7_5];

  alignFrets(chords, 5);

  expect(chords[0].options.gridMin).toBe(chords[1].options.gridMin);
  expect(chords[1].options.gridMin).toBe(chords[2].options.gridMin);
  expect(chords[0].options.gridMax).toBe(chords[1].options.gridMax);
  expect(chords[1].options.gridMax).toBe(chords[2].options.gridMax);
});
