import React, { Component } from 'react';

import api from '../../key/key';
import WeatherCard from './WeatherCard-Component';
import InputComponent from './Input-Component';
import ErrorComponent from './ErrorComponent';

// must change all url's to http when in development

export default class MainBoxComponent extends Component {
	state = {
		url: `http://api.openweathermap.org/data/2.5/forecast?APPID=${api.key}&q=Ossining,us&mode=json`,
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

	handleReverseGeoLocate = (lat, lon) => {
		let key = 'AIzaSyAE3y9x37WZUZrzkhq9rXJF76lrVBpvMqA';
		let url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`;
		fetch(url).then(res => res.json()).then(data => {
			let area = data.results[0].formatted_address;
			let splitArea = area.split(',');
			this.setState({ location: splitArea[1], region: splitArea[2] });
		});
	};

	handleGeoLocate = () => {
		navigator.geolocation.getCurrentPosition(position => {
			this.setState(() => ({
				url: `http://api.openweathermap.org/data/2.5/forecast?APPID=${api.key}&lat=${position
					.coords.latitude}&lon=${position.coords.longitude}`,
				lat: position.coords.latitude,
				lon: position.coords.longitude
			}));

			fetch(this.state.url)
				.then(res => res.json())
				.then(data => {
					console.log(data);

					let weather = data.list;
					let location = data.city.name;
					let region = data.city.country;
					// let weather = data.list.weather;
					// let location =
					// 	data.location.name !== ''
					// 		? data.location.name
					// 		: this.handleReverseGeoLocate(
					// 				this.state.lat,
					// 				this.state.lon
					// 			);
					// let region =
					// 	data.location.region === '' ||
					// 	data.location.region === data.location.name
					// 		? data.location.country
					// 		: data.location.region;
					this.setState(() => ({ weather, location, region }));
				})
				.catch(err => console.error(err));
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
		this.setState(() => ({ weather, location, region, error: null }));
	};

	failResponse = data => {
		let error = data.error.message;
		this.setState({ error });
	};

	handleOnSearch = async res => {
		let response = await fetch(`
			http://api.apixu.com/v1/forecast.json?days=5&key=${api.key}&q=${encodeURIComponent(
			res
		)}`);
		let data = await response.json().catch(err => console.error(err));
		data.error ? this.failResponse(data) : this.passResponse(data);
	};

	handleCloseErrorMessage = () => {
		this.setState({ error: null });
	};

	componentDidMount = () => {
		this.handleGeoLocate();
	};

	handleFormatWeather = weather => {
		let fiveDayWeather = [];
		for (let i = 0; i < weather.length; i += 8) {
			fiveDayWeather.push(weather[i]);
		}
		return fiveDayWeather;
	};

	render() {
		const { weather, location, region } = this.state;
		const current = this.handleFormatWeather(weather);
		let dailyForecast =
			Array.isArray(current) && current.length ? (
				current.map((data, index) => {
					console.log(data);
					return (
						<WeatherCard
							key={index}
							day={this.handleUnixToDayOfWeek(data.dt)}
							icon={data.weather[0].icon}
							temp={data.main.temp.toFixed(0)}
							description={data.weather[0].description}
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
						{location} {region}
					</h1>
					<div className="weather-box__container container">
						{dailyForecast}
					</div>
					<div className="error">
						<ErrorComponent
							error={this.state.error}
							handleClose={this.handleCloseErrorMessage}
						/>
					</div>
				</div>
				<InputComponent
					error={this.state.error}
					onSearch={this.handleOnSearch}
				/>
			</div>
		);
	}
}
