import { LitElement, html, css } from 'lit-element';
import './smart-word.js';
import './smart-suggest.js';

class SmartInput extends LitElement {
  static get properties() {
    return {
      contentString: { type: String },
      contentHtml: { type: Function },
      typeAheadString: { type: String },
      isReadyToAcceptSuggestion: { type: Boolean },
    };
  }

  // createRenderRoot() {
  //   return this;
  // }

  constructor() {
    super();
    this.contentString = '';
    this.contentHtml = document.createElement('div');
    this.typeAheadString = 'type ahead';
    this.readyToAcceptSuggestion = false;
  }

  get contentString() {
    return this._contentString;
  }

  set contentString(content) {
    if (content === this._contentString) return;
    const old = this._contentString;
    this._contentString = content;

    if (this.ready) this.updateContent();

    this.requestUpdate('contentString', old);
  }

  handleClick(e) {
    if (e.composedPath()[0].tagName === 'SMART-SUGGEST') {
      this.acceptSuggestion();
    }
    // assume "component" is DOM element
    // you may need to modify currentCaretPosition, see "Little Details"    section below
    var position = this.getCaretPosition(this.$editor);
    console.log(position);
    if (this.contentString && position >= this.contentString.length) {
      var data = this.getCaretData(this.$editor, position);
      this.setCaretPosition(data);
    }
  }

  handleInput(e) {
    this.contentString = e.target.textContent;
  }

  handleKeydown(e) {
    if (e.key !== 'Tab' && e.key !== 'ArrowRight') return;
    if (!this.isReadyToAcceptSuggestion) return;

    e.preventDefault();
    this.acceptSuggestion();
  }

  handleKeyup(e) {
    console.log('up');
    // assume "component" is DOM element
    // you may need to modify currentCaretPosition, see "Little Details"    section below
    var position = this.getCaretPosition(this.$editor);
    this.isReadyToAcceptSuggestion = position === this.contentString.length;
    console.log(this.isReadyToAcceptSuggestion);
  }

  acceptSuggestion() {
    const suggestion = this.typeAheadString.replace(this.contentString, '');
    this.acceptSuggestionOffset = suggestion.length;
    this.contentString += suggestion;
  }

  updateContent() {
    console.log(this.contentString);
    let innerHTML = this.contentString;
    innerHTML = this.processContentForWordReplacements(innerHTML);
    innerHTML = this.processContentForSuggestion(innerHTML);
    console.log(innerHTML);
    // assume "component" is DOM element
    // you may need to modify currentCaretPosition, see "Little Details"    section below
    var position = this.getCaretPosition(this.$editor);
    console.log('offset', this.acceptSuggestionOffset, position);
    position += this.acceptSuggestionOffset || 0;
    this.acceptSuggestionOffset = 0;
    this.isReadyToAcceptSuggestion = position === this.contentString.length;
    this.$editor.innerHTML = innerHTML;
    if (!innerHTML.length) return;
    var data = this.getCaretData(this.$editor, position);
    console.log(data);
    this.setCaretPosition(data);
  }

  processContentForWordReplacements(innerHTML) {
    return innerHTML.replace('help','<smart-word initialword="help" contenteditable="true">help</smart-word>');
  }

  processContentForSuggestion(innerHTML) {
    const textContent = this.contentString.replace('\u00A0', ' ');
    if (innerHTML.length && this.typeAheadString.startsWith(textContent)) {
      let suggestion = this.typeAheadString.replace(textContent, '');
      if (!!suggestion.length) {
        if (suggestion[0] === ' ') suggestion = suggestion.replace(' ', '\u00A0');;
        innerHTML += `<smart-suggest notouch contenteditable="false" suggestion="${suggestion}"></smart-suggest>`;
      }
    }
    return innerHTML;
  }

  getCaretPosition(el){
    var caretOffset = 0, sel;
    if (typeof this.shadowRoot.getSelection !== "undefined") {
      var range = this.shadowRoot.getSelection().getRangeAt(0);
      var selected = range.toString().length;
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(el);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length - selected;
    }
    return caretOffset;
  }

  getAllTextnodes(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
  }
  getCaretData(el, position){
    var node;
    var nodes = this.getAllTextnodes(el);
    for(var n = 0; n < nodes.length; n++) {
      if (position > nodes[n].nodeValue.length && nodes[n+1]) {
        // remove amount from the position, go to next node
        position -= nodes[n].nodeValue.length;
      } else {
        node = nodes[n];
        break;
      }
    }
    // you'll need the node and the position (offset) to set the caret
    return { node: node, position: position };
  }

  // setting the caret with this info  is also standard
  setCaretPosition(d){
    var sel = this.shadowRoot.getSelection();
    let range = document.createRange();
    range.setStart(d.node, d.position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  pointCaretTo() {
    // assume "component" is DOM element
    // you may need to modify currentCaretPosition, see "Little Details"    section below
    var data = this.getCaretData(this.$editor, this.getCaretPosition(this.$editor));
    this.setCaretPosition(data);
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 200px;
          height: 50px;
          margin: 20px;
        }
        div {
          float: left;
          width: 100%;
          height: 100%;
          border: 1px solid;
        }
        smart-suggest {
          opacity: 0.6;
          user-select: none;
          cursor: pointer;
        }
        smart-word {
          border-bottom: 1px solid red;
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        id="editor"
        contenteditable="true"
        @input="${this.handleInput}"
        @click="${this.handleClick}"
        @keydown="${this.handleKeydown}"
        @keyup="${this.handleKeyup}"
      ></div>
      <textarea>${this.contentString}</textarea>
      <button @click=${this.pointCaretTo}>Test</button>
    `;
  }

  firstUpdated() {
    this.ready = true;
    this.$editor = this.shadowRoot.querySelector('#editor');
  }
}

customElements.define('smart-input', SmartInput);
