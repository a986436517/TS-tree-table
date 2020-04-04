import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import APP from "./APP";

ReactDOM.render(
    <APP/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

