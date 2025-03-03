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

const pitchIncAtDegree = {
  1: 2, 2: 2, 3: 1, 4: 2, 5: 2, 6: 2, 7: 1,
};
const pitchDecAtDegree = {
  1: 1, 2: 2, 3: 2, 4: 1, 5: 2, 6: 2, 7: 2,
};
const pitchOfString = {
  1: 5, 2: 12, 3: 8, 4: 3, 5: 10, 6: 5,
};

function _degree(degree) {
  if (degree < 1) {
    return _degree(degree + 7);
  }
  if (degree > 7) {
    return _degree(degree - 7);
  }
  return degree;
}

function _pitch(pitch) {
  if (pitch < 1) {
    return _pitch(pitch + 12);
  }
  if (pitch > 12) {
    return _pitch(pitch - 12);
  }
  return pitch;
}

export class Stop {
  constructor(string, fret, degree, label = '+') {
    this.string = string;
    this.fret = fret;
    this.degree = degree;
    this.label = label;
  }

  toString() {
    return `${this.label}:${this.string}:${this.fret}`;
  }

  isValid() {
    return "+xsdo_".includes(this.label)
      && this.string >= 1
      && this.string <= 6
      && this.fret >= 0
      && this.degree >= 1
      && this.degree <= 7;
  }

  pitch() {
    return _pitch(pitchOfString[this.string] + this.fret);
  }

  interval(root) {
    return _degree(this.degree - root + 1);
  }

  incString() {
    return new Stop(this.string + 1, this.string == 2 ? this.fret + 4 : this.fret + 5, this.degree, this.label)
  }

  decString() {
    return new Stop(this.string - 1, this.string == 3 ? this.fret - 4 : this.fret - 5, this.degree, this.label)
  }

  incDegree() {
    return new Stop(this.string, this.fret + pitchIncAtDegree[this.degree], _degree(this.degree + 1), this.label)
  }

  decDegree() {
    return new Stop(this.string, this.fret - pitchDecAtDegree[this.degree], _degree(this.degree - 1), this.label)
  }

  incToDegree(degree) {
    return this.degree == degree ? this : this.incDegree().incToDegree(degree);
  }

  decToDegree(degree) {
    return this.degree == degree ? this : this.decDegree().decToDegree(degree);
  }
}
