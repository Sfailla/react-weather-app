import React, { Component } from 'react';

export default class WeatherCard extends Component {
	render() {
		const { day, temp, icon, description } = this.props;

		return (
			<div className="card">
				<div className="card__container">
					<div className="card__day">{day}</div>
					<div className="card__icon">
						<img src={icon} alt="weather icon" />
					</div>
					<div className="card__temp">{temp}&deg;F</div>
					<div className="card__description">{description}</div>
				</div>
			</div>
		);
	}
}
