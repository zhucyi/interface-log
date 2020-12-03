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
  private printContent() {
    const bridges = this._client.bridgeMap.values();
    return Array.from(bridges);
    // return this._client;
  }
  private _initSurface() {
    this._surface = new Surface();
    let $dom = new Log().getFoldedLine(this.printContent());
    this._surface.append($dom);
    this._surface.refresh(() => {
      $dom = new Log().getFoldedLine(this.printContent());
      this._surface.append($dom);
    });
  }
  _generateClient(config: IProps) {
    if (this._client) return;
    this._client = new Client(config);
  }
}

export default InterfaceLog;
