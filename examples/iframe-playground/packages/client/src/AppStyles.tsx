import {styled} from './styled';
import * as ScrollArea from '@radix-ui/react-scroll-area';

export const Navigation = styled(ScrollArea.Root, {
  height: '100%',
  width: '300px',
  overflow: 'auto',
  border: '1px solid',
  borderColor: '$slate12',
});

export const Ul = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
});

export const Li = styled('li', {
  padding: '24px',
  '& a': {
    padding: '6px',
    outlineColor: '$indigo12',
    textDecoration: 'none',
    borderRadius: '2px',
    color: '$slate12',
  },
  '& a:visited': {
    color: '$slate12',
  },
  variants: {
    selected: {
      true: {
        '& a': {
          backgroundColor: '$indigo6',
          color: '$indigo12',
        },
        '& a:visited': {
          color: '$indigo12',
        },
      },
    },
  },
});

export const SiteWrapper = styled('div', {
  display: 'flex',
  height: '100%',
  color: '$slate12',
  flexDirection: 'row',
  '@small': {
    flexDirection: 'column',
  },
  '@xsmall': {
    flexDirection: 'column',
  },
});
