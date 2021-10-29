export const getFlag = (short: string) => {
    const data = require(`world_countries_lists/flags/24x24/${short.toLowerCase()}.png`);
    // for dumi
    if (typeof data === "string") {
      return data;
    }
    // for CRA
    return data.default;
  };