import React, { Component } from 'react';

import api from '../../key/key';
import WeatherCard from './WeatherCard-Component';
import InputComponent from './Input-Component';

export default class MainBoxComponent extends Component {
	state = {
		url: `https://api.apixu.com/v1/forecast.json?key=${api.key}&days=5&q=10562,us`,
		weather: [],
		location: 'Ossining',
		region: 'NY'
	};

	handleUnixToDayOfWeek = timeStamp => {
		let date = new Date(timeStamp * 1000);
		const days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
		const dayOfWeek = days[date.getDay()];
		return dayOfWeek;
	};

	handleGetData = () => {
		const { url } = this.state;
		fetch(url).then(res => res.json()).then(data => data).catch(error => console.log(error));
	};

	handleGeoLocate = () => {
		navigator.geolocation.getCurrentPosition(position => {
			this.setState(() => ({
				url: `https://api.apixu.com/v1/forecast.json?key=${api.key}&days=5&q=${position.coords
					.latitude},${position.coords.longitude}`
			}));
			fetch(this.state.url)
				.then(res => res.json())
				.then(data => {
					let weather = data.forecast.forecastday;
					let location = data.location.name;
					let region =
						data.location.region === '' || data.location.region === data.location.name
							? data.location.country
							: data.location.region;
					this.setState(() => ({ weather, location, region }));
				})
				.catch(err => console.log(err));
		});
	};

	handleOnUpdate = data => {
		this.setState(() => ({
			url: `http://api.apixu.com/v1/forecast.json?days=5&key=${api.key}&q=${encodeURIComponent(
				data
			)}`
		}));
		setTimeout(() => {
			fetch(this.state.url)
				.then(res => res.json())
				.then(data => {
					console.log('--', data.location.name);
					console.log('--', data.location.region);
					console.log(data);
					let weather = data.forecast.forecastday;
					let location = data.location.name;
					let region =
						data.location.region === '' || data.location.region === data.location.name
							? data.location.country
							: data.location.region;
					this.setState(() => ({ weather, location, region }));
				})
				.catch(err => console.log(err));
		}, 300);
	};

	componentDidMount = () => {
		this.handleGetData();
		this.handleGeoLocate();
	};

	render() {
		const { weather, location, region, url } = this.state;
		const { value } = this.props;
		let dailyForecast =
			Array.isArray(weather) && weather.length ? (
				weather.map((data, index) => {
					return (
						<WeatherCard
							key={index}
							day={this.handleUnixToDayOfWeek(data.date_epoch)}
							icon={data.day.condition.icon}
							temp={data.day.avgtemp_f.toFixed(0)}
							description={data.day.condition.text}
						/>
					);
				})
			) : (
				<h1 className="weather-box__loading">Loading Weather Data...</h1>
			);

		return (
			<div>
				<div className="weather-box">
					<h1 className="weather-box__location">
						{location}, {region}
					</h1>
					<div className="weather-box__container container">{dailyForecast}</div>
				</div>
				<InputComponent onUpdate={this.handleOnUpdate} />
			</div>
		);
	}
}
