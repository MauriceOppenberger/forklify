import uniqid from "uniqid";

export default class List {
  constructor() {
    this.itmes = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.itmes.push(item);
    return item;
  }
  deleteItem(id) {
    const index = this.itmes.findIndex(el => el.id === id);
    this.itmes.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.itmes.find(el => el.id === id).count = newCount;
  }
}
