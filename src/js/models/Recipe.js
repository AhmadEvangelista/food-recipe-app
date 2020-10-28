import axios from 'axios';
import { proxy, app_key, app_id } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}https://api.edamam.com/search?app_key=${app_key}&app_id=${app_id}&q=${this.id}`
      );
      const lght = res.data.hits.length - 1;
      this.title = res.data.hits[lght].recipe.label;
      this.author = res.data.hits[lght].recipe.source;
      this.img = res.data.hits[lght].recipe.image;
      this.url = res.data.hits[lght].recipe.url;
      this.ingredient = res.data.hits[lght].recipe.ingredientLines;
    } catch (error) {
      console.log(error);
      alert('Something went wrong :(');
    }
  }
  calcTime() {
    const numIng = this.ingredient.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const units = [...unitsShort, 'kg', 'g'];
    const newIngredients = this.ingredient.map((el) => {
      // 1 Uniform units
      let ingredients = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredients = ingredients.replace(unit, unitsShort[i]);
      });
      // 2 Remove parenthesis
      ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');
      // 3 Parse ingredients into, unit and ingredient
      const arrIng = ingredients.split(' ');
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // there is no unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // There is no unit and No number in 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }
      return objIng;
    });
    this.ingredient = newIngredients;
  }
  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    // Ingredients
    this.ingredient.forEach((ing) => {
      ing.count *=( newServings / this.servings);
    });
    this.servings = newServings;
  }
}
