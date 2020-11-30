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
  props: any[] = [];
  result: Map<string, any> = new Map();
  constructor(name) {
    this.name = name;
  }
}
