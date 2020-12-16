import { Method } from '@/client/methods';

export interface PlainObject {
  [key: string]: unknown;
}

export interface IProps {
  bridge: string | string[];
}

export interface MethodsProps {
  index: number;
  type: string;
  value: unknown;
  fn?: Fn<unknown>;
  _fn?: Fn<unknown>;
}

export interface Factor {
  method: Method;
  render: Fn<unknown>;
}
