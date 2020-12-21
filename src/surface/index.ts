import indexArt from './pannel.art';
import methodArt from './method.art';
import { Method } from '../client/methods';
import './index.less';
import { addDomString, String2Dom, longPress, slideAway } from '../util/dom';
import { cloneDeep } from 'lodash';
import { getFoldedLine } from '../log/index';
import { schedulerWatcher } from '../scheduler';
import reloadSVG from '../assets/replay.svg';

class Surface {
  $root: HTMLElement;
  $content: HTMLElement;
  $zoom: HTMLElement;
  $zoomContainer: HTMLElement;

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
    this.$content = this.$root.querySelector('.log_content_inner');
    this.$zoom = this.$root.querySelector('.log_zoom');
    this.$zoomContainer = this.$zoom.querySelector('.container');
  }

  _initEvent(): void {
    const { $root } = this;
    const $btn: HTMLElement = $root.querySelector('.log_btn');
    const $panel: HTMLElement = $root.querySelector('.log_panel');
    const $hide: HTMLElement = $root.querySelector('.log_hide');
    const $mask: HTMLElement = $root.querySelector('.log_mask');
    const $clear: HTMLElement = $root.querySelector('.log_clear');
    this.$zoom.querySelector('.exit').addEventListener('click', () => {
      this.$zoom.classList.remove('trigger');
      this.$zoomContainer.innerHTML = '';
    });
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
    method = cloneDeep(method);
    schedulerWatcher({
      id: method.id,
      render: () => {
        this.append(method);
      },
    });
  }

  _genItem(method: Method): HTMLElement {
    const $dom = <HTMLElement>String2Dom(
      methodArt({
        id: method.id,
        name: method.name,
        bridgeName: method.bridgeName,
        status: method.status,
        reloadSVG,
      })
    );
    // replay function
    $dom.querySelector('.replay').addEventListener('click', () => {
      method.fn(...method.props.map(({ value }) => value));
    });
    // 滑动删除项
    slideAway(
      $dom,
      () => {
        setTimeout(() => {
          $dom.parentElement.removeChild($dom);
        }, 200);
      },
      false
    );

    const classes = ['props', 'result'];
    classes.forEach(className => {
      const $line = getFoldedLine(method[className]);
      $dom.querySelector(`.${className}`).append($line);
    });

    const self = this;
    Array.from($dom.children).forEach($child => {
      longPress(
        <HTMLElement>$child,
        function () {
          const { $zoom, $zoomContainer } = self;
          $zoom.classList.add('trigger');
          const index = classes.findIndex(_class =>
            (<HTMLElement>this).classList.contains(_class)
          );
          if (index === -1) {
            $zoomContainer.append(
              (<HTMLElement>this.querySelector('span')).cloneNode(true)
            );
          } else {
            $zoomContainer.append(getFoldedLine(method[classes[index]]));
          }
        },
        500,
        false
      );
    });
    return $dom;
  }

  append(method: Method): void {
    const $dom = this._genItem(method);
    this.$content.append($dom);
  }
}

export default Surface;
