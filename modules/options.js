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

export class Options {
  constructor() {
    this.text = null
    this.fingers = {}
    this.nosymbol = false
    this.optional = false
    this.gridMin = null
    this.gridMax = null
  }

  withText(text) {
    return Object.assign(new Options(), this, { text: text });
  }

  withFinger(string, finger) {
    return Object.assign(new Options(), this, { fingers: Object.assign({}, this.fingers, { [string]: finger }) });
  }

  withNoSymbol(nosymbol) {
    return Object.assign(new Options(), this, { nosymbol: nosymbol });
  }

  withOptional(optional) {
    return Object.assign(new Options(), this, { optional: optional });
  }

  withGridMin(gridMin) {
    return Object.assign(new Options(), this, { gridMin: gridMin });
  }

  withGridMax(gridMax) {
    return Object.assign(new Options(), this, { gridMax: gridMax });
  }

  toString() {
    var options = [];
    if (this.text) {
      options.push(`"${this.text}"`);
    }
    if (Object.keys(this.fingers).length > 0) {
      options.push(
        `${this.fingers[6] ?? 'x'}` +
        `${this.fingers[5] ?? 'x'}` +
        `${this.fingers[4] ?? 'x'}` +
        `${this.fingers[3] ?? 'x'}` +
        `${this.fingers[2] ?? 'x'}` +
        `${this.fingers[1] ?? 'x'}`
      );
    }
    if (this.nosymbol) {
      options.push('nosymbol')
    }
    if (this.optional) {
      options.push('optional')
    }
    if (this.gridMin && this.gridMax) {
      options.push(`${this.gridMin}-${this.gridMax}`)
    }
    return `<${options.join(' ')}>`;
  }
}
