class Person extends GameObject {

    constructor(config) {
        super(config);

        this.movingProgressRemaining = 0;
        this.isPlayerControlled = config.isPlayerControlled || false;

        this.directionUpdate = {
            'up': [ 'y', -1 ],
            'down': [ 'y', 1 ],
            'left': [ 'x', -1 ],
            'right': [ 'x', 1 ]
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            // TODO: More cases for starting to walk will come here
            //
            //
            // Case: we re keyboard ready and have an arrow pressed
            if (this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: 'walk',
                    direction: state.arrow
                });
            }

            this.updateSprite();
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;
    }

    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation(`walk-${ this.direction }`);
            return;
        }
        
        this.sprite.setAnimation(`idle-${ this.direction }`);
    }

    startBehavior(state, behavior) {
        // Set character direction to whatever behavior has
        this.direction = behavior.direction;
        
        switch(behavior.type) {
            case 'walk':
                // Stop here if space is not free (collision)
                if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                    return;
                }

                // Ready to walk
                state.map.moveWall(this.x, this.y, this.direction);
                this.movingProgressRemaining = 16;
                break;
            default:
                console.log('person behavior not treated');
        }
    }

}