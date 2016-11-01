cc.Class({
    extends: cc.Component,

    properties: {
        statName: cc.Label,
        statBar: cc.ProgressBar,
        statNum: cc.Label
    },

    // use this for initialization
    init (name) {
        this.statName.string = name;
    },

    setStat (progress, num) {
        this.statBar.progress = progress;
        this.statNum.string = num.toString();
    }
});
