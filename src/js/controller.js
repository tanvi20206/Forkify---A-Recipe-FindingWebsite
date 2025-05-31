import * as model from "./model.js";
import icons from "url:../img/icons.svg";
console.log(icons);
import searchView from "./views/searchView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeView from "./views/recipeView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

const recipeContainer = document.querySelector(".recipe");

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

//////////////////////////////////////////////////////
// const renderSpinner = function (parentEl) {
//   const markup = `
//     <div class ="spinner">
//       <svg>
//           <use href="${icons}#icon-loader"></use>
//       </svg>
//     </div>
//   `;
//   parentEl.innerHTML = "";
//   parentEl.insertAdjacentHTML("afterbegin", markup);
// };

// if(module.hot){
//   module.hot.accept();
// }
// const showRecipe = async function () {
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    // renderSpinner(recipeContainer);
    recipeView.renderSpinner();
    //0) Updating results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //1 Loading recipe
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    //const { recipe } = model.state;

    //   const res = await fetch(
    //     // "https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886"
    //     `https://forkify-api.jonas.io/api/v2/recipes/${id}`

    //   );
    //   const data =await res.json();

    //   if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    //  // console.log(res,data);
    //   let{recipe} = data.data;
    //   recipe ={
    //     id: recipe.id,
    //     title: recipe.title,
    //     publisher: recipe.publisher,
    //     sourceUrl: recipe.source_url,
    //     image:recipe.image_url,
    //     servings: recipe.servings,
    //     cookingTime: recipe.cooking_time,
    //     ingredients: recipe.ingredients,
    //   }
    //   console.log(recipe);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);

    // const markup = `
    //  <figure class="recipe__fig">
    //       <img src="${recipe.image}" alt="${
    //   recipe.title
    // }" class="recipe__img" />
    //       <h1 class="recipe__title">
    //         <span>${recipe.title}</span>
    //       </h1>
    //     </figure>

    //     <div class="recipe__details">
    //       <div class="recipe__info">
    //         <svg class="recipe__info-icon">
    //           <use href="${icons}#icon-clock"></use>
    //         </svg>
    //         <span class="recipe__info-data recipe__info-data--minutes">${
    //           recipe.cookingTime
    //         }</span>
    //         <span class="recipe__info-text">minutes</span>
    //       </div>
    //       <div class="recipe__info">
    //         <svg class="recipe__info-icon">
    //           <use href="${icons}#icon-users"></use>
    //         </svg>
    //         <span class="recipe__info-data recipe__info-data--people">${
    //           recipe.servings
    //         }</span>
    //         <span class="recipe__info-text">servings</span>

    //         <div class="recipe__info-buttons">
    //           <button class="btn--tiny btn--increase-servings">
    //             <svg>
    //               <use href="${icons}#icon-minus-circle"></use>
    //             </svg>
    //           </button>
    //           <button class="btn--tiny btn--increase-servings">
    //             <svg>
    //               <use href="${icons}#icon-plus-circle"></use>
    //             </svg>
    //           </button>
    //         </div>
    //       </div>

    //       <div class="recipe__user-generated">
    //         <svg>
    //           <use href="${icons}#icon-user"></use>
    //         </svg>
    //       </div>
    //       <button class="btn--round">
    //         <svg class="">
    //           <use href="${icons}#icon-bookmark-fill"></use>
    //         </svg>
    //       </button>
    //     </div>

    //     <div class="recipe__ingredients">
    //       <h2 class="heading--2">Recipe ingredients</h2>
    //       <ul class="recipe__ingredient-list">
    //          ${recipe.ingredients
    //            .map((ing) => {
    //              return `
    //               <li class="recipe__ingredient">
    //                 <svg class="recipe__icon">
    //                   <use href="${icons}#icon-check"></use>
    //                 </svg>
    //                 <div class="recipe__quantity">${ing.quantity}</div>
    //                 <div class="recipe__description">
    //                   <span class="recipe__unit">${ing.unit}</span>
    //                   ${ing.description}
    //                 </div>
    //               </li>
    //               `;
    //            })
    //            .join("")};

    //     </div>

    //     <div class="recipe__directions">
    //       <h2 class="heading--2">How to cook it</h2>
    //       <p class="recipe__directions-text">
    //         This recipe was carefully designed and tested by
    //         <span class="recipe__publisher">${
    //           recipe.publisher
    //         }</span>. Please check out
    //         directions at their website.
    //       </p>
    //       <a
    //         class="btn--small recipe__btn"
    //         href="${recipe.sourceUrl}"
    //         target="_blank"
    //       >
    //         <span>Directions</span>
    //         <svg class="search__icon">
    //           <use href="${icons}#icon-arrow-right"></use>
    //         </svg>
    //       </a>
    //     </div>
    // `;
    // recipeContainer.innerHTML = "";
    // recipeContainer.insertAdjacentHTML("afterbegin", markup);
    controlServings();
  } catch (err) {
    //alert(err);
    // recipeView.renderError(`${err} 💥💥💥💥`);
    recipeView.renderError();
  }
};

//controlRecipes();

// window.addEventListener('hashchange',showRecipe);
// window.addEventListener('load',showRecipe);

// ["hashchange", "load"].forEach((ev) => window.addEventListener(ev, controlRecipes));

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. get serach query
    const query = searchView.getQuery();
    if (!query) return;

    //2. load serach results
    await model.loadSearchResults(query);

    //3. render results
    //console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    console.log(model.getSearchResultsPage());
    // const pageResults = model.getSearchResultsPage();
    // console.log("🔎 Search results page:", pageResults);
    // console.log("✅ Is array:", Array.isArray(pageResults));

    resultsView.render(model.getSearchResultsPage());

    //4. render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1. render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //1. update the recipe servings (in state)
  model.updateServings(newServings);
  //2. update the recipe view
  recipeView.update(model.state.recipe);
  // recipeView.render(model.state.recipe);
};
// controlSearchResults();

const controlAddBookmark = function () {
  //1. Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2. Update recipe view
  recipeView.update(model.state.recipe);

  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //1. Show loading spinner
    addRecipeView.renderSpinner();

    //2. Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //3. Render recipe
    recipeView.render(model.state.recipe);

    //4. Success message
    addRecipeView.renderMessage();

    //5. Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //6. Change ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //7. Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    console.error("💥", err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
