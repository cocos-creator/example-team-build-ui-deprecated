const HeroClass = require('Types').HeroClass;

cc.Class({
    extends: cc.Component,

    properties: {
        iconHero: cc.Sprite,
        iconClass: cc.Sprite,
        ring: cc.Sprite
    },

    // use this for initialization
    init (teamPanel, idx, heroInfo) {
        this.teamPanel = teamPanel;
        this.idx = idx;
        this.anim = this.getComponent(cc.Animation);
        if (heroInfo) {
            this.iconHero.enabled = true;
            this.iconClass.enabled = true;
            this.iconHero.spriteFrame = heroInfo.sf;
            this.iconClass.spriteFrame = this.teamPanel.sfClasses[HeroClass[heroInfo.class]];
            this.iconHero.node.position = heroInfo.iconPos;
        } else {
            this.iconHero.enabled = false;
            this.iconClass.enabled = false;
        }
        this.ring.enabled = false;
    },

    showReplace () {
        this.anim.play('hero_shaking');
        this.node.on('touchstart', this.onReplace.bind(this), this.node);
    },

    hideReplace () {
        this.anim.stop();
        this.ring.enabled = false;
        this.node.rotation = 0;
        this.node.targetOff(this.node);
    },

    onReplace () {
        let heroInfo = this.teamPanel.heroInfos[this.teamPanel.curSelectedIdx];
        this.init(this.teamPanel, this.idx, heroInfo);
        this.teamPanel.replaceTeamHero(this.idx);
    }
});
