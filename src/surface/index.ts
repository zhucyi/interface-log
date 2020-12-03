import indexTpl from './pannel.html';
import './index.less';
import { addDomString } from '../util/dom';

class Surface {
  $root: HTMLElement;
  $content: HTMLElement;

  constructor() {
    this._render();
    this._initUnit();
    this._initEvent();
  }
  _initUnit() {
    const dpr = window.devicePixelRatio || 1;
    const viewportEl: HTMLMetaElement = document.querySelector(
      '[name="viewport"]'
    );
    if (viewportEl && viewportEl.content) {
      let initialScale = viewportEl.content.match(
        /initial\-scale\=\d+(\.\d+)?/
      );
      let scale = initialScale ? parseFloat(initialScale[0].split('=')[1]) : 1;
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

  _render() {
    this._renderGeneral();
  }
  _renderGeneral() {
    this.$root = <HTMLElement>addDomString(document.documentElement, indexTpl);
    this.$content = this.$root.querySelector('.log_content');
  }
  _initEvent() {
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
      this.$content.innerHTML = '';
    });
  }

  append(dom) {
    this.$content.append(dom);
  }
  refresh(fun) {
    const $refresh: HTMLElement = this.$root.querySelector('.log_refresh');
    $refresh.addEventListener('click', () => {
      this.$content.innerHTML = '';
      fun();
    });
  }
}

export default Surface;
