cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        pressedScale: 1,
        transDuration: 0
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.initScale = this.target.scale;
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale).easing(cc.easeBounceIn());
        function onTouchDown (event) {
            this.target.stopAllActions();
            this.target.runAction(self.scaleDownAction);
        }
        function onTouchUp (event) {
            this.target.stopAllActions();
            this.target.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown.bind(this), this.node);
        this.node.on('touchend', onTouchUp.bind(this), this.node);
        this.node.on('touchcancel', onTouchUp.bind(this), this.node);
    }
});
