import React, { Component } from 'react';

import HeaderComponent from './Header-Component';
import TitleComponent from './Title-Component';
import MainBoxComponent from './Weather-Box-Component';

class App extends Component {
    render() {
        return (
            <div className="app__wrapper">
                <HeaderComponent />
                <TitleComponent />
                <MainBoxComponent />
            </div>
        );
    }
}

export default App;