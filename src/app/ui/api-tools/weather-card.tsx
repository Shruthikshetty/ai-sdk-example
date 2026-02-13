import Image from "next/image";

// types
export interface WeatherDataType {
  location?: {
    name?: string;
    country?: string;
    localtime?: string;
  };
  current?: {
    temp_c?: number;
    temp_f?: number;
    condition: {
      text?: string;
      icon?: string;
      code?: number;
    };
  };
}

export default function WeatherCard({
  weatherData,
}: {
  weatherData: WeatherDataType;
}) {
  if (!weatherData.location || !weatherData.current) return null;

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-zinc-800 dark:border-zinc-700 overflow-hidden">
      <div className="flex flex-col items-center pb-10 pt-6">
        {weatherData?.current?.condition?.icon ? (
          <Image
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={`https:${weatherData.current.condition.icon}`}
            alt={weatherData?.current?.condition?.text || "Weather icon"}
            width={96}
            height={96}
          />
        ) : null}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {weatherData.location.name}, {weatherData.location.country}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {weatherData.current.condition.text}
        </span>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {weatherData.current.temp_c}°C
          </div>
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
            {weatherData.current.temp_f}°F
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          {weatherData.location.localtime}
        </p>
      </div>
    </div>
  );
}
