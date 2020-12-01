import { isArray, isString, isFunction } from 'lodash';
import indexTpl from './index.html';
import './index.less';
import * as nunjucks from 'nunjucks';

class InterfaceLog {
  $root: HTMLDivElement;

  constructor() {
    this._render();
  }
  _render() {
    this._renderGeneral();
  }
  _renderGeneral() {
    let e = document.createElement('div');
    e.innerHTML = indexTpl;
    this.$root = e.children[0] as HTMLDivElement;
    document.documentElement.insertAdjacentElement('beforeend', this.$root);
  }
  _initEvent() {
    const { $root } = this;
    const $btn = $root.querySelector('.log_btn');
    const $panel: HTMLElement = $root.querySelector('.log_panel');
    $btn.addEventListener('click', () => {
      $panel.style.display = 'block';
    });
  }
}

export default InterfaceLog;
