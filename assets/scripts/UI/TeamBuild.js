const DataMng = require('DataMng');
const HeroInfo = cc.Class({
    name: 'HeroInfo',
    properties: {
        iconClass: cc.Sprite,
        labelClass: cc.Label,
        labelName: cc.Label,
        labelHp: cc.Label,
        labelAtk: cc.Label,
        labelAp: cc.Label
    },

    init (heroInfo) {
        
    }
})
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,


    },

    // use this for initialization
    init (mainMenu) {
        this.mainMenu = mainMenu;
        this.heroInfos = [];
        DataMng.loadHeroes(function(heroInfos) {
            this.heroInfos = heroInfos;
            this.onHeroLoaded();
        }.bind(this));
    },

    onHeroLoaded () {
        cc.log(this.heroInfos);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
