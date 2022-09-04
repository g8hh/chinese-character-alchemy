import array2D from "../../util/array2D.js";
import type ChineseCharacterList from "./ChineseCharacterList.js";
import type ChineseCharacter from "./ChineseCharacter.js";

type CollectionItems = (ChineseCharacter | null)[][];
interface CollectionOptions {
  name: string;
  items: CollectionItems;
  hintCount?: number;
}

export default class Collection {
  readonly name: string;
  readonly items: CollectionItems;
  hintCount: number;

  constructor(options: CollectionOptions) {
    this.name = options.name;
    this.items = options.items;
    this.hintCount = options.hintCount ?? 1;
  }

  getUnlocked(list: ChineseCharacterList): (boolean | null)[][] {
    const unlocked = list.unlocked;
    
    return array2D.replace(this.items, (c) => {
      return c !== null ? unlocked.includes(c.index) : c;
    });
  }

  getProgress(list: ChineseCharacterList): [cur: number, goal: number] {
    const unlockedList = this.getUnlocked(list);
    const filtered = unlockedList.flat().filter(v => v !== null) as boolean[];
    return [filtered.reduce((a, b) => a + (b ? 1 : 0), 0), filtered.length];
  }
}
