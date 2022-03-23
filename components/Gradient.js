function generateRandom() {
  const color1 = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16)})
  const color2 = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16)})
  const deg    = `${Math.floor(Math.random()*180)}deg`

  return `linear-gradient(${deg}, ${color1}, ${color2})`
}

export default generateRandom
