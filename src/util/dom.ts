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

const canTouch = 'ontouchstart' in window;
const TOUCHCANCEL = 'touchcancel';
let event = {
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup',
};
if (canTouch) {
  event = {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend',
  };
}

export function longPress(
  $target: HTMLElement,
  fn: Fn<unknown>,
  timeout: number,
  preventDefault = true
): void {
  let timer;
  const move = e => {
    clearTimeout(timer);
    preventDefault && e.preventDefault();
  };
  const end = e => {
    preventDefault && e.preventDefault();
    clearTimeout(timer);
    $target.removeEventListener(event.move, move);
    $target.removeEventListener(event.end, end);
    if (canTouch) {
      $target.removeEventListener(TOUCHCANCEL, end);
    }
  };
  $target.addEventListener(event.start, function (e) {
    preventDefault && e.preventDefault();
    timer = setTimeout(() => fn.apply(this, [e]), timeout);
    $target.addEventListener(event.move, move);
    $target.addEventListener(event.end, end);
    if (canTouch) {
      $target.addEventListener(TOUCHCANCEL, end);
    }
  });
}

export function slideAway(
  $target: HTMLElement,
  callback: Fn<unknown>,
  preventDefault = true
): void {
  const deviceWidth = document.documentElement.clientWidth;
  let slideWidth = 0;
  let startX = 0;
  const move = e => {
    const posX =
      event.start === 'touchstart'
        ? (<TouchEvent>e).touches[0].clientX
        : (<MouseEvent>e).clientX;
    slideWidth = posX - startX;
    if (slideWidth < 0) return;
    $target.style.transform = `translateX(${slideWidth}px)`;
    $target.style.opacity = 1 - (slideWidth * 1.5) / deviceWidth + '';
  };
  const end = e => {
    preventDefault && e.preventDefault();
    if (slideWidth > deviceWidth / 3.5) {
      $target.style.transform = `translateX(${deviceWidth}px)`;
      $target.style.opacity = '0';
      $target.style.transition = 'all .2s';
      callback();
    } else {
      $target.style.transform = '';
      $target.style.opacity = '1';
      $target.style.transition = 'all .2s';
    }
    $target.removeEventListener(event.move, move);
    if (canTouch) {
      $target.removeEventListener(TOUCHCANCEL, end);
    }
  };

  $target.addEventListener(event.start, function (e) {
    preventDefault && e.preventDefault();
    $target.style.transition = '';
    startX =
      event.start === 'touchstart'
        ? (<TouchEvent>e).touches[0].clientX
        : (<MouseEvent>e).clientX;
    $target.addEventListener(event.move, move);
    $target.addEventListener(event.end, end);
    if (canTouch) {
      $target.addEventListener(TOUCHCANCEL, end);
    }
  });
}
