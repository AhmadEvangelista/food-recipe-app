import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
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

    try {
      // 4 Search for recipes
      await state.search.getResult();
      // 5 Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Something wrong with the search.');
      clearLoader();
    }
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
const controlRecipe = async () => {
  try {
    const url = window.location.href;
    let res = url.split('recipe_');
    let id = res[1];
    if (id) {
      // Prepare UI for changes
      recipeView.clearRecipe();
      renderLoader(elements.recipe);
      // Highlight selected search item
      if (state.search) searchView.highlightSelected(id);
      // Create new recipe object
      state.recipe = new Recipe(id);

      try {
        // Get recipe data
        await state.recipe.getRecipe();
        // console.log(state.recipe.ingredient);
        state.recipe.parseIngredients();

        // Calculate serving and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // Render recipe
        clearLoader();
        console.log(state.recipe);
        recipeView.renderRecipe(state.recipe);
      } catch (error) {
        console.log(err);
        alert('Error processing recipe!');
      }
    }
  } catch (error) {}
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
      console.log('decrese');
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
    console.log('increase');
  }
  console.log(state.recipe);
});
