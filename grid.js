import { generateGrid } from "./modules/utility.js";

function render() {
  for (var element of document.querySelectorAll('.gridgen')) {
    var debug = element.classList.contains('debug');
    var grid = generateGrid(element.innerHTML, debug);
    if (Array.isArray(grid)) {
      element.replaceWith(...grid);
    } else {
      element.replaceWith(grid);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() { render() }, false);
