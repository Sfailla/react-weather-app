import React from 'react';


const Header = (props) => {
    return (
        <div className="header">
            <div className="header__container container">
                <div className="header__icon-box"><svg className="header__icon header__icon--cloud"><use xlinkHref="./img/svg/sprite.svg#icon-cloud_queue"></use></svg></div>
                <p className="header__title">{props.title}</p>
                <div className="header__icon-box"><svg className="header__icon header__icon--person"><use xlinkHref="./img/svg/sprite.svg#icon-user2"></use></svg></div>
                <p className="header__developer">{props.developer}</p>
            </div>
        </div>
    );
}

Header.defaultProps = {
    developer: 'Steve Failla',
    title: 'Weather App'
}

export default Header;