const emissionFactors = {
  car: 120,
  bus: 80,
  bike: 0,
  walk: 0,
  metro: 45
};

function calculateCarbon(distance,mode){

  const factor = emissionFactors[mode];

  return (distance/1000)*factor;

}

module.exports = calculateCarbon;