import Collection from "../class/game/Collection.js";
import chineseCharacters from "./chineseCharacters.js";
import array2D from "../util/array2D.js";

function itemsConverter(items: string[][]) {
  return array2D.replace(items, (v) => {
    return chineseCharacters.find(c => c.glyph === v) ?? null;
  });
}

const testCollection = new Collection({
  name: "Test",
  items: itemsConverter([
    ["大", "土", "舟"],
    ["芎", "广", "  "],
    ["  ", "  ", "木"]
  ]),
});

export default [
  testCollection
];
