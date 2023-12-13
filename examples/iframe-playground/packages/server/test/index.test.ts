import {test} from 'uvu';
import mock from 'service-worker-mock';

test.before(() => {
  Object.assign(globalThis, mock());
});

// test("GET /", async () => {
//   let req = new Request("/", { method: "GET" });
//   let result = await Worker.fetch(req);
//   assert.is(result.status, 200);

//   let text = await result.text();
//   assert.is(text, "request method: GET");
// });

// test("POST /", async () => {
//   let req = new Request("/", { method: "POST" });
//   let result = await Worker.fetch(req);
//   assert.is(result.status, 200);

//   let text = await result.text();
//   assert.is(text, "request method: POST");
// });

test.run();
