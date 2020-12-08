interface PlainObject {
  [key: string]: any;
}

interface IProps {
  bridge: String | String[];
}

interface MethodsProps {
  index: number;
  type: string;
  value: string;
  fn?: Function;
  _fn?: Function;
}

interface Window {
  obj: any;
  // todo:delete
  [key: string]: any;
}
