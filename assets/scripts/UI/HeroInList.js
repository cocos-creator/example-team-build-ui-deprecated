cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        sprite: cc.Sprite
    },

    // use this for initialization
    init (heroInfo) {//{id, sf, portraitAnchor}
        this.id = heroInfo.id;
        this.sprite.spriteFrame = heroInfo.sf;
        this.node.setAnchorPoint(heroInfo.portraitAnchor);
        this.onDeselect();
    },

    onSelect () {
        this.isCenter = true;
        this.anim.play('list_idle');
    },

    onDeselect () {
        this.isCenter = false;
        this.anim.play('list_off');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
