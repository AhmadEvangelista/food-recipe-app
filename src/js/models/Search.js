import axios from 'axios';
import { proxy, app_key, app_id } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResult(query) {
    try {
      const res = await axios(
        `${proxy}https://api.edamam.com/search?app_key=${app_key}&app_id=${app_id}&q=${this.query}`
      );
      this.result = res.data.hits;
      // console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}
