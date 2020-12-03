import { Method } from './methods';
export class Bridge {
  name: string;
  methods: Map<string, Method> = new Map();
  constructor(name) {
    this.name = name;
  }
}
