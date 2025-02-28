import { flatten, sharpen, Stop } from './gridgen.js';

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

test('sharpen to flat', () => {
    expect(sharpen('A')).toBe('A♯');
});

test('sharpen to double sharp', () => {
    expect(sharpen('A♯')).toBe('A𝄪');
});

test('sharpen to natural', () => {
    expect(sharpen('A♭')).toBe('A');
});

// Stop.isValid

test('isValid', () => {
    expect(new Stop(1, 1, 1, '+').isValid()).toBe(true);
});

test('isValid string low', () => {
    expect(new Stop(0, 1, 1, '+').isValid()).toBe(false);
});

test('isValid string high', () => {
    expect(new Stop(7, 1, 1, '+').isValid()).toBe(false);
});

test('isValid fret low', () => {
    expect(new Stop(1, -1, 1, '+').isValid()).toBe(false);
});

test('isValid degree low', () => {
    expect(new Stop(1, 1, 0, '+').isValid()).toBe(false);
});

test('isValid degree high', () => {
    expect(new Stop(1, 1, 8, '+').isValid()).toBe(false);
});
