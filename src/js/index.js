import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './view/searchView';
import { elements, renderLoader, clearLoader } from './view/base';
/*
~Search Object
~Current Recipe Object
~Shopping List Object
~Likes Recipes
*/
const state = {};
// Search Controller
const controlSearch = async () => {
  // 1 Get query from the view
  const query = searchView.getInput();
  if (query) {
    //   2 New search object and add to state
    state.search = new Search(query);
    // 3 Prepare  UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    // 4 Search for recipes
    await state.search.getResult();
    // 5 Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};
elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});
elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
// Recipe Controller
const r = new Recipe('09b4dbdf0c7244c462a4d2622d88958e');
r.getRecipe();
console.log(r);
// 09b4dbdf0c7244c462a4d2622d88958e
