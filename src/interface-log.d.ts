declare module 'interface-log' {
  class Surface {}
  class Client {}
  interface IProps {
    bridge: string | string[];
  }
  export default class InterfaceLog {
    readonly _surface: Surface;
    readonly _client: Client;
    constructor(config?: IProps);
  }
}
