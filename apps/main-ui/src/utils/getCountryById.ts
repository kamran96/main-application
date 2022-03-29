import en from 'world_countries_lists/data/en/countries.json';

export const getCountryById = (id: string) => {
  const [filterCountry] = en?.filter((country) => country?.id === parseInt(id));

  return filterCountry;
};
