import { MethodsProps } from '../types';

export class Method {
  name: string;
  bridgeName: string;
  _fn: Fn<unknown>;
  fn: Fn<unknown>;
  isCalled = false;
  startTime!: number;
  syncTime!: number;
  asyncTime!: number;
  propsHasCallback = false;
  props: MethodsProps[] = [];
  result: Map<string, unknown> = new Map();
  constructor(name: string) {
    this.name = name;
  }

  refresh(): void {
    this.isCalled = true;
    this.props = [];
    this.result = new Map();
  }
  // paint() {}
}
