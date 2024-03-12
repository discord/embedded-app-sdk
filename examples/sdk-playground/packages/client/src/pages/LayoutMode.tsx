import React from 'react';
import discordSdk from '../discordSdk';
import {Common, EventPayloadData} from '@discord/embedded-app-sdk';

export default function LayoutMode() {
  const [layoutModeString, setLayoutModeString] = React.useState<string>('');

  const handleLayoutModeUpdate = React.useCallback((update: EventPayloadData<'ACTIVITY_LAYOUT_MODE_UPDATE'>) => {
    const layoutMode = update.layout_mode;
    let layoutModeStr = '';
    switch (layoutMode) {
      case Common.LayoutModeTypeObject.FOCUSED: {
        layoutModeStr = 'FOCUSED';
        break;
      }
      case Common.LayoutModeTypeObject.PIP: {
        layoutModeStr = 'PIP';
        break;
      }
      case Common.LayoutModeTypeObject.GRID: {
        layoutModeStr = 'GRID';
        break;
      }
      case Common.LayoutModeTypeObject.UNHANDLED: {
        layoutModeStr = 'UNHANDLED';
        break;
      }
    }

    setLayoutModeString(layoutModeStr);
  }, []);

  React.useEffect(() => {
    discordSdk.subscribe('ACTIVITY_LAYOUT_MODE_UPDATE', handleLayoutModeUpdate);
    return () => {
      discordSdk.unsubscribe('ACTIVITY_LAYOUT_MODE_UPDATE', handleLayoutModeUpdate);
    };
  }, [handleLayoutModeUpdate]);

  return (
    <div>
      <h4>Embedded App Layout Mode</h4>
      <p>{layoutModeString}</p>
    </div>
  );
}
