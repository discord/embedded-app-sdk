import ReactJsonViewOG from 'react-json-view';
import type {ThemeObject, ReactJsonViewProps} from 'react-json-view';
import {theme} from '../styled';

const jsonTheme: ThemeObject = {
  base00: theme.colors.slate1.computedValue, // background
  base01: theme.colors.slate12.computedValue, // idk
  base02: theme.colors.slate6.computedValue, // lines
  base03: theme.colors.slate12.computedValue, // idk
  base04: theme.colors.slate10.computedValue, // object value count
  base05: theme.colors.slate12.computedValue, // idk
  base06: theme.colors.slate12.computedValue, // idk
  base07: theme.colors.slate12.computedValue, // object key
  base08: theme.colors.slate12.computedValue, // idk
  base09: theme.colors.slate12.computedValue, // string kv
  base0A: theme.colors.slate12.computedValue, // idk
  base0B: theme.colors.slate12.computedValue, // idk
  base0C: theme.colors.slate12.computedValue, // array index
  base0D: theme.colors.slate10.computedValue, // arrow
  base0E: theme.colors.slate12.computedValue, // idk
  base0F: theme.colors.slate12.computedValue, // int
};

export default function ReactJsonView(props: ReactJsonViewProps) {
  return <ReactJsonViewOG theme={jsonTheme} {...props} />;
}
