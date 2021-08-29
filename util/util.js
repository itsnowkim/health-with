export const changeUnit = (weight, isLb) => {
  if (isLb) {
    return Math.round((parseFloat(weight) / 2.205) * 100) / 100
  }
  else {
    return Math.round((parseFloat(weight) * 2.205) * 100) / 100
  }
}