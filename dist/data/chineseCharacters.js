import ChineseCharacter from "../class/game/ChineseCharacter.js";
import useRelativePath from "../util/useRelativePath.js";
const rawChineseCharactersDatas = JSON.parse(await (await fetch(useRelativePath("../../asset/data/datas.txt"))).text());
const chineseCharacters = [];
const chineseCharactersMap = new Map();
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
let missings = "";
for (const rawGlyphData of rawChineseCharactersDatas) {
    const chineseCharacter = chineseCharactersMap.get(rawGlyphData.glyph);
    if (typeof chineseCharacter === "undefined")
        continue;
    const shapes = rawGlyphData.shapes;
    for (const shape of shapes) {
        const shapeChineseCharacter = chineseCharactersMap.get(shape);
        if (typeof shapeChineseCharacter === "undefined") {
            console.log("missing shape", shape);
            missings += shape;
            continue;
        }
        chineseCharacter.addShape(shapeChineseCharacter);
        shapeChineseCharacter.addParent(chineseCharacter);
    }
}
if (missings !== "")
    console.log([...new Set(Array.from(missings))].join(""));
export default chineseCharacters;
