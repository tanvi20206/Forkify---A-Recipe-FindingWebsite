import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  /**
   *render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string if render is false, otherwise undefined
   * @this {Object} View instance
   * @author Tanvi
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;
    // recipeContainer.innerHTML = "";
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    // Create a new DOM parser
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Convert the new markup into an array of elements
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    // Convert the current markup into an array of elements
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    // Compare and update changed text content and attributes
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }
      // Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
        <div class ="spinner">
          <svg>
              <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> 
            `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> 
            `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
