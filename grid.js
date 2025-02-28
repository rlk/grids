import { createGrid } from "./modules/grid.js";

function render() {
  for (var element of document.getElementsByClassName('grid')) {
    element.replaceChildren(createGrid(element.innerHTML));
  }
}

document.addEventListener('DOMContentLoaded', function() { render() }, false);
