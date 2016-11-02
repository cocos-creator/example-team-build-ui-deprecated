cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        sprite: cc.Sprite
    },

    // use this for initialization
    init (heroInfo) {//{id, sf, portraitAnchor, portraitScale}
        this.id = heroInfo.id;
        this.sprite.spriteFrame = heroInfo.sf;
        // use portraitAnchor and portraitScale data from heroInfo to adjust hero sprite position and scale
        this.sprite.node.setScale(heroInfo.portraitScale, heroInfo.portraitScale);
        this.sprite.node.setAnchorPoint(heroInfo.portraitAnchor);
        this.node.positionY = -220;
        // by default, set all heroes to focus off
        this.onFocusOff();
    },

    // play idle animation when a hero is the current page
    onFocusOn () {
        this.anim.play('list_idle');
    },

    // play off animation when a hero is not the current page
    onFocusOff () {
        this.anim.play('list_off');
    },

    // play select animation when a hero is choosed
    onSelect () {
        this.anim.play('list_select');
    }

});
