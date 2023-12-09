import React from "react";
import Chart from "react-apexcharts";

interface WeatherData {
	city: string;
	temperature: number;
	condition: string;
	windSpeed: number;
	humidity: number;
}

interface WeatherChartProps {
	weatherData: WeatherData[];
}

const fahrenheitToCelsius = (inputDegreeValue: number): number => {
	return (inputDegreeValue - 32) * (5 / 9);
};

const WeatherChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
	const chartOptions = {
		xaxis: {
			categories: weatherData.map((data) => data.city),
		},
	};

	const temperatureSeries = {
		name: "Temperature (°C)",
		data: weatherData.map((data) =>
			Math.round(fahrenheitToCelsius(data.temperature))
		),
	};

	const conditionSeries = {
		name: "Condition",
		data: weatherData.map((data) => data.condition),
	};

	const windSpeedSeries = {
		name: "Wind Speed",
		data: weatherData.map((data) => data.windSpeed),
	};

	const humiditySeries = {
		name: "Humidity",
		data: weatherData.map((data) => data.humidity),
	};

	const chartSeries = [
		temperatureSeries,
		conditionSeries,
		windSpeedSeries,
		humiditySeries,
	].map((series) => ({
		...series,
		data: series.data.map((value) => (typeof value === "string" ? 0 : value)),
	}));
	return (
		<div className="chart">
			<Chart
				options={chartOptions}
				series={chartSeries}
				type="bar"
				width="500"
				height="300"
			/>
		</div>
	);
};

export default WeatherChart;
