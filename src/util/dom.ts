export function addDomString(dist, tpl) {
  const dom = String2Dom(tpl);
  dist.insertAdjacentElement('beforeend', dom);
  return dom;
}

export function String2Dom(tpl) {
  const e = document.createElement('div');
  e.innerHTML = tpl;
  const child = e.children;
  return child.length > 1 ? Array.from(child) : child[0];
}

export function hasClass(el: HTMLElement, className: string) {
  const reg = new RegExp('(^|\\s+)' + className + '($|\\s+)');
  return reg.test(el.className);
}

export function removeClass(el: HTMLElement, className: string) {
  return el.classList.remove(className);
}

export function addClass(el: HTMLElement, className: string) {
  return el.classList.add(className);
}
