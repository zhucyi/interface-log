// import { Method } from '../client/methods';
import { Factor } from '../types';

const queue: Factor[] = [];
const collection = new Set();
let index = 0,
  waiting = false,
  flushing = false;

function resetFlush(): void {
  index = 0;
  waiting = true;
  flushing = false;
}

function flushQueue(): void {
  flushing = true;
  queue.sort((i1, i2) => i1.method.id - i2.method.id);
  while (index < queue.length) {
    queue[index].render();
  }
  resetFlush();
}

export function schedulerWatcher(factor: Factor): void {
  if (collection.has(factor.method.id)) {
    return;
  }
  if (!flushing) {
    queue.push(factor);
  }
  // else {
  // }
  if (waiting) {
    setTimeout(flushQueue);
  }
}
