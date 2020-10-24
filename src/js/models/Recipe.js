import axios from 'axios';
import Search from './Search';
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
    const periods = Math.ceil(num / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
}
