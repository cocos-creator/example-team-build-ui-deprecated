const DataMng = require('DataMng');
const HeroClass = require('Types').HeroClass;

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        iconClass: cc.Sprite,
        labelClass: cc.Label,
        labelName: cc.Label,
        labelHp: cc.Label,
        labelAtk: cc.Label,
        labelAp: cc.Label,
        sfClasses: [cc.SpriteFrame],
        strClasses: {
            default: [],
            type: 'String'
        },
        heroListPrefab: cc.Prefab,
        snapTime: 0,
    },

    // use this for initialization
    init (mainMenu) {
        this.mainMenu = mainMenu;
        this.heroInfos = []; //{id, name, class, sf, iconAnchor, hp, atk, ap}
        this.heroContentPosX = []; // record content position when hero is center
        DataMng.loadHeroes(function(heroInfos) {
            this.heroInfos = heroInfos;
            this.onHeroLoaded();
        }.bind(this));
        // listen to scroll end
        this.scrollView.node.on('touchend', this.onScrollEnd.bind(this));
    },

    onScrollEnd (event) {
        let contentPos = this.scrollView.getContentPosition();
        cc.log(contentPos.x);
        this.scrollToNearest(contentPos.x);
    },

    scrollToNearest (contentPosX) {
        let idx = 0;
        let destPosX = 0;
        let length = this.heroContentPosX.length;
        for (let i = 0; i < length; ++i) {
            if (contentPosX > this.heroContentPosX[0]) {
                destPosX = this.heroContentPosX[0];
                idx = 0;
                break;
            } else if (contentPosX >= this.heroContentPosX[i] &&
                contentPosX < this.heroContentPosX[i - 1]) {
                if (Math.abs(contentPosX - this.heroContentPosX[i]) < Math.abs(this.heroContentPosX[i - 1] - contentPosX)) {
                    destPosX = this.heroContentPosX[i];
                    idx = i;
                } else {
                    destPosX = this.heroContentPosX[i - 1];
                    idx = i - 1;
                }
                break;
            } else if (contentPosX < this.heroContentPosX[length - 1]) {
                destPosX = this.heroContentPosX[length - 1];
                idx = length - 1;
            }
        }
        // cc.log('dest pos x: ' + destPosX);
        // cc.log('select hero: ' + idx);
        this.scrollView.scrollToPercentHorizontal((destPosX - this.heroContentPosX[0])/this.totalScrollDist, this.snapTime, true);
    },

    onHeroLoaded () {
        // cc.log(this.heroInfos);
        let totalDist = 0;
        for (let i = 0; i < this.heroInfos.length; ++i ) {
            let heroInList = cc.instantiate(this.heroListPrefab).getComponent('HeroInList');
            heroInList.init(this.heroInfos[i]);
            this.scrollView.content.addChild(heroInList.node);
            if (i === 0) {
                this.heroContentPosX[i] = - 450 - heroInList.node.width * this.heroInfos[i].portraitAnchor.x;
            } else {
                this.heroContentPosX[i] = totalDist - heroInList.node.width * this.heroInfos[i].portraitAnchor.x;
            }
            totalDist = this.heroContentPosX[i] - heroInList.node.width * (1 - this.heroInfos[i].portraitAnchor.x) - 100;
        }
        this.totalScrollDist = this.heroContentPosX[this.heroContentPosX.length - 1] - this.heroContentPosX[0];
        // cc.log(this.heroContentPosX);
    },

    updateHeroStats (heroInfo) { //{name, class, hp, atk, ap}
        this.iconClass.spriteFrame = this.sfClasses[heroInfo.class];
        this.labelName.string = heroInfo.name;
        this.labelHp.string = heroInfo.hp;
        this.labelAtk.string = heroInfo.atk;
        this.labelAp.string = heroInfo.ap;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
