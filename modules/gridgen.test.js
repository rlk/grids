import { flatten, sharpen, Stop, Symbol, Chord, Sequence } from './gridgen.js';

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

// Symbol.toString

test('Symbol.constructor', () => {
  const symbol = new Symbol('A', 'mi', '7');
  expect(symbol.root).toBe('A');
  expect(symbol.triad).toBe('mi');
  expect(symbol.extension).toBe('7');
});

test('Symbol.constructor default extension', () => {
  const symbol = new Symbol('A', 'mi');
  expect(symbol.root).toBe('A');
  expect(symbol.triad).toBe('mi');
  expect(symbol.extension).toBe('');
});

test('Symbol.constructor default triad', () => {
  const symbol = new Symbol('A');
  expect(symbol.root).toBe('A');
  expect(symbol.triad).toBe('');
  expect(symbol.extension).toBe('');
});

test('Symbol.toString', () => {
  expect(new Symbol('A', 'mi', '7').toString()).toBe("n:Ami e:7");
});

test('Symbol.toString default extension', () => {
  expect(new Symbol('A', 'mi').toString()).toBe("n:Ami");
});

test('Symbol.toString default triad', () => {
  expect(new Symbol('A').toString()).toBe("n:A");
});

// Chord.toString

test('Chord.toString', () => {
  const string = CMA7_5.toString();
  expect(string).toMatch(/\+:2:5 \+:3:4 \+:4:5 \+:5:3/);
  expect(string).toMatch(/_:1:3 _:6:5/);
  expect(string).toMatch(/n:Cma e:7/);
  expect(string).toMatch(/F:3/);
})

test('Chord.toString no mark', () => {
  const string = AMI7_5.toString();
  expect(string).toMatch(/\+:2:1 \+:3:0 \+:4:2 \+:5:0/);
  expect(string).toMatch(/_:1:0 _:6:2/);
  expect(string).toMatch(/n:Ami e:7/);
  expect(string).not.toMatch(/F:/);
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

// Builders

test('Chord.add', () => {
  expect(new Chord('C', 5).add([4, 5, 1], [3, 7, 5], [2, 6, 7], [1, 7, 3]))
    .toStrictEqual(
      new Chord('C', 5, [
        new Stop(4, 5, 5, '+'),
        new Stop(3, 7, 2, '+'),
        new Stop(2, 6, 4, '+'),
        new Stop(1, 7, 7, '+')]));
})

test('Chord.addx', () => {
  expect(new Chord('C', 5).addx([4, 5, 1]))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, 'x')]));
})

test('Chord.adds', () => {
  expect(new Chord('C', 5).adds([4, 5, 1]))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, 's')]));
})

test('Chord.addd', () => {
  expect(new Chord('C', 5).addd([4, 5, 1]))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, 'd')]));
})

test('Chord.addo', () => {
  expect(new Chord('C', 5).addo([4, 5, 1]))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, 'o')]));
})

test('Chord.add_', () => {
  expect(new Chord('C', 5).add_([4, 5, 1]))
    .toStrictEqual(new Chord('C', 5, [new Stop(4, 5, 5, '_')]));
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
    expect(new Chord('C', 1).add([5, 3, 1], [4, 5, 5], [3, 4, 7], [2, 5, 3]).mark())
      .toBe(3);
});

test('Chord.mark two root', () => {
    expect(new Chord('C', 1).add([5, 3, 1], [4, 5, 5], [3, 5, 1], [2, 5, 3]).mark())
      .toBe(3);
});

test('Chord.mark no root', () => {
    expect(new Chord('C', 1).add([4, 5, 5], [3, 4, 7], [2, 5, 3]).mark())
      .toBe(4);
});

// Chord.symbol

test('Chord.symbol ma', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5]).symbol())
    .toStrictEqual(new Symbol('B'));
});

test('Chord.symbol mi', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5]).symbol())
    .toStrictEqual(new Symbol('B', 'mi'));
});

test('Chord.symbol dim', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 3, 5]).symbol())
    .toStrictEqual(new Symbol('B', 'dim'));
});

test('Chord.symbol aug', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 5, 5]).symbol())
    .toStrictEqual(new Symbol('B', 'aug'));
});

test('Chord.symbol sus', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5]).symbol())
    .toStrictEqual(new Symbol('B', 'sus'));
});

test('Chord.symbol ma6', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 1, 6]).symbol())
    .toStrictEqual(new Symbol('B', '', '6'));
});

test('Chord.symbol mi6', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 1, 6]).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '6'));
});

test('Chord.symbol ma7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 3, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '7'));
});

test('Chord.symbol ma9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 3, 7], [2, 2, 2]).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '9'));
});

test('Chord.symbol ma13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 3, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '13'));
});

test('Chord.symbol 7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 2, 7]).symbol())
    .toStrictEqual(new Symbol('B', '', '7'));
});

test('Chord.symbol 9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2]).symbol())
    .toStrictEqual(new Symbol('B', '', '9'));
});

test('Chord.symbol 13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual(new Symbol('B', '', '13'));
});

test('Chord.symbol sus7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5], [3, 2, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'sus', '7'));
});

test('Chord.symbol sus9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5], [3, 2, 7], [2, 2, 2]).symbol())
    .toStrictEqual(new Symbol('B', 'sus', '9'));
});

test('Chord.symbol sus13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5], [3, 2, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual(new Symbol('B', 'sus', '13'));
});

test('Chord.symbol mi7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 2, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '7'));
});

test('Chord.symbol mi9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2]).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '9'));
});

test('Chord.symbol mi13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '13'));
});

test('Chord.symbol ma7flat5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 3, 5], [3, 3, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '7♭5'));
});

test('Chord.symbol mi7flat5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 3, 5], [3, 2, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '7♭5'));
});

test('Chord.symbol ma7sharp5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 5, 5], [3, 3, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'ma', '7♯5'));
});

test('Chord.symbol mi7sharp5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 5, 5], [3, 2, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'mi', '7♯5'));
});

test('Chord.symbol dim7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 3, 5], [3, 1, 7]).symbol())
    .toStrictEqual(new Symbol('B', 'dim', '7'));
});

// Chord.symbol edge cases

test('Chord.symbol 7 flat root', () => {
  expect(new Chord('A', 2).add([6, 6, 1], [5, 5, 3], [4, 3, 5], [3, 1, 7]).symbol())
    .toStrictEqual(new Symbol('B♭', '', '7'));
});

test('Chord.symbol 7 sharp root', () => {
  expect(new Chord('A', 2).add([6, 8, 1], [5, 7, 3], [4, 5, 5], [3, 3, 7]).symbol())
    .toStrictEqual(new Symbol('B♯', '', '7'));
});

test('Chord.symbol offset underflow', () => {
  expect(new Chord('F', 1).add([4, 3, 1], [3, 1, 3], [2, 0, 5]).symbol())
    .toStrictEqual(new Symbol('F', 'dim'));
});

test('Chord.symbol offset overflow', () => {
  expect(new Chord('E', 1).add([4, 2, 1], [3, 1, 3], [2, 1, 5]).symbol())
    .toStrictEqual(new Symbol('E', 'aug'));
});

test('Chord.symbol unknown', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [6, 9, 2]).symbol())
    .toStrictEqual(new Symbol('B', '?', '?'));
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

test('Chord.symbol inc_inversion', () => {
  expect(GDOM7_1.symbol()).toStrictEqual(GDOM7_1.incInversion().symbol());
});

test('Chord.symbol dec_inversion', () => {
  expect(GDOM7_3.symbol()).toStrictEqual(GDOM7_3.decInversion().symbol());
});

// Sequence

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
