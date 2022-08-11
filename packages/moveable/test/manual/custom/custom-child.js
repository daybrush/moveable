class CustomChildren extends HTMLElement {
    styleText = `
      .container {
        width: 100%;
        height: 100%;
      }
      `;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        const div = document.createElement('div');
        div.classList.add('container');
        style.textContent = this.styleText;
        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
    }
}
customElements.define('custom-children', CustomChildren);
