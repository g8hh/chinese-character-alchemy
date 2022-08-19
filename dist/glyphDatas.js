const glyphDatas = JSON.parse(await (await fetch("../asset/data/hanja.txt")).text());
export default glyphDatas;
