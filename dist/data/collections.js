import Collection from "../class/game/Collection.js";
import chineseCharacters from "./chineseCharacters.js";
import array2D from "../util/array2D.js";
function itemsConverter(items) {
    return array2D.replace(items, (v) => {
        return chineseCharacters.find(c => c.glyph === v) ?? null;
    });
}
const rainbow = new Collection({
    name: "Rainbow",
    items: itemsConverter([
        ["  ", "  ", "  ", "虹", "  ", "  ", "  "],
        ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
        ["赤", "橙", "黃", "綠", "靑", "藍", "紫"],
        ["色", "色", "色", "色", "色", "色", "色"]
    ]),
});
const janggi = new Collection({
    name: "Janggi",
    items: itemsConverter([
        ["兵", "  ", "兵", "  ", "  ", "  ", "兵", "  ", "兵"],
        ["  ", "包", "  ", "  ", "  ", "  ", "  ", "包", "  "],
        ["  ", "  ", "  ", "  ", "漢", "  ", "  ", "  ", "  "],
        ["車", "象", "馬", "士", "  ", "士", "馬", "象", "車"]
    ]),
});
const tree = new Collection({
    name: "Tree",
    items: itemsConverter([
        ["  ", "梅", "  ", "桃", "  ", "柳", "  ", "竹", "  ", "槐"],
        ["松", "  ", "杏", "  ", "櫻", "  ", "桑", "  ", "柏", "  "],
    ]),
});
const birdCharacters = chineseCharacters.filter(c => c.glyph === "鳥" || c.shapes.some(c => c.glyph === "鳥")).map(c => c.glyph);
const bird = new Collection({
    name: "Bird",
    items: itemsConverter(array2D.create(9, 9, (x, y) => {
        const idx = x + y * 9;
        return birdCharacters[idx] ?? null;
    })),
});
const elements = new Collection({
    name: "Elements",
    items: itemsConverter([
        ["氫", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "氦"],
        ["鋰", "鈹", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "硼", "碳", "氮", "氧", "氟", "氖"],
        ["鈉", "鎂", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "鋁", "矽", "磷", "硫", "氯", "氬"],
        ["鉀", "鈣", "鈧", "鈦", "釩", "鉻", "錳", "鐵", "鈷", "鎳", "銅", "鋅", "鎵", "鍺", "砷", "硒", "溴", "氪"],
        ["銣", "鍶", "釔", "鋯", "鈮", "鉬", "鎝", "釕", "銠", "鈀", "銀", "鎘", "銦", "錫", "銻", "碲", "碘", "氙"],
        ["銫", "鋇", "  ", "鉿", "鉭", "鎢", "錸", "鋨", "銥", "鉑", "金", "汞", "鉈", "鉛", "鉍", "釙", "砈", "氡"],
        ["鍅", "鐳", "  ", "鑪", "𨧀", "𨭎", "𨨏", "𨭆", "䥑", "鐽", "錀", "鎶", "鉨", "鈇", "鏌", "鉝", "鿬", "鿫"],
        ["  ", "  ", "  ", "鑭", "鈰", "鐠", "釹", "鉕", "釤", "銪", "釓", "鋱", "鏑", "鈥", "鉺", "銩", "鐿", "鎦"],
        ["  ", "  ", "  ", "錒", "釷", "鏷", "鈾", "錼", "鈽", "鋂", "鋦", "鉳", "鉲", "鑀", "鐨", "鍆", "鍩", "鐒"]
    ]),
});
const tierCollections = Array.from({ length: 8 }, (_, i) => {
    const tier = i + 1;
    let collectionItems = chineseCharacters.filter(c => c.getTier() === tier);
    if (tier === 1)
        collectionItems.sort((a, b) => b.parents.length - a.parents.length);
    const collectionItemsCharacters = collectionItems.map(c => c.glyph);
    const size = Math.ceil(Math.sqrt(collectionItems.length));
    return new Collection({
        name: "Tier " + tier,
        items: itemsConverter(array2D.create(size, size, (x, y) => {
            const idx = x + y * size;
            return collectionItemsCharacters[idx] ?? null;
        })),
    });
});
export default [
    rainbow,
    janggi,
    tree,
    bird,
    elements,
    ...tierCollections,
];
