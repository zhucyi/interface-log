import { isArray, isString, isFunction } from 'lodash';
import indexTpl from './pannel.html';
import './index.less';
import { addDomString } from '../util/dom';
import Log from '../log';

class Surface {
  $root: HTMLElement;
  $content: HTMLElement;

  constructor() {
    this._render();
    this._initEvent();
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
    const $hide: HTMLElement = $root.querySelector('.log-hide');
    const $mask: HTMLElement = $root.querySelector('.log_mask');
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
  }

  append(dom) {
    this.$content.append(dom);
  }
}

export default Surface;
