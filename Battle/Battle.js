class Battle {

    constructor() {
        this.combatants = {
            'player1': new Combatant({
                ...Pizzas.s001,
                team: 'player',
                health: 50,
                maxHealth: 50,
                experience: 0,
                level: 1,
                status: null
            }, this),
            'enemy1': new Combatant({
                ...Pizzas.v001,
                team: 'enemy',
                health: 50,
                maxHealth: 50,
                experience: 20,
                level: 1,
                status: null
            }, this),
            'enemy2': new Combatant({
                ...Pizzas.f001,
                team: 'enemy',
                health: 50,
                maxHealth: 50,
                experience: 30,
                level: 1,
                status: null
            }, this)
        };
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('Battle');
        this.element.innerHTML = (`
            <div class="Hero">
                <img src="${ '/images/characters/people/hero.png' }" alt="Hero" />
            </div>
            <div class="Enemy">
                <img src="${ '/images/characters/people/npc3.png' }" alt="Enemy" />
            </div>
        `);
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

}