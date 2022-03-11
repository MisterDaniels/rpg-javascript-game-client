class TextMessage {

    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('TextMessage');

        this.element.innerHTML = (`
            <p>${this.text}</p>
            <button>Next</Button>
        `);
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

}