class Combatant {

    constructor(config, battle) {
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        });

        this.battle = battle;
    }

    get healthPercentage() {
        const percentage = this.health / this.maxHealth * 100;
        return percentage > 0 ? percentage : 0;
    }

    createElement() {
        this.hudElement = document.createElement('div');
        this.hudElement.classList.add('Combatant');
        this.hudElement.setAttribute('combatant_id', this.id);
        this.hudElement.setAttribute('team_name', this.team);

        this.hudElement.innerHTML = (`
            <p class="name">${ this.name }</p>
            <p class="level"></p>
            <div class="character">
                <img alt="${ this.name }" src="${ this.src }" />
            </div>
            <img class="type" src="${ this.icon }" alt="${ this.type }" />
            <svg viewBox="0 0 26 3" class="health">
                <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
                <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
            </svg>
            <svg viewBox="0 0 26 2" class="experience">
                <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
                <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
            </svg>
            <p class="status"></p>
        `);

        this.healthFills = this.hudElement.querySelectorAll('.health > rect');
    }

    update(changes = {}) {
        Object.keys(changes).forEach(key => {
            this[key] = changes[key];
        });

        this.healthFills.forEach(rect => rect.style.width = `${ this.healthPercentage }%`);

        this.hudElement.querySelector('.level').innerText = this.level;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        this.update();
    }

}