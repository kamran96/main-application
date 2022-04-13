export default function (px) {
  let result = ``;
  let type = typeof px;
  let idleRem = 16;
  if (type === 'string') {
    result = `${parseInt(px) / idleRem}rem`;
  } else if (type === 'number') {
    result = `${px / idleRem}rem`;
  }
  return result;
}
