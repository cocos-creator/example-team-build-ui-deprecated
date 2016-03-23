cc.Class({
    extends: cc.Component,

    properties: {
        idx: 0,
        widget: cc.Widget,
        icon: cc.Sprite
    },

    // use this for initialization
    init () { //topSmall, botSmall, topBig, botBig
        this.resizeDuration = 0.6;
        this.isResizing = false;
        this.timer = 0;
    },

    resizeTo (top, bot) {
        this.srcTop = this.widget.top;
        this.srcBot = this.widget.bottom;
        this.destTop = top;
        this.destBot = bot;
        this.timer = 0;
        this.isResizing = true;
    },

    // called every frame, uncomment this function to activate update callback
    update (dt) {
        if (this.isResizing) {
            let ratio = this.timer/this.resizeDuration;
            if (this.srcTop !== this.destTop) {
                this.widget.top = cc.lerp(this.srcTop, this.destTop, ratio);
            }
            if (this.srcBot !== this.destBot) {
                this.widget.bottom = cc.lerp(this.srcBot, this.destBot, ratio);
            }
            this.timer += dt;
            if (this.timer > this.resizeDuration) {
                this.isResizing = false;
                this.widget.top = this.destTop;
                this.widget.bottom = this.destBot;
            }
        }
    },
});
