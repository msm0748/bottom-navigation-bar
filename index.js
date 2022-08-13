function 가까운수찾기(x, roate) {
  const arr = x;
  const currnet = roate;

  return arr.reduce(function (prev, curr) {
    return Math.abs(curr - currnet) < Math.abs(prev - currnet) ? curr : prev;
  });
}

const a = 가까운수찾기([-180, 180], -225);
console.log(a);
