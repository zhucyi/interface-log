export function addDomString(dist: HTMLElement, tpl: string): Element {
  const dom = String2Dom(tpl);
  dist.insertAdjacentElement('beforeend', dom);
  return dom;
}

export function String2Dom(tpl: string): Element {
  const e = document.createElement('div');
  e.innerHTML = tpl;
  const child = Array.from(e.children);
  return child[0];
}


export function hasClass(el: HTMLElement, className: string): boolean {
  const reg = new RegExp('(^|\\s+)' + className + '($|\\s+)');
  return reg.test(el.className);
}

export function removeClass(el: HTMLElement, className: string): void {
  return el.classList.remove(className);
}

export function addClass(el: HTMLElement, className: string): void {
  return el.classList.add(className);
}
