/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from "react";
import WeatherChart from "./WeatherChart";
import "./WeatherApp.css";
import {
	API_URL,
	API_KEY,
	ERROR_MESSAGE,
	CITY_ERROR_MESSAGE,
	WEATHER_ICON_BASE_URL,
	HEADING,
	BUTTON_TEXT,
	LOADING,
} from "../constants/Constant";

interface WeatherData {
	icon: number;
	city: string;
	temperature: number;
	condition: string;
	windSpeed: number;
	humidity: number;
}

const WeatherApp: React.FC = () => {
	const [city, setCity] = useState("");
	const [selectedCities, setSelectedCities] = useState<string[]>([]);
	const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchWeatherData = async () => {
		try {
			setLoading(true);
			setError("");

			const weatherDataPromises = selectedCities.map(async (city) => {
				// API calling starts here
				const apiUrl = `${API_URL}?q=${city}&appid=${API_KEY}`;
				const response = await fetch(apiUrl);
				const data = await response.json();
				const icon = data.weather[0].icon;
				const temperature = data.main.temp;
				const condition = data.weather[0].main;
				const windSpeed = data.wind.speed;
				const humidity = data.main.humidity;

				return {
					city,
					icon,
					temperature,
					condition,
					windSpeed,
					humidity,
				};
			});

			const newWeatherData = await Promise.all(weatherDataPromises);

			setWeatherData(newWeatherData);
		} catch (error) {
			setWeatherData(null);
			setError(ERROR_MESSAGE);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (selectedCities.length === 0) {
			return;
		}
		fetchWeatherData();
	}, [selectedCities]);

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (selectedCities.length === 0) {
			setError(CITY_ERROR_MESSAGE);
			return;
		}
	};

	const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCity(e.target.value);
	};

	const handleCityInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && city.trim() !== "") {
			setSelectedCities((prevSelectedCities) => [
				...prevSelectedCities,
				city.trim(),
			]);
			setCity("");
		}
	};

	const handleCityButtonClick = () => {
		if (city.trim() !== "") {
			setSelectedCities((prevSelectedCities) => [
				...prevSelectedCities,
				city.trim(),
			]);
			setCity("");
		}
	};

	const handleCityChipRemove = (removedCity: string) => {
		setSelectedCities((prevSelectedCities) =>
			prevSelectedCities.filter((city) => city !== removedCity)
		);
	};

	return (
		<div className="component">
			<div className="weather-app">
				<h1>{HEADING}</h1>
				<form onSubmit={handleFormSubmit}>
					<div className="city-chips">
						{selectedCities.map((city) => (
							<div key={city} className="city-chip">
								{city}
								<button
									type="button"
									className="remove-chip"
									onClick={() => handleCityChipRemove(city)}
								>
									X
								</button>
							</div>
						))}
					</div>
					<input
						type="text"
						placeholder="Enter a city name"
						value={city}
						onChange={handleCityInputChange}
						onKeyDown={handleCityInputKeyDown}
					/>
					<button type="submit" onClick={handleCityButtonClick}>
						{BUTTON_TEXT}
					</button>
				</form>

				{loading && <p>{LOADING}</p>}

				{error && <p className="error">{error}</p>}

				{weatherData &&
					weatherData.map((data) => (
						<div className="icon" key={data.city}>
							<img src={`${WEATHER_ICON_BASE_URL}${data.icon}.png`} alt="" />
						</div>
					))}

				{weatherData && <WeatherChart weatherData={weatherData} />}
			</div>
		</div>
	);
};

export default WeatherApp;
