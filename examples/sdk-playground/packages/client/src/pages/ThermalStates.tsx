import React from 'react';
import discordSdk from '../discordSdk';
import {Common, Events, EventPayloadData} from '@discord/embedded-app-sdk';

export default function ThermalStates() {
  const [thermalStateString, setThermalStateString] = React.useState<string>('');

  const updateThermalState = React.useCallback(
    (update: EventPayloadData<'THERMAL_STATE_UPDATE'>) => {
      const thermalState = update.thermal_state;
      let state;
      switch (thermalState) {
        case Common.ThermalStateTypeObject.NOMINAL:
          state = 'NOMINAL';
          break;
        case Common.ThermalStateTypeObject.FAIR:
          state = 'FAIR';
          break;
        case Common.ThermalStateTypeObject.SERIOUS:
          state = 'SERIOUS';
          break;
        case Common.ThermalStateTypeObject.CRITICAL:
          state = 'CRITICAL';
          break;
        default:
          state = 'UNHANDLED';
          break;
      }

      setThermalStateString(state);
    },
    [setThermalStateString]
  );

  React.useEffect(() => {
    discordSdk.subscribe(Events.THERMAL_STATE_UPDATE, updateThermalState);
    return () => {
      discordSdk.unsubscribe(Events.THERMAL_STATE_UPDATE, updateThermalState);
    };
  }, [updateThermalState]);

  return (
    <div style={{padding: 32}}>
      <h1>Thermal States</h1>
      <p style={{marginTop: 16}}>latest thermal state: {thermalStateString}</p>
    </div>
  );
}
