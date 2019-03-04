import { LitElement, html, css } from 'lit-element';

class SmartSuggest extends LitElement {
  static get properties() {
    return {
      suggestion: {type: String},
    };
  }
  constructor() {
    super();
    this.suggestion = '';
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
      ${this.suggestion}
    `;
  }
}

customElements.define('smart-suggest', SmartSuggest);
