import React, { Component } from 'react';

import api from '../../key/key';
import WeatherCard from './WeatherCard-Component';
import InputComponent from './Input-Component';

// must change all url's to http when in development

export default class MainBoxComponent extends Component {
	state = {
		url: `https://api.apixu.com/v1/forecast.json?key=${api.key}&days=5&q=10562,us`,
		weather: [],
		location: 'Ossining',
		region: 'NY',
		error: null
	};

	handleUnixToDayOfWeek = timeStamp => {
		let date = new Date(timeStamp * 1000);
		const days = [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday'
		];
		const dayOfWeek = days[date.getDay()];
		return dayOfWeek;
	};

	handleGetData = () => {
		const { url } = this.state;
		fetch(url)
			.then(res => res.json())
			.then(data => data)
			.catch(error => console.log(error));
	};

	handleReverseGeoLocate = (lat, lon) => {
		let key = 'AIzaSyAE3y9x37WZUZrzkhq9rXJF76lrVBpvMqA';
		let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`;
		fetch(url).then(res => res.json()).then(data => {
			let area = data.results[0].formatted_address;
			let splitArea = area.split(',');
			this.setState({ location: splitArea[1], region: splitArea[2] });
		});
	};

	handleGeoLocate = () => {
		navigator.geolocation.getCurrentPosition(position => {
			this.setState(() => ({
				url: `https://api.apixu.com/v1/forecast.json?key=${api.key}&days=5&q=${position
					.coords.latitude},${position.coords.longitude}`,
				lat: position.coords.latitude,
				lon: position.coords.longitude
			}));

			fetch(this.state.url)
				.then(res => res.json())
				.then(data => {
					let weather = data.forecast.forecastday;
					let location =
						data.location.name !== ''
							? data.location.name
							: this.handleReverseGeoLocate(
									this.state.lat,
									this.state.lon
								);
					let region =
						data.location.region === '' ||
						data.location.region === data.location.name
							? data.location.country
							: data.location.region;
					this.setState(() => ({ weather, location, region }));
				})
				.catch(err => console.log(err));
		});
	};

	passResponse = data => {
		let weather = data.forecast.forecastday;
		let location = data.location.name;
		let region =
			data.location.region === '' ||
			data.location.region === data.location.name
				? data.location.country
				: data.location.region;
		this.setState(() => ({ weather, location, region }));
	};

	failResponse = data => {
		let error = data.error.message;
		this.setState({ error });
	};

	handleOnUpdate = async res => {
		let response = await fetch(`
			https://api.apixu.com/v1/forecast.json?days=5&key=${api.key}&q=${encodeURIComponent(
			res
		)}`);
		let data = await response.json().catch(err => console.log(err));
		data.error ? this.failResponse(data) : this.passResponse(data);
	};

	componentDidMount = () => {
		this.handleGeoLocate();
		this.handleGetData();
	};

	render() {
		const { weather, location, region } = this.state;
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
				<h1 className="weather-box__loading">LOADING...</h1>
			);

		return (
			<div>
				<div className="weather-box">
					<h1 className="weather-box__location">
						{location}, {region}
					</h1>
					<div className="weather-box__container container">
						{dailyForecast}
					</div>
				</div>
				<InputComponent
					error={this.state.error}
					onUpdate={this.handleOnUpdate}
				/>
			</div>
		);
	}
}
