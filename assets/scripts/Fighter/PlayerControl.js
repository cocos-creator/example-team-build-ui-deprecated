const MoveState = cc.Enum({
    Idle: -1,
    RunLeft: -1,
    RunRight: -1,
    DashLeft: -1,
    DashRight: -1,
    Attack1: -1
});

cc.Class({
    extends: cc.Component,

    properties: () => ({
        spine: sp.Skeleton,
        moveSpeed: 0,
        dashSpeed: 0,
        debugLabel: cc.Label,
        camera: require('Camera')
    }),

    // use this for initialization
    onLoad: function () {
        this.moveState = MoveState.Idle;
        this.lastState = null;
        this.bufferState = null; // if there are attacks buffered
        this.canMove = true;
        this.lastLeftTime = 0;
        this.lastRightTime = 0;
        this.isMoving = false;
        this.canvas = cc.find('Canvas/sceneRoot/bg');
        this.setInputControl();
    },

    start () {
        this.setSkeletonAnimation();
    },

    setInputControl: function () {
        var self = this;
        //add keyboard input listener to jump, turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // set a flag when key pressed
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        this.lastRightTime = 0;
                        if (Date.now() - this.lastLeftTime <= 200) {
                            if (self.canMove) {
                                self.moveState = MoveState.DashLeft;
                            } else {
                                self.bufferState = MoveState.DashLeft;
                            }
                        } else {
                            if (self.canMove) {
                                self.moveState = MoveState.RunLeft;
                            } else {
                                self.bufferState = MoveState.RunLeft;
                            }
                        }
                        this.lastLeftTime = Date.now();
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        this.lastLeftTime = 0;
                        if (Date.now() - this.lastRightTime <= 200) {
                            if (self.canMove) {
                                self.moveState = MoveState.DashRight;
                            } else {
                                self.bufferState = MoveState.DashRight;
                            }
                        } else {
                            if (self.canMove) {
                                self.moveState = MoveState.RunRight;
                            } else {
                                self.bufferState = MoveState.RunRight;
                            }
                        }
                        this.lastRightTime = Date.now();
                        break;
                    case cc.KEY.space:
                        if (self.canMove) {
                            self.moveState = MoveState.Attack1;
                        } else {
                            self.bufferState = MoveState.Attack1;
                        }
                        self.camera.zoomToTarget();
                        break;
                }
            }
        }, self.node);

        // touch input
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     onTouchBegan: function(touch, event) {
        //         var touchLoc = touch.getLocation();
        //         if (touchLoc.x >= cc.winSize.width/2) {
        //             self.accLeft = false;
        //             self.accRight = true;
        //         } else {
        //             self.accLeft = true;
        //             self.accRight = false;
        //         }
        //         // don't capture the event
        //         return true;
        //     },
        //     onTouchEnded: function(touch, event) {
        //         self.accLeft = false;
        //         self.accRight = false;
        //     }
        // }, self.node);
    },

    setSkeletonAnimation () {
        let spine = this.spine;
        this.rootBone = spine.findBone('root');
        // spine.setMix('idle', 'run', 0.3);
        // spine.setMix('atk_1', 'run', 0.3);
        // spine.setMix('atk_1', 'atk_1', 0.2);
        spine.setEndListener(track => {
            // cc.log("[track %s] end", track);
            let entry = spine.getCurrent(track);
            if (entry) {
                let animationName = entry.animation ? entry.animation.name : '';
                if (animationName === 'atk_1') {
                    // cc.log('attack complete!');
                    this.onAttack1End();
                }
            }
        });
        spine.setCompleteListener((track, loopCount) => {
            // cc.log("[track %s] complete: %s", track, loopCount);
            let entry = spine.getCurrent(track);
            if (entry) {
                let animationName = entry.animation ? entry.animation.name : '';
                if (animationName.indexOf('atk_') !== -1) {
                    // cc.log('attack complete!');
                    this.onAttackComplete();
                } else if (animationName.indexOf('dash') !== -1) {
                    this.onDashComplete();
                }
            }
        });
        spine.setEventListener((track, event) => {
            // cc.log("[track %s] event: %s, %s, %s, %s", track, event.data.name, event.intValue, event.floatValue, event.stringValue);
            if (event.data.name === 'atk_1') {
                if (event.stringValue === 'end') {
                    this.onAttack1Cancelable();
                }
            } else if (event.data.name === 'invi_end') {
                this.onDashInviEnd();
            }
        });
    },

    updateMoveState (dt) {
        switch (this.moveState) {
            case MoveState.Idle:
                this.updateStateIdle();
                break;
            case MoveState.RunLeft:
                this.updateStateMoveLeft(dt);
                break;
            case MoveState.RunRight:
                this.updateStateMoveRight(dt);
                break;
            case MoveState.DashLeft:
                this.updateStateDashLeft(dt);
                break;
            case MoveState.DashRight:
                this.updateStateDashRight(dt);
                break;
            case MoveState.Attack1:
                this.updateStateAttack1();
                break;
        }
    },

    updateStateIdle() {
        if (this.lastState === this.moveState) {
            return;
        }
        this.spine.setAnimation(0, 'idle', true);
        this.lastState = this.moveState;
    },

    updateStateDashLeft(dt) {
        if (this.lastState !== this.moveState) {
            this.node.scaleX = -1;
            this.spine.setAnimation(0, 'dash', false);
            this.lastState = this.moveState;
            this.bufferState = null;
            this.canMove = false;
            this.isMoving = true;
        }
        if (this.isMoving) {
            this.node.x -= this.dashSpeed * dt;
        }
    },

    updateStateDashRight(dt) {
        if (this.lastState !== this.moveState) {
            this.node.scaleX = 1;
            this.spine.setAnimation(0, 'dash', false);
            this.lastState = this.moveState;
            this.bufferState = null;
            this.canMove = false;
            this.isMoving = true;
        }
        if (this.isMoving) {
            this.node.x += this.dashSpeed * dt;
        }
    },

    updateStateMoveLeft (dt) {
        if (this.lastState !== this.moveState) {
            this.node.scaleX = -1;
            this.spine.setAnimation(0, 'run', true);
            this.lastState = this.moveState;
            this.bufferState = null;
            this.isMoving = true;
        }
        this.node.x -= this.moveSpeed * dt;
    },

    updateStateMoveRight (dt) {
        if (this.lastState !== this.moveState) {
            this.node.scaleX = 1;
            this.spine.setAnimation(0, 'run', true);
            this.lastState = this.moveState;
            this.bufferState = null;
            this.isMoving = true;
        }
        this.node.x += this.moveSpeed * dt;
    },

    updateStateAttack1() {
        if (!this.canMove) {
            return;
        }

        if (this.lastState !== this.moveState ||
            this.bufferState === MoveState.Attack1) {
            this.spine.clearTrack(0);
            // this.spine.setToSetupPose();
            this.spine.setAnimation(0, 'atk_1', false);
            this.bufferState = null;
            this.lastState = this.moveState;
            this.canMove = false;
        }
    },

    onAttack1Cancelable() {
        this.canMove = true;
        if (this.bufferState) {
            this.moveState = this.bufferState;
        }
    },

    onDashInviEnd() {
        this.isMoving = false;
    },

    onAttack1End() {
        let rootX = this.rootBone.x;
        // cc.log('currentRootX: ' + rootX);
        if (this.node.scaleX > 0) { // toward right
            this.node.x += rootX;
        } else {
            this.node.x -= rootX;
        }
        this.rootBone.x = 0;
    },

    onAttackComplete() {
        if (this.node.scaleX > 0) { // toward right
            this.moveState = MoveState.RunRight;
        } else {
            this.moveState = MoveState.RunLeft;
        }
    },

    onDashComplete () {
        this.canMove = true;
        if (this.node.scaleX > 0) { // toward right
            this.moveState = MoveState.RunRight;
        } else {
            this.moveState = MoveState.RunLeft;
        }
    },

    update: function (dt) {
        this.updateMoveState(dt);
        if (this.node.x > this.canvas.width/2 - 50) {
            this.node.x = this.canvas.width/2 - 50;
        } else if (this.node.x < -this.canvas.width/2 + 50) {
            this.node.x = -this.canvas.width/2 + 50;
        }

        this.debugLabel.string = 'move state: ' + MoveState[this.moveState] +
            '\n last state: ' + MoveState[this.lastState] +
            '\n root x: ' + this.rootBone.x;
    },
});
