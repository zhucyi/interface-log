export class Bridge {
  name: string;
  methods: Map<string, Method> = new Map();
  constructor(name) {
    this.name = name;
  }
}

export class Method {
  name: string;
  _fn: Function;
  fn: Function;
  isCalled: Boolean = false;
  props: any[] = [];
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