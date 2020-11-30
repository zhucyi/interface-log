interface PlainObject {
  [key: string]: any;
}

interface Window {
  obj: any;
  // todo:delete
  [key: string]: any;
}

interface IProps {
  bridge: String | String[];
}
