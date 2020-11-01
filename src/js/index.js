import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import { elements, renderLoader, clearLoader } from './view/base';
/*
~Search Object
~Current Recipe Object
~Shopping List Object
~Likes Recipes
*/
const state = {};
window.state = state;

// Search Controller
const controlSearch = async () => {
  // 1 Get query from the view
  const query = searchView.getInput();

  if (query) {
    // 2 New search object and add to state
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
      // alert('Something wrong with the search.');
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
        recipeView.renderRecipe(
          state.recipe,
          state.likes.isLiked(state.recipe.id)
        );
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

// List Controller
const controlList = () => {
  // Create a new list IF there is none yet
  if (!state.list) state.list = new List();
  // Add each ingredient to the list and ui
  state.recipe.ingredient.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};
// Handle dedlete and update list item events
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete form ui
    listView.deleteItem(id);
    // Handle the update
  } else if (e.target.matches('.shopping__count--value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Like Controller
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add like to UI list
    likesView.renderLike(newLike);
    // User has liked current recipe
  } else {
    // Remove like to the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like to UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};
// Restore like recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  // Restore Likes
  state.likes.readStorage();
  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render existing likes
  state.likes.likes.forEach((likes) => likesView.renderLike(likes));
});
// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});

window.l = new List();
