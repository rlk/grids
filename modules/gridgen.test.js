import { flatten, sharpen, Stop, Chord } from './gridgen.js';

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

// Chord.toString

test('Chord.toString', () => {
  expect(CMA7_5.toString()).toMatch(/\+:2:5 \+:3:4 \+:4:5 \+:5:3/)
})

// Chord.isValid

test('Chord.isValid', () => {
  expect(new Chord('C', 1, [new Stop(1, 1, 1)]).isValid()).toBe(true)
})

test('Chord.isValid bad stop', () => {
  expect(new Chord('C', 1, [new Stop(0, 1, 1)]).isValid()).toBe(false)
})

test('Chord.isValid degree low', () => {
  expect(new Chord('C', 0, [new Stop(1, 1, 1)]).isValid()).toBe(false)
})

test('Chord.isValid degree high', () => {
  expect(new Chord('C', 8, [new Stop(1, 1, 1)]).isValid()).toBe(false)
})

test('Chord.isValid bad key', () => {
  expect(new Chord('X', 1, [new Stop(1, 1, 1)]).isValid()).toBe(false)
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

// Chord.symbol

test('Chord.symbol_ma', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5]).symbol())
    .toStrictEqual({root: 'B', triad: '', extension: ''});
});

test('Chord.symbol_mi', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5]).symbol())
    .toStrictEqual({root: 'B', triad: 'mi', extension: ''});
});

test('Chord.symbol_dim', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 3, 5]).symbol())
    .toStrictEqual({root: 'B', triad: 'dim', extension: ''});
});

test('Chord.symbol_aug', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 5, 5]).symbol())
    .toStrictEqual({root: 'B', triad: 'aug', extension: ''});
});

test('Chord.symbol_sus', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5]).symbol())
    .toStrictEqual({root: 'B', triad: 'sus', extension: ''});
});

test('Chord.symbol_ma6', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 1, 6]).symbol())
    .toStrictEqual({root: 'B', triad: '', extension: '6'});
});

test('Chord.symbol_mi6', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 1, 6]).symbol())
    .toStrictEqual({root: 'B', triad: 'mi', extension: '6'});
});

test('Chord.symbol_ma7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 3, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'ma', extension: '7'});
});

test('Chord.symbol_ma9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 3, 7], [2, 2, 2]).symbol())
    .toStrictEqual({root: 'B', triad: 'ma', extension: '9'});
});

test('Chord.symbol_ma13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 3, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual({root: 'B', triad: 'ma', extension: '13'});
});

test('Chord.symbol_7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 2, 7]).symbol())
    .toStrictEqual({root: 'B', triad: '', extension: '7'});
});

test('Chord.symbol_9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2]).symbol())
    .toStrictEqual({root: 'B', triad: '', extension: '9'});
});

test('Chord.symbol_13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual({root: 'B', triad: '', extension: '13'});
});

test('Chord.symbol_sus7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5], [3, 2, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'sus', extension: '7'});
});

test('Chord.symbol_sus9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5], [3, 2, 7], [2, 2, 2]).symbol())
    .toStrictEqual({root: 'B', triad: 'sus', extension: '9'});
});

test('Chord.symbol_sus13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 7, 4], [4, 4, 5], [3, 2, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual({root: 'B', triad: 'sus', extension: '13'});
});

test('Chord.symbol_mi7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 2, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'mi', extension: '7'});
});

test('Chord.symbol_mi9', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2]).symbol())
    .toStrictEqual({root: 'B', triad: 'mi', extension: '9'});
});

test('Chord.symbol_mi13', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 4, 5], [3, 2, 7], [2, 2, 2], [1, 4, 6]).symbol())
    .toStrictEqual({root: 'B', triad: 'mi', extension: '13'});
});

test('Chord.symbol_ma7flat5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 3, 5], [3, 3, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'ma', extension: '7♭5'});
});

test('Chord.symbol_mi7flat5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 3, 5], [3, 2, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'mi', extension: '7♭5'});
});

test('Chord.symbol_ma7sharp5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 6, 3], [4, 5, 5], [3, 3, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'ma', extension: '7♯5'});
});

test('Chord.symbol_mi7sharp5', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 5, 5], [3, 2, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'mi', extension: '7♯5'});
});

test('Chord.symbol_dim7', () => {
  expect(new Chord('A', 2).add([6, 7, 1], [5, 5, 3], [4, 3, 5], [3, 1, 7]).symbol())
    .toStrictEqual({root: 'B', triad: 'dim', extension: '7'});
});

// Chord.symbol edge cases

test('Chord.symbol_7_flat_root', () => {
  expect(new Chord('A', 2).add([6, 6, 1], [5, 5, 3], [4, 3, 5], [3, 1, 7]).symbol())
    .toStrictEqual({root: 'B♭', triad: '', extension: '7'});
});

test('Chord.symbol_7_sharp_root', () => {
  expect(new Chord('A', 2).add([6, 8, 1], [5, 7, 3], [4, 5, 5], [3, 3, 7]).symbol())
    .toStrictEqual({root: 'B♯', triad: '', extension: '7'});
});

test('Chord.symbol_offset_underflow', () => {
  expect(new Chord('F', 1).add([4, 3, 1], [3, 1, 3], [2, 0, 5]).symbol())
    .toStrictEqual({root: 'F', triad: 'dim', extension: ''});
});

test('Chord.symbol_offset_overflow', () => {
  expect(new Chord('E', 1).add([4, 2, 1], [3, 1, 3], [2, 1, 5]).symbol())
    .toStrictEqual({root: 'E', triad: 'aug', extension: ''});
});

// Chord.symbol of computed chords

test('Chord.symbol_inc_degree', () => {
  expect(EMI7_5.symbol()).toStrictEqual(DMI7_5.incDegree().symbol());
});

test('Chord.symbol_dec_degree', () => {
  expect(DMI7_5.symbol()).toStrictEqual(EMI7_5.decDegree().symbol());
});

test('Chord.symbol_inc_string', () => {
  expect(CMA7_5.symbol()).toStrictEqual(CMA7_5.incString().symbol());
});

test('Chord.symbol_dec_string', () => {
  expect(CMA7_6.symbol()).toStrictEqual(CMA7_6.decString().symbol());
});

test('Chord.symbol_inc_inversion', () => {
  expect(GDOM7_1.symbol()).toStrictEqual(GDOM7_1.incInversion().symbol());
});

test('Chord.symbol_dec_inversion', () => {
  expect(GDOM7_3.symbol()).toStrictEqual(GDOM7_3.decInversion().symbol());
});
