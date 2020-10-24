import axios from 'axios';
import { proxy, app_key, app_id } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}https://api.edamam.com/search?app_key=${app_key}&app_id=${app_id}&q=${this.query}`
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
}
