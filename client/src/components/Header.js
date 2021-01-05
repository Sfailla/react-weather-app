import React from 'react';

import Icon from './Icon';

const Header = props => {
  return (
    <div className="header">
      <div className="header__container container">
        <div className="header__icon-box">
          <Icon
            icon="clouds"
            viewBox={24}
            fill="#e2f734"
            className="header__icon header__icon--cloud"
          />
          {/* <svg className="header__icon header__icon--cloud">
            <use xlinkHref="/assets/svg/sprite.svg#icon-cloud_queue"></use>
          </svg> */}
        </div>
        <p className="header__title">{props.title}</p>
        <div className="header__icon-box">
          <Icon
            icon="person"
            fill="#e2f734"
            className="header__icon header__icon--person"
          />
        </div>
        <p className="header__developer">{props.developer}</p>
      </div>
    </div>
  );
};

Header.defaultProps = {
  developer: 'Steve Failla',
  title: 'Weather App',
};

export default Header;
