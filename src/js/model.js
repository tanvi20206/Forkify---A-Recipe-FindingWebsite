import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
//import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings || 1,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Optional chaining for key
    // bookmarked: state.bookmarks.some((b) => b.id === recipe.id),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    //  const res = await fetch(`${API_URL}/${id}`);
    //         // // "https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886"
    //         // `https://forkify-api.jonas.io/api/v2/recipes/${id}`

    //    // );
    //     const data =await res.json();

    //     if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    // console.log(res,data);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some((b) => b.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    console.log(state.recipe);
  } catch (err) {
    //alert(err);
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }), // Optional chaining for key
      };
    });
    state.search.page = 1; // Reset page to 1
    // console.log(state.search.results);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// loadSearchResults("pizza");

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage;
  console.log(start, end);
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  newServings = Number(newServings);
  if (!newServings || newServings < 1) return;
  state.recipe.ingredients.forEach((ing) => {
    // newQunatity = oldQunatity * newServings / oldServings 2*8/4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
  console.log(state.recipe);
};

// export const addBookmark = function (recipe) {
//   // Add bookmark
//   state.bookmarks.push(recipe);
//   // Mark current recipe as bookmarked
//   if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

//   console.log(recipe);
//   console.log(state.bookmarks);
//   console.log(state.recipe);
//   //persistBookmarks();
// };

// export const deleteBookmark = function (id) {
//   // Delete bookmark
//   const index = state.bookmarks.findIndex((el) => el.id === id);
//   state.bookmarks.splice(index, 1);
//   // Mark current recipe as NOT bookmarked
//   if (id === state.recipe.id) state.recipe.bookmarked = false;

//   console.log(state.bookmarks);
// };

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Clone recipe and set bookmarked
  const newRecipe = { ...recipe, bookmarked: true };

  // Add to bookmarks
  state.bookmarks.push(newRecipe);

  // Update current recipe only if it matches
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
  console.log("Bookmark added:");
  console.log("Bookmarks Array: ", state.bookmarks);
  console.log("Current Recipe: ", state.recipe);
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  if (index !== -1) state.bookmarks.splice(index, 1);

  // Update current recipe
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
  console.log("Bookmark removed:");
  console.log("Bookmarks Array: ", state.bookmarks);
  console.log("Current Recipe: ", state.recipe);
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
  console.log("Initial bookmarks loaded:", state.bookmarks);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks(); // Uncomment to clear bookmarks for testing
export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());

        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format."
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients: ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    // console.error("Error in uploadRecipe:", err);
    throw err;
  }
};