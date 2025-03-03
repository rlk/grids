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

export class Symbol {
  constructor(root, triad = '', extension = '') {
    this.root = root;
    this.triad = triad;
    this.extension = extension;
  }

  toString() {
    if (this.extension) {
      return `n:${this.root}${this.triad} e:${this.extension}`
    } else {
      return `n:${this.root}${this.triad}`
    }
  }

  toElement() {
    var symbol = document.createElement('span')
    symbol.setAttribute('class', 'symbol');

    var root = document.createElement('span')
    root.setAttribute('class', 'root');
    root.innerHTML = this.root + this.triad
    symbol.appendChild(root);

    if (this.extension) {
      var extension = document.createElement('span')
      extension.setAttribute('class', 'extension');
      extension.innerHTML = this.extension;
      symbol.appendChild(extension);
    }
    return symbol;
  }
}
