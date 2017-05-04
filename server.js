/* eslint no-console: "off" */
const app = require('./lib/app');
require('./lib/connect');

app.listen(3000, () => {
  console.log('server running on port 3000');
});