const fs = require("fs");
const path = require("path");

async function run() {
  const input = fs
    .readFileSync(path.join(__dirname, "./input.txt"), "utf8")
    .trim();

  await solveForFirstStar(input);
  await solveForSecondStar(input);
}

function parseGames(input) {
  const lines = input.split("\n");
  const games = lines.map(parserGameLine);
  return games;
}

// Game 12: 13 green, 2 red, 2 blue; 1 red, 6 green; 5 green, 3 red, 8 blue
function parserGameLine(line) {
  const [game, cards] = line.split(": ");
  const gameId = parseInt(game.split(" ")[1]);
  const sets = cards.split(";").map(parseGameSet);
  const maximums = sets.reduce((maximums, set) => {
    Object.keys(set.colors).forEach((color) => {
      maximums[color] = Math.max(maximums[color] || 0, set.colors[color]);
    });
    return maximums;
  }, {});
  const power = Object.values(maximums).reduce((power, value) => {
    return power * value;
  }, 1);
  return { game, gameId, sets, maximums, power };
}

function parseGameSet(set) {
  const picks = set.split(",").map(parsePick);
  const colors = picks.reduce((colors, pick) => {
    colors[pick.color] = (colors[pick.color] || 0) + pick.count;
    return colors;
  }, {});
  return { colors };
}

function parsePick(pick) {
  const [count, color] = pick.trim().split(" ");
  return { count: parseInt(count), color };
}

async function solveForFirstStar(input) {
  const games = parseGames(input);

  const limits = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const validGames = games.filter((game) => {
    return Object.keys(game.maximums).every((color) => {
      return game.maximums[color] <= limits[color];
    });
  });

  const sumOfValidGameIds = validGames.reduce((sum, game) => {
    return sum + game.gameId;
  }, 0);

  console.log("Valid games:", validGames.length, "out of", games.length);

  const solution = sumOfValidGameIds;
  console.log("Solution 1:", solution);
}

async function solveForSecondStar(input) {
  const games = parseGames(input);
  const sumOfPowers = games.reduce((sum, game) => {
    return sum + game.power;
  }, 0);

  const solution = sumOfPowers;
  console.log("Solution 2:", solution);
}

run();
