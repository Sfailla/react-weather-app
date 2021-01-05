import React from 'react';
import Icon from './Icon';

export default class Search extends React.Component {
  state = {
    value: '',
  };

  handleOnChange = event => {
    let value = event.target.value;
    this.setState(() => ({ value }));
  };

  handleOnSubmit = e => {
    e.preventDefault();
    let trimmedVal = this.state.value.trim();
    this.props.onSearch(trimmedVal);
    this.state.value = '';
  };

  render() {
    const { value } = this.state;

    return (
      <div className="input">
        <div className="container">
          <p className="input__search-text">
            To get the forcast in a different area, enter{' '}
            <span className="input__span">City</span> or{' '}
            <span className="input__span">Zip</span> in search area below
          </p>
          <label
            className="input__label"
            htmlFor="City and State, or Zip"
            name="search-input"
          >
            Enter City or Zip
          </label>
          <div className="input__container">
            <form className="input__form" onSubmit={this.handleOnSubmit}>
              <input
                onChange={this.handleOnChange}
                className="input__search-box"
                placeholder="to search a different area click here"
                value={value}
                autoComplete="off"
              />
              <button type="submit" className="input__submit-button">
                <Icon
                  icon="search"
                  viewBox={20}
                  fill="#ffa500"
                  className="input__search-icon"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
