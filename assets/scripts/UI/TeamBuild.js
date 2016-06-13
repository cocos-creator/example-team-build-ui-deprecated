const DataMng = require('DataMng');
const HeroClass = require('Types').HeroClass;
const SkillList = require('SkillList');
const MAX_HP = 1500;
const MAX_ATK = 200;
const MAX_AP = 200;

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        listLayout: cc.Layout,
        teamLayout: cc.Layout,
        skillList: SkillList,
        iconClass: cc.Sprite,
        labelClass: cc.Label,
        labelName: cc.Label,
        labelHp: cc.Label,
        labelAtk: cc.Label,
        labelAp: cc.Label,
        barHp: cc.ProgressBar,
        barAtk: cc.ProgressBar,
        barAp: cc.ProgressBar,
        sfClasses: [cc.SpriteFrame],
        strClasses: {
            default: [],
            type: 'String'
        },
        heroListPrefab: cc.Prefab,
        heroTeamPrefab: cc.Prefab,
        snapTime: 0,
    },

    // use this for initialization
    init (mainMenu) {
        this.mainMenu = mainMenu;
        this.heroInfos = []; //{id, name, class, sf, iconAnchor, hp, atk, ap}
        this.lastContentPosX = 0;
        this.heroesInList = [];
        this.heroesInTeam = [];
        this.curSelectedIdx = -1;
        this.teamHeroes = [null, null, null];
        this.finishedLayout = false;
        this.anim = this.getComponent(cc.Animation);
        DataMng.loadHeroes(function(heroInfos) {
            this.heroInfos = heroInfos;
            DataMng.loadActiveSkills(function() {
                DataMng.loadPassiveSkills(function () {
                    this.onHeroLoaded();
                }.bind(this));
            }.bind(this));
        }.bind(this));
        // listen to scroll end
        this.scrollView.node.on('touchend', this.onScrollEnd.bind(this), true);
        this.scrollView.node.on('touchcancel', this.onScrollEnd.bind(this), true);
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
        let idx = -1;
        let length = this.heroesInList.length;
        for (let i = 0; i < length; ++i) {
            if (contentPosX > - this.heroesInList[0].x) {
                destPosX = - this.heroesInList[0].x;
                idx = 0;
                break;
            } else if (contentPosX >= -this.heroesInList[i].x &&
                contentPosX < -this.heroesInList[i - 1].x) {
                if (contentPosX < this.lastContentPosX) {
                    idx = i;
                    destPosX = - this.heroesInList[i].x;
                } else {
                    destPosX = - this.heroesInList[i - 1].x;
                    idx = i - 1;
                }
                break;
            } else if (contentPosX < - this.heroesInList[length - 1].x) {
                destPosX = - this.heroesInList[length - 1].x;
                idx = length - 1;
                break;
            }
        }

        if (this.curSelectedIdx !== idx) {
            if (this.curSelectedIdx > -1) {
                this.heroesInList[this.curSelectedIdx].getComponent('HeroInList').onDeselect();
            }
            this.curSelectedIdx = idx;
            this.heroesInList[this.curSelectedIdx].getComponent('HeroInList').onSelect();
            this.anim.play('team_cur_off');
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
        // cc.log(DataMng.activeSkills);
        let totalDist = 0;
        for (let i = 0; i < this.heroInfos.length; ++i ) {
            let heroInList = cc.instantiate(this.heroListPrefab).getComponent('HeroInList');
            heroInList.init(this.heroInfos[i]);
            this.scrollView.content.addChild(heroInList.node);
            this.heroesInList.push(heroInList.node);
        }
        for (let i = 0; i < this.teamHeroes.length; ++i) {
            let heroInfo = this.teamHeroes[i];
            let heroInTeam = cc.instantiate(this.heroTeamPrefab).getComponent('HeroInTeam');
            this.teamLayout.node.addChild(heroInTeam.node);
            heroInTeam.init(this, i, heroInfo);
            this.heroesInTeam.push(heroInTeam);
        }
    },

    chooseHero () {
        for (let i = 0; i < this.heroesInTeam.length; ++i) {
            this.heroesInTeam[i].showReplace();
        }
        this.anim.play('team_show_replace');
    },

    replaceTeamHero (idx) {
        let heroInfo = this.heroInfos[this.curSelectedIdx];
        this.heroesInTeam[idx].init(this, idx, heroInfo);
        for (let i = 0; i < this.heroesInTeam.length; ++i) {
            this.heroesInTeam[i].hideReplace();
        }
        this.anim.play('team_hide_replace');
    },

    onStatsHide () {
        this.updateHeroStats(this.heroInfos[this.curSelectedIdx]);
        this.anim.play('team_cur_on');
    },

    updateHeroStats (heroInfo) { //{name, class, hp, atk, ap}
        this.iconClass.spriteFrame = this.sfClasses[HeroClass[heroInfo.class]];
        this.labelClass.string = this.strClasses[HeroClass[heroInfo.class]];
        this.labelName.string = heroInfo.name;
        this.labelHp.string = heroInfo.hp;
        this.labelAtk.string = heroInfo.atk;
        this.labelAp.string = heroInfo.ap;
        this.barHp.progress = heroInfo.hp/MAX_HP;
        this.barAtk.progress = heroInfo.atk/MAX_ATK;
        this.barAp.progress = heroInfo.ap/MAX_AP;
        this.skillList.init(heroInfo);
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
