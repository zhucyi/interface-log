import './client';
import Client from './client/index';
import Log from './log/index';
import Surface from './surface';

class InterfaceLog {
  private _surface!: Surface;
  private _client!: Client;

  constructor(config: IProps) {
    this._generateClient(config);
    this._initSurface();
  }
  private _initSurface() {
    this._surface = new Surface();
    let $dom = new Log().getFoldedLine(this._client);
    this._surface.append($dom);
    this._surface.refresh(() => {
      $dom = new Log().getFoldedLine(this._client);
      this._surface.append($dom);
    });
  }
  _generateClient(config: IProps) {
    if (this._client) return;
    this._client = new Client(config);
  }
}

export default InterfaceLog;
