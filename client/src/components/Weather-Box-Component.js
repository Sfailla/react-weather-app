import React, { Component } from 'react';

import WeatherCard from './WeatherCard-Component';
import InputComponent from './Input-Component';
import ErrorComponent from './ErrorComponent';

export default class MainBoxComponent extends Component {
	state = {
		url: `https://api.openweathermap.org/data/2.5/forecast?APPID=${api.key}&q=Ossining,us&mode=json`,
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
		let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process
			.env.GOOGLE_API_KEY}`;
		fetch(url).then(res => res.json()).then(data => {
			let area = data.results[0].formatted_address;
			let splitArea = area.split(',');
			this.setState({ location: splitArea[1], region: splitArea[2] });
		});
	};

	handleGeoLocate = () => {
		navigator.geolocation.getCurrentPosition(position => {
			this.setState(() => ({
				url: `https://api.openweathermap.org/data/2.5/forecast?APPID=${process
					.env.OPEN_WEATHER_API_KEY}&lat=${position.coords
					.latitude}&lon=${position.coords.longitude}`,
				lat: position.coords.latitude,
				lon: position.coords.longitude
			}));

			fetch(this.state.url)
				.then(res => res.json())
				.then(data => {
					let weather = data.list;
					let location = data.city.name;
					let region = data.city.country;

					this.setState(() => ({ weather, location, region }));
				})
				.catch(err => console.error(err));
		});
	};

	passResponse = data => {
		let weather = data.list;
		let location = data.city.name;
		let region = data.city.country;

		this.setState(() => ({ weather, location, region, error: null }));
	};

	failResponse = data => {
		let error = data.error.message;
		this.setState({ error });
	};

	handleOnSearch = async res => {
		let response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?APPID=${process
				.env.OPEN_WEATHER_API_KEY}&q=${res}`
		);
		let data = await response.json().catch(err => console.error(err));
		data.error ? this.failResponse(data) : this.passResponse(data);
	};

	handleFormatWeatherData = weather => {
		let fiveDayWeather = [];
		for (let i = 0; i < weather.length; i += 8) {
			fiveDayWeather.push(weather[i]);
		}
		return fiveDayWeather;
	};

	handleKelvinToFarenheit = temp => {
		temp = (temp - 273.15) * 1.8 + 32;
		return temp.toFixed(0);
	};

	handleCloseErrorMessage = () => {
		this.setState({ error: null });
	};

	componentDidMount = () => {
		this.handleGeoLocate();
	};

	render() {
		const { weather, location, region } = this.state;
		const current = this.handleFormatWeatherData(weather);
		const dailyForecast =
			Array.isArray(current) && current.length ? (
				current.map((data, index) => {
					const icon = `https://openweathermap.org/img/w/${data
						.weather[0].icon}.png`;
					return (
						<WeatherCard
							key={index}
							icon={icon}
							description={data.weather[0].description}
							day={this.handleUnixToDayOfWeek(data.dt)}
							temp={this.handleKelvinToFarenheit(data.main.temp)}
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
