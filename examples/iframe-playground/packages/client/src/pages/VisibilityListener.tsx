import React from 'react';
import {useInterval} from 'react-use';

function getHMSMS(utcMs: number) {
  const date = new Date(utcMs);

  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
    .getSeconds()
    .toString()
    .padStart(2, '0')}:${date.getMilliseconds().toString().padStart(3, '0')}`;
}

export default function VisibilityListener() {
  const [visibilityArray, setVisibilityArray] = React.useState<Array<{date: number; state: string}>>([]);
  const [time, setTime] = React.useState(getHMSMS(new Date().getTime()));
  const updateTime = React.useCallback(() => {
    const newTime = getHMSMS(new Date().getTime());
    setTime(newTime);
  }, [setTime]);
  useInterval(updateTime, 1000);

  React.useEffect(() => {
    function changeListener() {
      setVisibilityArray((s) => [...s, {date: new Date().getTime(), state: document.visibilityState}]);
    }
    document.addEventListener('visibilitychange', changeListener);
    return () => {
      document.removeEventListener('visibilitychange', changeListener);
    };
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <p>
          This example is used for tracking and debugging when the document's visibility state (
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState">
            document.visibilityState
          </a>
          ) changes. This is important to track on mobile embedded apps, as embedded iframes such as youtube, will pause
          video (or trigger other unwanted side-effects) if the visibility state switches to "hidden" when the embedded
          app is passed between webviews.
        </p>
      </div>
      <br />
      <div>{time}</div>
      <button style={{margin: '32px 0'}} onClick={() => setVisibilityArray([])}>
        Reset change history
      </button>
      <p>Visibility changes:</p>
      <br />
      {visibilityArray.map((event, index) => (
        <React.Fragment key={index}>
          <div>
            {getHMSMS(event.date)} {event.state}
          </div>
          {event.state.endsWith('visible') ? (
            <>
              <div>Hidden for {event.date - visibilityArray[index - 1]?.date ?? 0}ms</div>
              <br />
            </>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}
