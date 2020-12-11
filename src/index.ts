import Client from './client/index';
import Log from './log/index';
import Surface from './surface';
import { IProps } from './types';

class InterfaceLog {
  private _surface!: Surface;
  private _client!: Client;

  constructor(config: IProps) {
    this._generateClient(config);
    this._initSurface();
  }
  private _printContent() {
    const bridges = this._client.bridgeMap.values();
    return Array.from(bridges);
  }
  private _initSurface() {
    this._surface = new Surface();
    let $dom = new Log(this._printContent()).$line;
    this._surface.append($dom);
    this._surface.refresh(() => {
      $dom = new Log(this._printContent()).$line;
      this._surface.append($dom);
    });
  }

  _generateClient(config: IProps): void {
    if (this._client) return;
    this._client = new Client(config);
  }
}

export default InterfaceLog;
