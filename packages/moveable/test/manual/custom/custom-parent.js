class CustomParent extends HTMLElement {
    styleText = `
      .card {
        width: 100%;
        height: 100%;
      }

      .card-header {
        width:100%;
        height: 80px;
        background-color: #3794FF;
      }

      .card-content {
        width: 100%;
        height: calc(100% - 80px);
        background-color: #EDF0F3;
        position: relative;
      }
      `;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <div class="card-header"></div>
        <div class="card-content">
          <slot></slot>
        </div>
      `;
        style.textContent = this.styleText;
        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
    }
}
customElements.define('custom-parent', CustomParent);
