import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Import styles
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Sidebar from '../Sidebar';
import Entities from '../Entities';

const App = () => {
  let wrapperDivInstance;
  const toggleSidebar = () => wrapperDivInstance.classList.toggle('sidebar-open');
  const renderFn = (Component) => (props) => (<Component
    {...props}
    toggleSidebar={toggleSidebar}
  />);
  return (
    <div>
      <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"></link>

      <Router>
        <div
          id="wrapper"
          className="sidebar-open"
          ref={c => { wrapperDivInstance = c; }}
        >
          <Route path="/" component={Sidebar} />

          <Route path="/entities" render={renderFn(Entities)} />

        </div>
      </Router>
    </div>
  );
}

export default App
