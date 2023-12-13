import React from 'react';
import {useInterval, useUpdate} from 'react-use';

export default function WindowSizeTracker() {
  const update = useUpdate();
  // Update UI every second
  useInterval(update, 1000);

  const windowSizesRef = React.useRef<Array<{width: number; height: number}>>([
    {width: window.innerWidth, height: window.innerHeight},
  ]);
  React.useEffect(() => {
    function handleResize(ev: Event) {
      const target = ev.target as Window;
      windowSizesRef.current.unshift({width: target.innerWidth, height: target.innerHeight});
    }
    window.addEventListener('resize', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize, true);
    };
  }, []);

  return (
    <div style={{padding: 32}}>
      <h1>Window Resize Tracker</h1>
      <p>
        This example keeps track of every window "resize" event. It can be used to debug and verify dimension changes
        when the iframe transitions between PIP / tiles for web and mobile
      </p>
      <button onClick={() => (windowSizesRef.current = [{width: window.innerWidth, height: window.innerHeight}])}>
        Reset
      </button>
      <br />
      {windowSizesRef.current.map((windowSize) => (
        <div>{JSON.stringify(windowSize)}</div>
      ))}
    </div>
  );
}
