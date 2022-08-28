import Collection from "../class/game/Collection.js";
import chineseCharacters from "./chineseCharacters.js";
import array2D from "../util/array2D.js";

function itemsConverter(items: string[][]) {
  return array2D.replace(items, (v) => {
    return chineseCharacters.find(c => c.glyph === v) ?? null;
  });
}

const radical1 = new Collection({
  name: "Radical 1",
  items: itemsConverter([
    ["一","丨","丶","丿","乙","亅","二","亠","人","儿","入","八"],
    ["冂","冖","冫","几","凵","刀","力","勹","匕","匚","匸","十"],
    ["卜","卩","厂","厶","又","口","囗","土","士","夂","夊","夕"],
    ["大","女","子","宀","寸","小","尢","尸","屮","山","巛","工"],
    ["己","巾","干","幺","广","廴","廾","弋","弓","彐","彡","彳"],
    ["心","戈","戶","手","支","攴","文","斗","斤","方","无","日"],
    ["曰","月","木","欠","止","歹","殳","毋","比","毛","氏","气"],
    ["水","火","爪","父","爻","爿","片","牙","牛","犬","玄","玉"],
    ["瓜","瓦","甘","生","用","田","疋","疒","癶","白","皮","皿"],
    ["目","矛","矢","石","示","禸","禾","穴","立","竹","米","糸"],
    ["缶","网","羊","羽","老","而","耒","耳","聿","肉","臣","自"],
    ["至","臼","舌","舛","舟","艮","色","艸","虍","虫","血","行"],
    ["衣","襾","見","角","言","谷","豆","豕","豸","貝","赤","走"],
    ["足","身","車","辛","辰","辵","邑","酉","釆","里","金","長"],
    ["門","阜","隶","隹","雨","靑","非","面","革","韋","韭","音"],
    ["頁","風","飛","食","首","香","馬","骨","高","髟","鬥","鬯"],
    ["鬲","鬼","魚","鳥","鹵","鹿","麥","麻","黃","黍","黑","黹"],
    ["黽","鼎","鼓","鼠","鼻","齊","齒","龍","龜","龠","  ","  "]
  ]),
});
const radical2 = new Collection({
  name: "Radical 2",
  items: itemsConverter([
    ["  ","  ","  ","  ","  ","  ","  ","  ","亻","  ","  ","  "],
    ["  ","  ","  ","  ","  ","刂","  ","  ","  ","  ","  ","  "],
    ["  ","㔾","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","兀","  ","  ","  ","川","  "],
    ["  ","  ","  ","  ","  ","  ","  ","  ","  ","彑","  ","  "],
    ["忄","  ","  ","扌","  ","攵","  ","  ","  ","  ","旡","  "],
    ["  ","  ","  ","  ","  ","歺","  ","  ","  ","  ","  ","  "],
    ["氵","灬","爫","  ","  ","  ","  ","  ","牜","犭","  ","王"],
    ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","礻","  ","  ","  ","  ","  ","  ","  "],
    ["  ","罒","  ","  ","耂","  ","  ","  ","  ","月","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  ","艹","  ","  ","  ","  "],
    ["衤","西","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","辶","⻏","  ","采","  ","  ","镸"],
    ["  ","阝","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","飠","  ","  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  ","  "]
  ]),
});

const number = new Collection({
  name: "Number",
  items: itemsConverter([
    ["一", "二", "三", "四", "五", "六", "七", "八", "九", "  ", "  ", "  ", "  ", "  ", "  "],
    ["壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["萬", "億", "兆", "京", "秭", "穰", "溝", "澗", "正", "載", "極", "阿", "那", "不", "無"],
    ["万", "亿", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "僧", "由", "可", "量"],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "祇", "他", "思", "大"],
    ["〇", "十", "百", "千", "姟", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "議", "數"],
    ["零", "拾", "佰", "仟", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["廿", "卅", "卌", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["卄", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["念", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "]
  ]),
});

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
    ["車", "象", "馬", "士", "  ", "士", "馬", "象", "車"],
    ["  ", "  ", "  ", "  ", "漢", "  ", "  ", "  ", "  "],
    ["  ", "包", "  ", "  ", "  ", "  ", "  ", "包", "  "],
    ["兵", "  ", "兵", "  ", "  ", "  ", "兵", "  ", "兵"],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["卒", "  ", "卒", "  ", "  ", "  ", "卒", "  ", "卒"],
    ["  ", "包", "  ", "  ", "  ", "  ", "  ", "包", "  "],
    ["  ", "  ", "  ", "  ", "楚", "  ", "  ", "  ", "  "],
    ["車", "象", "馬", "士", "  ", "士", "馬", "象", "車"],
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
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "鑭", "鈰", "鐠", "釹", "鉕", "釤", "銪", "釓", "鋱", "鏑", "鈥", "鉺", "銩", "鐿", "鎦"],
    ["  ", "  ", "  ", "錒", "釷", "鏷", "鈾", "錼", "鈽", "鋂", "鋦", "鉳", "鉲", "鑀", "鐨", "鍆", "鍩", "鐒"]
  ]),
});

const tierCollections = Array.from({ length: 8 }, (_, i) => {
  const tier = i + 1;
  let collectionItems = chineseCharacters.filter(c => c.getTier() === tier);
  if (tier === 1) collectionItems.sort((a, b) => b.parents.length - a.parents.length);
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
  radical1,
  radical2,
  number,
  rainbow,
  janggi,
  tree,
  bird,
  elements,
  ...tierCollections,
];
