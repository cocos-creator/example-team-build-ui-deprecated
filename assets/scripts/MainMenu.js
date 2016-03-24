const MenuSidebar = require('MenuSidebar');

cc.Class({
    extends: cc.Component,

    properties: {
        sidebar: MenuSidebar,
        roller: cc.Node,
        panelHeight: 0,
        tabSwitchDuration: 0
    },

    // use this for initialization
    onLoad () {
        this.sidebar.init(this);
        this.curPanelIdx = 0;
        this.roller.y = this.curPanelIdx * this.panelHeight;
    },

    switchPanel (idx) {
        this.curPanelIdx = idx;
        let newY = this.curPanelIdx * this.panelHeight;
        let rollerMove = cc.moveTo(this.tabSwitchDuration, cc.p(0, newY)).easing(cc.easeQuinticActionInOut());
        let callback = cc.callFunc(this.onSwitchPanelFinished, this);
        this.roller.stopAllActions();
        cc.eventManager.pauseTarget(this.roller);
        this.roller.runAction(cc.sequence(rollerMove, callback));
    },

    onSwitchPanelFinished () {
        cc.eventManager.resumeTarget(this.roller);
    }
});
