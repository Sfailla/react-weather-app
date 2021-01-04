import React from 'react';

import Header from './Header';
import Weather from './Weather';

class Main extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="app__wrapper">
          <div>
            <h1 className="main-lead">5 Day Local Forcast</h1>
          </div>

          <Weather />
        </div>
      </div>
    );
  }
}

export default Main;
