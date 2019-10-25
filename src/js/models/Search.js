import axios from "axios";
import { key, proxy } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    try {
      const res = await axios(
        `${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`,
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
      console.log("something is broken");
    }
  }
}
