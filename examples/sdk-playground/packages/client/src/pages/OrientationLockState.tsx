import React from 'react';
import discordSdk from '../discordSdk';
import {Common} from '@discord/embedded-app-sdk';

enum DropdownOptions {
  UNDEFINED = 'undefined',
  NULL = 'null',
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
  UNLOCKED = 'unlocked',
}

const OPTIONS = Object.values(DropdownOptions);
type OrientationLockStateType =
  | typeof Common.OrientationLockStateTypeObject.LANDSCAPE
  | typeof Common.OrientationLockStateTypeObject.PORTRAIT
  | typeof Common.OrientationLockStateTypeObject.UNLOCKED;

type NonNullDropdownOptions = DropdownOptions.UNLOCKED | DropdownOptions.LANDSCAPE | DropdownOptions.PORTRAIT;

function getNonNullLockStateFromDropdownOption(dropdownOption: NonNullDropdownOptions): OrientationLockStateType {
  switch (dropdownOption) {
    case DropdownOptions.LANDSCAPE:
      return Common.OrientationLockStateTypeObject.LANDSCAPE;
    case DropdownOptions.PORTRAIT:
      return Common.OrientationLockStateTypeObject.PORTRAIT;
    case DropdownOptions.UNLOCKED:
      return Common.OrientationLockStateTypeObject.UNLOCKED;
  }
}

function getLockStateFromDropdownOption(dropdownOption: DropdownOptions): OrientationLockStateType | null | undefined {
  switch (dropdownOption) {
    case DropdownOptions.UNDEFINED:
      return undefined;
    case DropdownOptions.NULL:
      return null;
    case DropdownOptions.LANDSCAPE:
      return Common.OrientationLockStateTypeObject.LANDSCAPE;
    case DropdownOptions.PORTRAIT:
      return Common.OrientationLockStateTypeObject.PORTRAIT;
    case DropdownOptions.UNLOCKED:
      return Common.OrientationLockStateTypeObject.UNLOCKED;
  }
}

export default function OrientationLockState() {
  const [defaultLockStateDropdownOption, setDefaultLockStateDropdownOption] = React.useState<NonNullDropdownOptions>(
    DropdownOptions.UNLOCKED
  );
  const [pipLockStateDropdownOption, setPipLockStateDropdownOption] = React.useState<DropdownOptions>(
    DropdownOptions.UNDEFINED
  );
  const [gridLockStateDropdownOption, setGridLockStateDropdownOption] = React.useState<DropdownOptions>(
    DropdownOptions.UNDEFINED
  );

  const onDefaultLockStateOptionSelected = React.useCallback((event: any) => {
    setDefaultLockStateDropdownOption(event.target.value);
  }, []);

  const onPipLockStateOptionSelected = React.useCallback((event: any) => {
    setPipLockStateDropdownOption(event.target.value);
  }, []);
  const onGridLockStateOptionSelected = React.useCallback((event: any) => {
    setGridLockStateDropdownOption(event.target.value);
  }, []);

  const onButtonClick = React.useCallback(() => {
    discordSdk.commands.setOrientationLockState({
      lock_state: getNonNullLockStateFromDropdownOption(defaultLockStateDropdownOption),
      picture_in_picture_lock_state: getLockStateFromDropdownOption(pipLockStateDropdownOption),
      grid_lock_state: getLockStateFromDropdownOption(gridLockStateDropdownOption),
    });
  }, [defaultLockStateDropdownOption, pipLockStateDropdownOption, gridLockStateDropdownOption]);

  return (
    <div style={{padding: 32, display: 'flex', flexDirection: 'column'}}>
      <h1>Set Orientation Lock State on Mobile</h1>
      <p>default</p>
      <select name="default" onChange={onDefaultLockStateOptionSelected}>
        {[DropdownOptions.UNLOCKED, DropdownOptions.LANDSCAPE, DropdownOptions.PORTRAIT].map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </select>
      <p>picture in picture</p>
      <select onChange={onPipLockStateOptionSelected}>
        {OPTIONS.map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </select>
      <p>grid</p>
      <select onChange={onGridLockStateOptionSelected}>
        {OPTIONS.map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </select>
      <button style={{marginTop: 16}} onClick={onButtonClick}>
        Set lock states
      </button>
    </div>
  );
}
