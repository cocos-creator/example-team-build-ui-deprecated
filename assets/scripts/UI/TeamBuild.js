const DataMng = require('DataMng');
const HeroClass = require('Types').HeroClass;
const SkillList = require('SkillList');
const MAX_HP = 1500;
const MAX_ATK = 200;
const MAX_AP = 200;

cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,
        listLayout: cc.Layout,
        teamLayout: cc.Layout,
        statLayout: cc.Layout,
        skillList: SkillList,
        iconClass: cc.Sprite,
        labelClass: cc.Label,
        labelName: cc.Label,
        sfClasses: [cc.SpriteFrame],
        strClasses: {
            default: [],
            type: 'String'
        },
        strStatNames: {
            default: [],
            type: 'String'
        },
        heroPortraitPrefab: cc.Prefab,
        heroIconPrefab: cc.Prefab,
        statPrefab: cc.Prefab,
        snapTime: 0,
    },

    // use this for initialization
    onLoad () {
        // this.mainMenu = mainMenu;
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
        this.stats = [];
        for (let i = 0; i < 3; ++i) {
            let stat = cc.instantiate(this.statPrefab).getComponent('StatDisplay');
            stat.init(this.strStatNames[i]);
            this.stats.push(stat);
            this.statLayout.node.addChild(stat.node);
        }
    },

    onPageEvent (sender, eventType) {
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        let idx = sender.getCurrentPageIndex();
        console.log("当前所在的页面索引:" + idx);
        if (this.curSelectedIdx !== idx) {
            if (this.curSelectedIdx > -1) {
                this.heroesInList[this.curSelectedIdx].getComponent('HeroPortrait').onDeselect();
            }
            this.curSelectedIdx = idx;
            this.heroesInList[this.curSelectedIdx].getComponent('HeroPortrait').onSelect();
            this.anim.play('team_cur_off');
        }
    },

    scrollToHeroIdx (idx) {
        // let destPosX = 0;
        // let length = this.heroesInList.length;
        // let contentPosX = -this.heroesInList[idx].x;
        this.pageView.scrollToPage(idx, this.snapTime);
    },

    onHeroLoaded () {
        // cc.log(DataMng.activeSkills);
        let totalDist = 0;
        for (let i = 0; i < this.heroInfos.length; ++i ) {
            let heroInList = cc.instantiate(this.heroPortraitPrefab).getComponent('HeroPortrait');
            this.pageView.addPage(heroInList.node);
            heroInList.init(this.heroInfos[i]);
            this.heroesInList.push(heroInList.node);
        }
        for (let i = 0; i < this.teamHeroes.length; ++i) {
            let heroInfo = this.teamHeroes[i];
            let heroIcon = cc.instantiate(this.heroIconPrefab).getComponent('HeroIcon');
            this.teamLayout.node.addChild(heroIcon.node);
            heroIcon.init(this, i, heroInfo);
            this.heroesInTeam.push(heroIcon);
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
        this.stats[0].setStat(heroInfo.hp/MAX_HP, heroInfo.hp);
        this.stats[1].setStat(heroInfo.atk/MAX_ATK, heroInfo.atk);
        this.stats[2].setStat(heroInfo.ap/MAX_AP, heroInfo.ap);
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
