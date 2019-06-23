// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import '../css/app.css';

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import 'phoenix_html';

// Import local files
//
// Local files can be imported directly using relative paths, for example:

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './Root';
import { Socket } from 'phoenix';
// import GlobalState from './reducers/GlobalState';

// import * as rxjs from 'rxjs';
// import { map, filter } from 'rxjs/operators';

// rxjs
//   .range(0, 1000)
//   .pipe(
//     map(x => x + x),
//     filter(x => x % 2 === 0)
//   )
//   .subscribe(x => console.log(x));
let socket = new Socket('/socket', { params: { token: 'abcd' } });
socket.connect();

const channel = socket.channel('timer:update', {});
channel
  .join()
  .receive('ok', (resp: any) => {
    console.log('Joined successfully', resp);
  })
  .receive('error', (resp: any) => {
    console.log('Unable to join', resp);
  });

export const ChannelProvider = React.createContext({
  channel: channel
});

ReactDOM.render(
  <ChannelProvider.Provider value={{ channel }}>
    <Root />
  </ChannelProvider.Provider>,
  document.getElementById('react-app')
);
