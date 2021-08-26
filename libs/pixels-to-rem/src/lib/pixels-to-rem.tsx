export const convertToRem=(px:number |string)=> {
  let result = ``;
  let idleRem = 16;
  if (typeof px === "string") {
    result = `${parseInt(px) / idleRem}rem`;
  } else if (typeof px === "number") {
    result = `${px / idleRem}rem`;
  }
  return result;
}

export default convertToRem;

