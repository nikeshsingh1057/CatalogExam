const fs = require("fs");

function decodeValue(base, value) {
  let result = BigInt(0);
  const length = value.length;

  for (let i = 0; i < length; i++) {
    const char = value[length - 1 - i];
    const digit = parseInt(char, base);
    if (isNaN(digit)) {
      throw new Error(`Invalid character '${char}' for base ${base}`);
    }
    result += BigInt(digit) * BigInt(base) ** BigInt(i);
  }

  return result;
}

function lagrangeInterpolation(points) {
  let c = BigInt(0);
  const n = points.length;

  for (let i = 0; i < n; i++) {
    let [x_i, y_i] = points[i];
    let term = y_i;

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        term *=
          (BigInt(0 - points[j][0]) * BigInt(1)) / BigInt(x_i - points[j][0]);
      }
    }

    c += term;
  }

  return c;
}

function calculateSecret(jsonFile) {
  const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const n = data.keys.n;
  const k = data.keys.k;

  const points = [];

  for (let i = 1; i <= n; i++) {
    const base = parseInt(data[i].base);
    const value = data[i].value;

    try {
      const decodedY = decodeValue(base, value);
      points.push([parseInt(i), decodedY]);
    } catch (error) {
      console.error(`Error decoding value at key ${i}: ${error.message}`);
    }
  }

  const secretC = lagrangeInterpolation(points.slice(0, k));
  console.log(`The secret constant term c is: ${secretC.toString()}`);
}

calculateSecret("datajson.json");
