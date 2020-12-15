import Client from './client/index';
import Surface from './surface';
import { IProps } from './types';

class InterfaceLog {
  constructor(config: IProps) {
    const _surface = new Surface();
    new Client(config).register(_surface);
  }
}

export default InterfaceLog;
