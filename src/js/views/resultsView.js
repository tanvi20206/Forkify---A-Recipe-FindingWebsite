import View from "./View.js";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView.js";
class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "NO recipes found for your query! Please try again ;)";
  _message = "";
  // _generateMarkup() {
  //   console.log(this._data);
  //   return this._data.map(this._generateMarkupPreview).join("");
  // }

  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   // console.log(id);
  //   return `
  //   <li class="preview">
  //          <a class="preview__link ${
  //            result.id === id ? "preview__link--active" : ""
  //          }" href="#${result.id}">
  //            <figure class="preview__fig">
  //              <img src="${result.image}" alt="Test" />
  //            </figure>
  //            <div class="preview__data">
  //              <h4 class="preview__title">${result.title}</h4>
  //              <p class="preview__publisher">${result.publisher}</p>

  //            </div>
  //          </a>
  //        </li>
  //  `;
  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}
export default new ResultsView();
