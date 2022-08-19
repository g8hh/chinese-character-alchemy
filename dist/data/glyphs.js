import ChineseCharacter from "../class/game/ChineseCharacter.js";
const rawGlyphDatas = JSON.parse(await (await fetch("../asset/data/hanja.txt")).text());
const glyphDatas = [];
const glyphMap = [];
for (const rawGlyphData of rawGlyphDatas) {
    const shapes = rawGlyphData.shapes
        .map(shape => glyphMap.get(shape))
        // .filter(shape => typeof shape !== "undefined") as Glyph[];
        .filter(_ => true);
    const glyph = new ChineseCharacter({
        glyph: rawGlyphData.hanja,
        shapes,
        strokes: rawGlyphData.strokeCount
    });
    glyphDatas.push(glyph);
    glyphMap.set();
}
export default glyphDatas;
