const DataMng = require('DataMng');
const HeroClass = require('Types').HeroClass;
const HeroStats = require('Types').HeroStats;
const SkillList = require('SkillList');
// maximum hero stats to calculate bar progress
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
        sfClasses: [cc.SpriteFrame], // class icon spriteFrames, indexed by HeroClass enum
        strClasses: { // class name strings, indexed by HeroClass enum
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
        for (let i = 0; i < this.strStatNames.length; ++i) {
            let stat = cc.instantiate(this.statPrefab).getComponent('StatDisplay');
            stat.init(this.strStatNames[i]);
            this.stats.push(stat);
            this.statLayout.node.addChild(stat.node);
        }
    },

    onPageEvent (sender, eventType) {
        // page turned event
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        // current highlight hero index
        let idx = sender.getCurrentPageIndex();
        if (this.curSelectedIdx !== idx) { // selection changed, update hero selected state
            if (this.curSelectedIdx > -1) {
                this.heroesInList[this.curSelectedIdx].getComponent('HeroPortrait').onFocusOff();
            }
            this.curSelectedIdx = idx;
            this.heroesInList[this.curSelectedIdx].getComponent('HeroPortrait').onFocusOn();
            this.anim.play('team_cur_off');
        }
    },

    scrollToHeroIdx (idx) {
        this.pageView.scrollToPage(idx, this.snapTime);
    },

    onHeroLoaded () {
        // instantiate hero portraits and add them to pageView
        for (let i = 0; i < this.heroInfos.length; ++i ) {
            let heroInList = cc.instantiate(this.heroPortraitPrefab).getComponent('HeroPortrait');
            this.pageView.addPage(heroInList.node);
            heroInList.init(this.heroInfos[i]);
            this.heroesInList.push(heroInList.node);
        }

        // instantiate hero icons and add them to teamLayout
        for (let i = 0; i < this.teamHeroes.length; ++i) {
            let heroInfo = this.teamHeroes[i];
            let heroIcon = cc.instantiate(this.heroIconPrefab).getComponent('HeroIcon');
            this.teamLayout.node.addChild(heroIcon.node);
            heroIcon.init(this, i, heroInfo);
            this.heroesInTeam.push(heroIcon);
        }
    },

    // when 'Use' button is pressed
    chooseHero () {
        this.heroesInList[this.curSelectedIdx].getComponent('HeroPortrait').onSelect();
        for (let i = 0; i < this.heroesInTeam.length; ++i) {
            this.heroesInTeam[i].showReplace();
        }
        this.anim.play('team_show_replace');
    },

    // current hero replaced a slot in team
    replaceTeamHero (idx) {
        let heroInfo = this.heroInfos[this.curSelectedIdx];
        this.heroesInTeam[idx].init(this, idx, heroInfo);
        for (let i = 0; i < this.heroesInTeam.length; ++i) {
            this.heroesInTeam[i].hideReplace();
        }
        this.heroesInList[this.curSelectedIdx].getComponent('HeroPortrait').onFocusOn();
        this.anim.play('team_hide_replace');
    },

    // will call this method with event when team_cur_off animation finished
    onStatsHide () {
        this.updateHeroStats(this.heroInfos[this.curSelectedIdx]);
        this.anim.play('team_cur_on');
    },

    // update hero stats
    updateHeroStats (heroInfo) { //{name, class, hp, atk, ap}
        this.iconClass.spriteFrame = this.sfClasses[HeroClass[heroInfo.class]];
        this.labelClass.string = this.strClasses[HeroClass[heroInfo.class]];
        this.labelName.string = heroInfo.name;
        this.stats[HeroStats.HP].setStat(heroInfo.hp/MAX_HP, heroInfo.hp);
        this.stats[HeroStats.ATK].setStat(heroInfo.atk/MAX_ATK, heroInfo.atk);
        this.stats[HeroStats.AP].setStat(heroInfo.ap/MAX_AP, heroInfo.ap);
        this.skillList.init(heroInfo);
    },

    // this hack is to get when layout finished
    lateUpdate: function (dt) {
        if (this.finishedLayout) {
            return;
        }
        // this hack to get when layout is finished
        if (this.listLayout._layoutDirty === false) {
            this.scrollToHeroIdx(1); // scroll to the second hero
            this.finishedLayout = true;
        }
    },
});
