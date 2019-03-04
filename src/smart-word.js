import { LitElement, html, css } from 'lit-element';

class SmartWord extends LitElement {
  static get properties() {
    return {
      initialWord: {type: String},
      currentWord: {type: String},
      alternativeWords: {type:Array}
    };
  }
  get initialWord() {
    return this._initialWord;
  }
  set initialWord(word) {
    this._initialWord = word;
    if (!this.currentWord) this.currentWord = word;
  }
  get currentWord() {
    return this._currentWord
  }
  set currentWord(word) {
    this._currentWord = word;
    this.textContent = word;
  }
  handleContextmenu(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('smart-challenge', {
      bubbles: 1,
      composed: 1,
      detail: {
        initialWord: this.initialWord,
        currentWord: this.currentWord,
        alternativeWords: this.alternativeWords,
      }
    }))
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          cursor: pointer;
        }
      `,
    ];
  }

  render() {
    return html`
      <span
        @contextmenu=${this.handleContextmenu}
      ><slot></slot></span>
    `;
  }
}

customElements.define('smart-word', SmartWord);
