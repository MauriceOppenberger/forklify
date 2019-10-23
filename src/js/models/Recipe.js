import axios from "axios";
import { key, proxy } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      const data = res.data.recipe;
      this.title = data.title;
      this.author = data.publisher;
      this.img = data.image_url;
      this.url = data.source_url;
      this.ingredients = data.ingredients;
    } catch (error) {
      console.log(error);
      alert("uppps, something went wrong :(");
    }
  }
  calcTime() {
    //Assuming we nedd 15 min for 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngedients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];
    const newIngredients = this.ingredients.map(el => {
      // uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // parse ingedients into count, units and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        // There is no unit and No numb in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingedients
    this.ingredients.forEach(ing => {
      ing.count *= newServings / this.servings;
    });
    this.servings = newServings;
  }
}
