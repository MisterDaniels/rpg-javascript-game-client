class Overworld {

    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
    }

    bindActionInput() {
        new KeyPressListener('Enter', () => {
            this.map.checkForActionCutscene();
        });
    }

    bindHeroPositionCheck() {
        document.addEventListener('PersonWalkingComplete', e => {
            if (e.detail.whoId === 'hero') {
                this.map.checkForTriggers();
            }
        });
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    init() {
        this.startMap(window.OverworldMaps.Kitchen);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction;

        this.startGameLoop();
        
        this.map.startCutscene([
            {
                type: 'textMessage',
                text: 'HELLO THERE!'
            }
        ]);

        /* this.map.startCutscene([
            {
                who: 'hero',
                type: 'walk',
                direction: 'down'
            },
            {
                who: 'hero',
                type: 'walk',
                direction: 'down'
            },
            {
                who: 'npcA',
                type: 'walk',
                direction: 'left'
            },
            {
                who: 'npcA',
                type: 'walk',
                direction: 'left'
            },
            {
                who: 'npcA',
                type: 'stand',
                direction: 'up',
                time: 800
            }
        ]); */
    }

    startGameLoop() {
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Estabilish the camera person
            const cameraPerson = this.map.gameObjects.hero;

            // Update all objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                });
            });

            this.map.drawLowerImage(this.ctx, cameraPerson);
            
            // Draw game objects
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y;
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson);
            });

            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step();
            });
        }

        step();
    }

}