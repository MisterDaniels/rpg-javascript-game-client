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

        this.element.querySelector('button').addEventListener('click', () => {
            // Close the message
            this.done();
        });

        this.actionListener = new KeyPressListener('Enter', () => {
            this.actionListener.unbind();
            this.done();
        });
    }

    done() {
        this.element.remove();
        this.onComplete();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

}