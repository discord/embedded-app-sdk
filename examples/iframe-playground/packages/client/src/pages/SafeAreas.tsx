import React from 'react';

export default function SafeAreas() {
  const [insets, setInsets] = React.useState<{
    top: string;
    bottom: string;
    left: string;
    right: string;
  }>({
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
  });

  const measure = () => {
    // The safe area css values are not correct if read right away.
    // Sometimes the values are stale, or the numerical values are incorrect.
    // Performing this read on the next tick gives accurate results
    setTimeout(() => {
      const left = getComputedStyle(document.documentElement).getPropertyValue('--sail');
      const right = getComputedStyle(document.documentElement).getPropertyValue('--sair');
      const top = getComputedStyle(document.documentElement).getPropertyValue('--sait');
      const bottom = getComputedStyle(document.documentElement).getPropertyValue('--saib');

      setInsets({
        top,
        bottom,
        left,
        right,
      });
    }, 0);
  };

  React.useEffect(() => {
    addEventListener('resize', measure);
    measure();
    return () => {
      removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div style={{padding: 32}}>
      <h1>Safe Areas</h1>
      <br />
      <div>
        <b>top:</b> {insets.top}
      </div>
      <div>
        <b>bottom:</b> {insets.bottom}
      </div>
      <div>
        <b>left:</b> {insets.left}
      </div>
      <div>
        <b>right:</b> {insets.right}
      </div>
    </div>
  );
}
