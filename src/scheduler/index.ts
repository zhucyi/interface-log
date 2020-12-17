// import { Method } from '../client/methods';
import { Factor } from '../types';

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
  queue.sort((i1, i2) => i1.method.id - i2.method.id);
  while (index < queue.length) {
    queue[index].render();
    collection.delete(queue[index].method.id);
    index++;
  }
  resetFlush();
}

function patch(factor: Factor) {
  const order = queue.findIndex(
    _factor => _factor.method.id === factor.method.id
  );
  queue.splice(order, 1, factor);
}

export function schedulerWatcher(factor: Factor): void {
  const { method = { id: 0 } } = factor;
  if (collection.has(method.id)) {
    patch(factor);
    return;
  }
  collection.add(method.id);
  if (!flushing) {
    queue.push(factor);
  } else {
    let pos = queue.length - 1;
    while (pos > index && queue[pos].method.id > queue[index].method.id) {
      pos--;
    }
  }
  if (!waiting) {
    waiting = true;
    setTimeout(flushQueue);
  }
}
