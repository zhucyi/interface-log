declare module 'interface-log' {
  class Surface {}
  class Client {}
  interface IProps {
    bridge: String | String[];
  }
  export default class InterfaceLog {
    readonly _surface: Surface;
    readonly _client: Client;
    constructor(config?: IProps);
  }
}
