export class Method {
  name: string;
  _fn: Function;
  fn: Function;
  isCalled: Boolean = false;
  propsHasCallback: boolean = false;
  props: MethodsProps[] = [];
  result: Map<string, any> = new Map();
  constructor(name) {
    this.name = name;
  }

  refresh() {
    this.isCalled = true;
    this.props = [];
    this.result = new Map();
  }
}
