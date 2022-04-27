
class OverworldMap {

    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};
        this.triggers = config.triggers || {};
        
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage, 
            utils.withGrid(10.5) - cameraPerson.x, 
            utils.withGrid(6) - cameraPerson.y
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage, 
            utils.withGrid(10.5) - cameraPerson.x, 
            utils.withGrid(6) - cameraPerson.y
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key];
            object.id = key;

            // TODO: Determine if this object should actually mount
            
            object.mount(this);
        });
    }

    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x, y) {
        delete this.walls[`${x},${y}`];
    }

    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        
        const {x, y} = utils.nextPosition(wasX, wasY, direction);

        this.addWall(x, y);
    }

    checkForActionCutscene() {
        const hero = this.gameObjects['hero'];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${ object.x },${ object.y }` === `${ nextCoords.x },${ nextCoords.y }`;
        });

        if (!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events);
        }
    }

    checkForTriggers() {
        const hero = this.gameObjects['hero'];
        const match = this.triggers[`${ hero.x },${ hero.y }`];

        if (!this.isCutscenePlaying && match) {
            this.startCutscene( match[0].events );
        }
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        // Start a loop of async events
        // await each one
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this
            });

            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        // Reset NPCs to do their idle behavior
        Object.values(this.gameObjects).forEach((object) => {
            object.doBehaviorEvent(this);
        });
    }

}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: '/images/maps/DemoLower.png',
        upperSrc: '/images/maps/DemoUpper.png',
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6)
            }),
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: '/images/characters/people/npc1.png',
                behaviorLoop: [
                    {
                        type: 'stand',
                        direction: 'left',
                        time: 800
                    },
                    {
                        type: 'stand',
                        direction: 'up',
                        time: 800
                    },
                    {
                        type: 'stand',
                        direction: 'right',
                        time: 1200
                    },
                    {
                        type: 'stand',
                        direction: 'up',
                        time: 300
                    }
                ],
                talking: [
                    {
                        events: [
                            {
                                type: 'textMessage',
                                text: 'Whaaat...',
                                faceHero: 'npcA'
                            },
                            {
                                type: 'textMessage',
                                text: 'Get out dude!'
                            },
                            {
                                type: 'walk',
                                who: 'hero',
                                direction: 'up'
                            }
                        ]
                    }
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(3),
                y: utils.withGrid(7),
                src: '/images/characters/people/npc2.png',
                behaviorLoop: [
                    {
                        type: 'walk',
                        direction: 'left'
                    },
                    {
                        type: 'stand',
                        direction: 'up',
                        time: 800
                    },
                    {
                        type: 'walk',
                        direction: 'up'
                    },
                    {
                        type: 'walk',
                        direction: 'right'
                    },
                    {
                        type: 'walk',
                        direction: 'down'
                    }
                ]
            }),
            npcC: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: '/images/characters/people/npc2.png',
                
            })
        },
        walls: {
            //'16,16': true
            [utils.asGridCoord(7,6)]: true,
            [utils.asGridCoord(8,6)]: true,
            [utils.asGridCoord(7,7)]: true,
            [utils.asGridCoord(8,7)]: true
        },
        triggers: {
            [utils.asGridCoord(7,4)]: [
                {
                    events: [
                        {
                            who: 'npcC',
                            type: 'walk',
                            direction: 'left'
                        },
                        {
                            who: 'npcC',
                            type: 'stand',
                            direction: 'up',
                            time: 500
                        },
                        {
                            type: 'textMessage',
                            text: 'You cant be in there!'
                        },
                        {
                            who: 'npcC',
                            type: 'walk',
                            direction: 'right'
                        },
                        {
                            who: 'npcC',
                            type: 'stand',
                            direction: 'down'
                        },
                        {
                            who: 'hero',
                            type: 'walk',
                            direction: 'down'
                        },
                        {
                            who: 'hero',
                            type: 'walk',
                            direction: 'left'
                        }
                    ]
                }
            ]
        }
    },
    Kitchen: {
        lowerSrc: '/images/maps/KitchenLower.png',
        upperSrc: '/images/maps/KitchenUpper.png',
        gameObjects: {
            hero: new GameObject({
                x: 3,
                y: 5
            }),
            npc1: new GameObject({
                x: 9,
                y: 6,
                src: '/images/characters/people/npc2.png'
            }),
            npc2: new GameObject({
                x: 10,
                y: 8,
                src: '/images/characters/people/npc3.png'
            })
        }
    }
}