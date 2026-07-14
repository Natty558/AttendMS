// nav.js — shared navigation/render function to avoid circular imports

import { state } from "./state.js";

var renderFn = null;

export function setRender(fn) {
  renderFn = fn;
}

export function render() {
  if (renderFn) renderFn();
}

export function setView(view) {
  state.view = view;
  state.profileId = null;
  state.selectedClassId = null;
  var sidebar = document.querySelector("#sidebar");
  if (sidebar) sidebar.classList.remove("open");
  render();
}
