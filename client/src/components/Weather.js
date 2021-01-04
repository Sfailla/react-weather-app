import React from 'react';

import WeatherCard from './WeatherCard';
import Search from './Search';
import Error from './Error';

export default class Weather extends React.Component {
  state = {
    weather: [],
    location: 'Ossining',
    region: 'NY',
    error: null,
  };

  FETCH_URL = `https://api.openweathermap.org/data/2.5/forecast?APPID=${process.env.WEATHER_API_KEY}`;

  handleUnixToDayOfWeek = timeStamp => {
    let date = new Date(timeStamp * 1000);
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const dayOfWeek = days[date.getDay()];
    return dayOfWeek;
  };

  handleGeoLocate = async () => {
    navigator.geolocation.getCurrentPosition(async position => {
      this.setState(() => ({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }));

      try {
        const response = await fetch(
          `${this.FETCH_URL}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();

        let weather = data.list;
        let location = data.city.name;
        let region = data.city.country;

        this.setState(() => ({ weather, location, region }));
      } catch (err) {
        err => console.error(err);
      }
    });
  };

  passResponse = data => {
    this.setState(() => ({
      weather: data.list,
      location: data.city.name,
      region: data.city.country,
      error: null,
    }));
  };

  failResponse = data => {
    console.log(data);
    // this.setState({ error: data });
  };

  handleOnSearch = async searchTerm => {
    try {
      let response = await fetch(`${this.FETCH_URL}&q=${searchTerm}`);
      let data = await response.json();

      console.log(data);
      if (data.cod === '200') {
        this.passResponse(data);
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.log('there was an error');
    }
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
          const icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
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
        <h1 className="weather__loading">LOADING...</h1>
      );

    return (
      <div>
        <div className="weather">
          <h1 className="weather__location">
            {location} {region}
          </h1>
          <div className="weather__container container">{dailyForecast}</div>
          {this.state.error && (
            <div className="error">
              <Error
                error={this.state.error}
                handleClose={this.handleCloseErrorMessage}
              />
            </div>
          )}
        </div>
        <Search error={this.state.error} onSearch={this.handleOnSearch} />
      </div>
    );
  }
}
