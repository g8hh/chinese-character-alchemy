import ChineseCharacter from "../class/game/ChineseCharacter.js";
import useRelativePath from "../util/useRelativePath.js";

export interface RawGlyphData {
  glyph: string;
  strokeCount: number;
  shapes: string[];
}

const rawChineseCharactersDatas: RawGlyphData[] = JSON.parse(await (await fetch(useRelativePath("../../asset/data/datas.txt"))).text());
const chineseCharacters: ChineseCharacter[] = [];
const chineseCharactersMap: Map<string, ChineseCharacter> = new Map();

let idx = 0;
for (const rawGlyphData of rawChineseCharactersDatas) {
  const glyph = rawGlyphData.glyph;

  const chineseCharacter = new ChineseCharacter({
    index: idx,
    glyph,
    strokes: rawGlyphData.strokeCount
  });

  chineseCharacters.push(chineseCharacter);
  chineseCharactersMap.set(glyph, chineseCharacter);
  
  idx++;
}

for (const rawGlyphData of rawChineseCharactersDatas) {
  const chineseCharacter = chineseCharactersMap.get(rawGlyphData.glyph);
  if (typeof chineseCharacter === "undefined") continue;

  const shapes = rawGlyphData.shapes;
  for (const shape of shapes) {
    const shapeChineseCharacter = chineseCharactersMap.get(shape);
    if (typeof shapeChineseCharacter === "undefined") {
      console.log("missing shape", shape);
      continue;
    }
    chineseCharacter.addShape(shapeChineseCharacter);
    shapeChineseCharacter.addParent(chineseCharacter);
  }
}

export default chineseCharacters;
