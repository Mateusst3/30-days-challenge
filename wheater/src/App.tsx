import {
  faLocationDot,
  faMagnifyingGlass,
  faMoon,
  faSun,
  faTemperatureThreeQuarters,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import LocationProps from "./interfaces/LocationProps";
import ReactLoading from "react-loading";

export default function App() {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [wheater, setWheater] = useState<string | undefined>(undefined);
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [windSpeed, setWindSpeed] = useState<number | undefined>(undefined);
  const [isDay, setIsDay] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function getWeatherCondition(code) {
    if (code >= 0 && code <= 2) {
      return "clear";
    } else if (code >= 3 && code <= 9) {
      return "cloud";
    } else if (code >= 10 && code <= 12) {
      return "mist";
    } else if (
      (code >= 13 && code <= 19) ||
      (code >= 20 && code <= 29) ||
      (code >= 60 && code <= 69) ||
      (code >= 80 && code <= 84) ||
      (code >= 91 && code <= 99)
    ) {
      return "rain";
    } else if (
      code === 22 ||
      code === 23 ||
      code === 25 ||
      code === 26 ||
      code === 29 ||
      code === 68 ||
      code === 69 ||
      code === 85 ||
      code === 86
    ) {
      return "snow";
    } else {
      return "unknown";
    }
  }

  const fetchData = async () => {
    setIsLoading(true);
    await fetch(
      `https://nominatim.openstreetmap.org/search?q=${address}&format=json`
    ).then((response: any) =>
      response.json().then(async (resp: Array<LocationProps>) => {
        await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${resp[0].lat}&longitude=${resp[0].lon}&current_weather=true`
        ).then((response) =>
          response.json().then((resp: any) => {
            // console.log(resp)
            setWheater(getWeatherCondition(resp.current_weather.weathercode));
            setTemperature(resp.current_weather.temperature);
            setWindSpeed(resp.current_weather.windspeed);
            setIsDay(resp.current_weather.is_day === 1 ? true : false);
            setIsInitial(false);
            setIsLoading(false);
          })
        );
      })
    );
  };

  return (
    <div className="w-screen h-screen bg-blue-700 flex items-center justify-center">
      <div className="w-auto h-auto p-3 gap-5 bg-white flex flex-col items-center justify-center rounded-2xl">
        <section className="w-auto h-auto p-2 flex flex-row items-center justify-center gap-2">
          <FontAwesomeIcon icon={faLocationDot} />
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-lg border-2 px-2 py-1 border-blue-950"
            placeholder="Location"
          />
          <button
            className="w-full h-full rounded-full p-2 flex items-center justify-center bg-blue-200 hover:bg-blue-400"
            onClick={fetchData}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </section>
        {isLoading ? (
          <>
            <ReactLoading
              type={"spinningBubbles"}
              color={"#172554d9"}
              height={"20%"}
              width={"20%"}
            />
          </>
        ) : (
          <>
            {isInitial ? (
              <></>
            ) : (
              <section className="w-auto h-auto flex flex-col items-center justify-center gap-2">
                <h4 className="text-5xl text-blue-950">
                  {temperature}
                  {"°c "}
                  <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
                </h4>
                <p className="text-3xl text-blue-950">{wheater}</p>
                <img src={`/${wheater}.png`} alt="" className="w-80 h-auto" />
                <section className="w-full h-auto flex flex-row items-center justify-around pt-5">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faWind} className="h-11" />
                    <div className="flex flex-col">
                      <p className="text-lg text-blue-950">
                        {windSpeed}
                        {" Km/H"}
                      </p>
                      <p className="text-lg text-blue-950">{"Wind speed"}</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2">
                    <FontAwesomeIcon
                      icon={isDay ? faSun : faMoon}
                      className="h-11"
                    />
                    <p className="text-xl text-blue-950">
                      {isDay ? "Day" : "Night"}
                    </p>
                  </div>
                </section>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
