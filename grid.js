import { evaluate, toNode } from "./modules/utility.js";

function render() {
  for (var element of document.querySelectorAll('.gridgen')) {
    var result = evaluate(element.innerHTML, element.classList.contains('debug'));
    if (Array.isArray(result)) {
      element.replaceWith(...result.map(x => toNode(x, element.tagName)));
    } else {
      element.replaceWith(toNode(result, element.tagName));
    }
  }
}

document.addEventListener('DOMContentLoaded', function() { render() }, false);
