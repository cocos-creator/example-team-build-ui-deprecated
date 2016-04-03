cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        labelCost: cc.Label,
        bgCost: cc.Node,
        labelLevel: cc.Label,
    },

    // use this for initialization
    init (skillInfo) {
        if (skillInfo.cost === undefined) {
            this.bgCost.active = false;
        } else {
            this.bgCost.active = true;
            this.labelCost.string = skillInfo.cost;
        }
        this.icon.spriteFrame = skillInfo.sf;
    }
});
