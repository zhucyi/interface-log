import { noop } from 'lodash';
import { isNative } from './tool';

export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
export const isIE = UA && /msie|trident/.test(UA);

const queue = [];
let pending = false;

let timerFunc;

if (Promise && isNative(Promise)) {
  timerFunc = () => Promise.resolve().then(() => flushQueue());
  isIOS && setTimeout(noop);
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  let count = 1;
  const observer = new MutationObserver(flushQueue);
  const textNode = document.createTextNode(String(count));
  observer.observe(textNode, { characterData: true });
  timerFunc = () => {
    count = (count + 1) % 2;
    textNode.data = String(count);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushQueue);
  };
} else {
  timerFunc = () => {
    setTimeout(flushQueue, 0);
  };
}

function flushQueue() {
  pending = false;
  const copy = queue.splice(0);
  copy.forEach(cb => cb());
}

export function nextTick(cb: Fn<unknown>, ctx?: unknown): void {
  queue.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (error) {
        return;
      }
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
