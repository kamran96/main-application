export default function (start: number, end: number) {
  let array = [];
  for (let index = start; index <= end; index++) {
    array.push(index);
  }

  return array;
}
