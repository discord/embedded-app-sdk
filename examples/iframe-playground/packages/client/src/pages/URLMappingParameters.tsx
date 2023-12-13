import React from 'react';

export default function URLMappingParameters() {
  return (
    <div style={{padding: 32}}>
      <div>Testing URL Mapping Parameters</div>
      <div>This page is for testing the URL Mapping Parameter option.</div>
      <table style={{borderCollapse: 'collapse', width: '100%'}}>
        <tr>
          <th>prefix</th>
          <th>target</th>
        </tr>
        <tr>
          <td>{`/bill/{foo}`}</td>
          <td>{`{foo}.fillmurray.com`}</td>
        </tr>
      </table>
      <div>
        <div>{`<img alt="bill" src="/bill/www/400/400" />`}</div>
        <img alt="bill" src="/bill/www/400/400" />
      </div>
      <br />
      <br />
      <div>
        <div>{`<img alt="bill" src="https://www.fillmurray.com/400/400" />`}</div>
        <img alt="bill" src="https://www.fillmurray.com/400/400" />
      </div>
    </div>
  );
}
