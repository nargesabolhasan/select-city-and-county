import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { iranstatesURL } from "../constant/urls";

const CityCountyForm = () => {
  const [response, setResponse] = useState({});
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counties, setCounties] = useState([]);
  const [isCountyDisabled, setIsCountyDisabled] = useState(true);

  const schema = Yup.object().shape({
    city: Yup.string().required("حتما شهر محل زندگی خود را وارد کنید"),
    county: Yup.string().required("حتما شهرستان محل زندگی خود را وارد کنید"),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getCity = async () => {
    try {
      const response = await fetch(iranstatesURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResponse({ ...data });
      setCities([...Object.keys(data)]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const handleCityChange = (city) => {
    setCounties(response[city] || []);
    setIsCountyDisabled(!city);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[300px] mx-auto mt-10 space-y-4"
      dir="rtl"
    >
      <h3 className="text-lg text-center font-medium text-gray-700x">
        محل زندگی شما :
      </h3>
      <div>
        {!loading ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">شهر</label>
              <select
                {...register("city")}
                onChange={(e) => handleCityChange(e.target.value)}
                className="bg-pink-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {cities.map((city, index) => (
                  <option
                    key={`city-${index}`}
                    value={city}
                    className="text-sm font-Select a Countymedium text-gray-700"
                  >
                    {city}
                  </option>
                ))}
              </select>
              {errors?.city && (
                <p className="text-sm text-red-500">{errors?.city.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                شهرستان
              </label>

              <select
                {...register("county")}
                disabled={isCountyDisabled}
                className="bg-pink-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-400"
              >
                <option value="">یک مورد انتخاب کنید</option>
                {counties.map((county, index) => (
                  <option
                    key={`county-${index}`}
                    value={county}
                    className="text-sm font-medium text-gray-700"
                  >
                    {county}
                  </option>
                ))}
              </select>

              {errors?.county && (
                <p className="text-sm text-red-500">{errors?.county.message}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">loading</div>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default CityCountyForm;
