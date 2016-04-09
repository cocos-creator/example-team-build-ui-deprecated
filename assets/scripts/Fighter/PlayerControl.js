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

    properties: {
        spine: sp.Skeleton,
        moveSpeed: 0,
        dashSpeed: 0,
        debugLabel: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.moveState = MoveState.Idle;
        this.lastState = null;
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
                        self.moveState = MoveState.RunLeft;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.moveState = MoveState.RunRight;
                        break;
                    case cc.KEY.space:
                        self.moveState = MoveState.Attack1;
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
        // this._setMix('walk', 'run');
        // this._setMix('run', 'jump');
        // this._setMix('walk', 'jump');
        let spine = this.spine;
        spine.setStartListener(track => {
            var entry = spine.getCurrent(track);
            if (entry) {
                var animationName = entry.animation ? entry.animation.name : "";
                cc.log("[track %s] start: %s", track, animationName);
            }
        });
        spine.setEndListener(track => {
            cc.log("[track %s] end", track);
            let entry = spine.getCurrent(track);
            if (entry) {
                let animationName = entry.animation ? entry.animation.name : '';
                if (animationName === 'atk_1') {
                    cc.log('attack end!');
                }
            }
        });
        spine.setCompleteListener((track, loopCount) => {
            cc.log("[track %s] complete: %s", track, loopCount);
            let entry = spine.getCurrent(track);
            if (entry) {
                let animationName = entry.animation ? entry.animation.name : '';
                if (animationName === 'atk_1') {
                    cc.log('attack complete!');
                }
            }
        });
        spine.setEventListener((track, event) => {
            cc.log("[track %s] event: %s, %s, %s, %s", track, event.data.name, event.intValue, event.floatValue, event.stringValue);
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

    updateStateAttack1() {
        if (this.lastState === this.moveState) {
            return;
        }
        this.spine.setAnimation(0, 'atk_1', false);
        this.lastState = this.moveState;
    },

    update: function (dt) {
        this.updateMoveState(dt);
        this.debugLabel.string = 'move state: ' + this.moveState;
    },
});
