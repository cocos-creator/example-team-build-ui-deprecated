cc.Class({
    extends: cc.Component,

    properties: {
        idx: 0,
        icon: cc.Sprite,
        arrow: cc.Node,
        label: cc.Label,
        anim: cc.Animation
    },

    // use this for initialization
    init (tabInfo) { // sidebar, idx, data
        this.sidebar = tabInfo.sidebar;
        this.idx = tabInfo.idx;
        this.icon.spriteFrame = tabInfo.data.iconSF;
        this.label.string = tabInfo.data.text;
        this.node.on('touchstart', this.onPressed.bind(this), this.node);
        this.label.node.opacity = 0;
        this.arrow.scale = cc.p(0, 0);
    },

    onPressed () {
        this.sidebar.tabPressed(this.idx);
    },

    turnBig () {
        this.anim.play('tab_turnbig');
    },

    turnSmall () {
        this.anim.play('tab_turnsmall');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
