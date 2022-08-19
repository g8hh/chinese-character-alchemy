import useRelativePath from "../util/useRelativePath.js";
const datas = JSON.parse(await (await fetch(useRelativePath("../../asset/data/datas.txt"))).text());
export default function mergeDatas(mergeWith) {
    // Merge datas
    let newDatas = [...datas, ...mergeWith];
    // Filter duplicates
    const seenGlyphs = [];
    for (let i = 0; i < newDatas.length; i++) {
        const data = newDatas[i];
        const glyph = data.glyph;
        if (seenGlyphs.includes(glyph)) {
            newDatas.splice(i, 1);
            i--;
            continue;
        }
        seenGlyphs.push(glyph);
    }
    // Sort datas
    newDatas = newDatas.sort((a, b) => a.strokeCount - b.strokeCount);
    return newDatas;
}
