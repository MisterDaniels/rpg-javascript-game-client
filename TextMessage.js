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
            <p></p>
            <button>Next</Button>
        `);

        this.revealingText = new RevealingText({
            element: this.element.querySelector('.TextMessage p'),
            text: this.text
        });

        this.element.querySelector('button').addEventListener('click', () => {
            // Close the message
            this.done();
        });

        this.actionListener = new KeyPressListener('Enter', () => {
            this.done();
        });
    }

    done() {
        if (this.revealingText.isDone) {
            this.element.remove();
            this.actionListener.unbind();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();
    }

}