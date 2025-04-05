import { toNode } from "./modules/utility.js";
import { interpret } from "./modules/interpreter.js";

function render() {
  for (var element of document.querySelectorAll('.gridgen')) {
    var result = interpret(element.textContent, element.classList.contains('debug'));
    if (Array.isArray(result)) {
      element.replaceWith(...result.map(x => toNode(x, element.localName)));
    } else {
      element.replaceWith(toNode(result, element.localName));
    }
  }
}

document.addEventListener('DOMContentLoaded', function() { render() }, false);
