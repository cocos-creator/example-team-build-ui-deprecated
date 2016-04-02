const DataMng = require('DataMng');
const HeroClass = require('Types').HeroClass;

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        listLayout: cc.Layout,
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
        this.lastContentPosX = 0;
        this.heroesInList = [];
        this.finishedLayout = false;
        DataMng.loadHeroes(function(heroInfos) {
            this.heroInfos = heroInfos;
            this.onHeroLoaded();
        }.bind(this));
        // listen to scroll end
        this.scrollView.node.on('touchend', this.onScrollEnd.bind(this));
        this.scrollView.node.on('touchcancel', this.onScrollEnd.bind(this));
        this.scrollView.node.on('touchstart', this.onScrollStart.bind(this));
    },

    onScrollStart (event) {
        this.lastContentPosX = this.scrollView.getContentPosition().x;
    },

    onScrollEnd (event) {
        let contentPos = this.scrollView.getContentPosition();
        // cc.log(contentPos.x);
        this.scrollToNext(contentPos.x);
    },

    scrollToNext (contentPosX) {
        let destPosX = 0;
        let length = this.heroesInList.length;
        for (let i = 0; i < length; ++i) {
            if (contentPosX > - this.heroesInList[0].x) {
                destPosX = - this.heroesInList[0].x;
                break;
            } else if (contentPosX >= -this.heroesInList[i].x &&
                contentPosX < -this.heroesInList[i - 1].x) {
                if (contentPosX < this.lastContentPosX) {
                    destPosX = - this.heroesInList[i].x;
                } else {
                    destPosX = - this.heroesInList[i - 1].x;
                }
                break;
            } else if (contentPosX < - this.heroesInList[length - 1].x) {
                destPosX = - this.heroesInList[length - 1].x;
                break;
            }
        }
        this.scrollView._startAutoScroll(cc.pNeg(cc.p(this.scrollView.content.x - destPosX, 0)), this.snapTime, true);
    },

    scrollToHeroIdx (idx) {
        let destPosX = 0;
        let length = this.heroesInList.length;
        let contentPosX = -this.heroesInList[idx].x;
        this.scrollToNext(contentPosX);
    },

    onHeroLoaded () {
        let totalDist = 0;
        for (let i = 0; i < this.heroInfos.length; ++i ) {
            let heroInList = cc.instantiate(this.heroListPrefab).getComponent('HeroInList');
            heroInList.init(this.heroInfos[i]);
            this.scrollView.content.addChild(heroInList.node);
            this.heroesInList.push(heroInList.node);
        }
    },

    updateHeroStats (heroInfo) { //{name, class, hp, atk, ap}
        this.iconClass.spriteFrame = this.sfClasses[heroInfo.class];
        this.labelName.string = heroInfo.name;
        this.labelHp.string = heroInfo.hp;
        this.labelAtk.string = heroInfo.atk;
        this.labelAp.string = heroInfo.ap;
    },

    // this hack is to get when layout finished
    lateUpdate: function (dt) {
        if (this.finishedLayout) {
            return;
        }
        if (this.listLayout._layoutDirty === false) {
            this.scrollToHeroIdx(4);
            this.finishedLayout = true;
        }
    },
});
