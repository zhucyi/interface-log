// import { Method } from '../client/methods';
import { Factor } from '../types';
import { nextTick } from '../util/next-tick';

const queue: Factor[] = [];
const collection = new Set();
let index = 0,
  waiting = false, // 队列在刷新，等待态
  flushing = false; // 队列刷新标记

function resetFlush(): void {
  index = 0;
  queue.splice(0);
  waiting = false;
  flushing = false;
}

function flushQueue(): void {
  flushing = true;
  queue.sort((f1, f2) => f1.id - f2.id);
  while (index < queue.length) {
    queue[index].render();
    collection.delete(queue[index].id);
    index++;
  }
  resetFlush();
}

function patch(factor: Factor) {
  const order = queue.findIndex(_factor => _factor.id === factor.id);
  queue.splice(order, 1, factor);
}

export function schedulerWatcher(factor: Factor): void {
  const { id = 0 } = factor;
  if (collection.has(id)) {
    patch(factor);
    return;
  }
  collection.add(id);
  if (!flushing) {
    queue.push(factor);
  } else {
    let pos = queue.length - 1;
    while (pos > index && queue[pos].id > queue[index].id) {
      pos--;
    }
  }
  if (!waiting) {
    waiting = true;
    // setTimeout(flushQueue);
    nextTick(flushQueue);
  }
}
