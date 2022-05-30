class Combatant {

    constructor(config, battle) {
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        });

        this.battle = battle;
    }

    createElement() {
        this.hudElement = document.createElement('div');
        this.hudElement.classList.add('Combatant');
        this.hudElement.setAttribute('combatant_id', this.id);
        this.hudElement.setAttribute('team_name', this.team);
    }

    init() {

    }

}