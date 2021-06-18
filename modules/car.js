const car = {
    brand: "Ford",
    color: "blue",
  };
  
  exports.name = "Kruger";
  
  exports.getColor = function () {
    return car.color;
  };
  
  exports.setColor = function (color) {
    if (color == "Yellow" || color == "Red") {
      car.color = color;
    }
  };
  