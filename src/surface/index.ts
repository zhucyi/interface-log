import indexArt from './pannel.art';
import methodArt from './method.art';
import { Method } from '../client/methods';
import './index.less';
import { addDomString, String2Dom } from '../util/dom';
import { sizeOf } from '../util/tool';
import { isNil } from 'lodash';
import Log from '../log';

class Surface {
  $root: HTMLElement;
  $content: HTMLElement;
  flush = false;
  paintQueue = [];

  constructor() {
    this._render();
    this._initUnit();
    this._initEvent();
  }
  _initUnit(): void {
    const dpr = window.devicePixelRatio || 1;
    const viewportEl: HTMLMetaElement = document.querySelector(
      '[name="viewport"]'
    );
    if (viewportEl && viewportEl.content) {
      const initialScale = viewportEl.content.match(
        /initial-scale=\d+(\.\d+)?/
      );
      const scale = initialScale
        ? parseFloat(initialScale[0].split('=')[1])
        : 1;
      if (scale < 1) {
        this.$root.style.fontSize = 13 * dpr + 'px';
      }
    } else {
      addDomString(
        document.head,
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">'
      );
    }
  }

  _render(): void {
    this.$root = <HTMLElement>(
      addDomString(document.documentElement, indexArt())
    );
    this.$content = this.$root.querySelector('.log_content');
  }

  _initEvent(): void {
    const { $root } = this;
    const $btn: HTMLElement = $root.querySelector('.log_btn');
    const $panel: HTMLElement = $root.querySelector('.log_panel');
    const $hide: HTMLElement = $root.querySelector('.log_hide');
    const $mask: HTMLElement = $root.querySelector('.log_mask');
    const $clear: HTMLElement = $root.querySelector('.log_clear');
    $btn.addEventListener('click', () => {
      $panel.style.display = 'flex';
      $btn.style.display = 'none';
      $mask.style.display = 'block';
    });
    $hide.addEventListener('click', () => {
      $panel.style.display = 'none';
      $btn.style.display = 'block';
      $mask.style.display = 'none';
    });
    $clear.addEventListener('click', () => {
      const items = this.$content.querySelectorAll('.log_item');
      items.forEach(
        item =>
          !item.classList.contains('log_head') &&
          this.$content.removeChild(item)
      );
    });
  }

  push(method: Method): void {
    this.paintQueue.push(method);
    this.append(method);
  }

  _genItem(method: Method): HTMLElement {
    // method.result
    const size = [];
    method.result.forEach(value => {
      let _size = 0;
      if (isNil(value)) {
        _size = 0;
      } else if (typeof value == 'string') {
        _size = sizeOf(value);
      } else {
        _size = sizeOf(JSON.stringify(value));
      }
      size.push(_size);
    });
    const { syncTime, asyncTime } = method;
    const time = { syncTime, asyncTime };
    const $dom = String2Dom(
      methodArt({
        id: method.id,
        name: method.name,
        bridgeName: method.bridgeName,
        status: method.status,
      })
    );
    $dom.querySelector('.props').append(new Log(method.props).$line);
    $dom.querySelector('.result').append(new Log(method.result).$line);
    $dom.querySelector('.time').append(new Log(time).$line);
    $dom.querySelector('.size').append(new Log(size).$line);
    return <HTMLElement>$dom;
  }

  append(method: Method): void {
    const $dom = this._genItem(method);
    this.$content.append($dom);
  }
}

export default Surface;
