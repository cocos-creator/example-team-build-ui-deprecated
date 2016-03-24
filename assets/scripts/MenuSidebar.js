const TabData = cc.Class({
    name: 'TabData',
    properties: {
        text: '',
        iconSF: cc.SpriteFrame
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        tabData: {
            default: [],
            type: TabData
        },
        tabPrefab: cc.Prefab,
        container: cc.Node,
        highlight: cc.Node,
        tabHeight: 0
    },

    // use this for initialization
    init (mainMenu) {
        this.mainMenu = mainMenu;
        this.tabSwitchDuration = mainMenu.tabSwitchDuration;
        this.curTabIdx = 0;
        this.tabs = [];
        for (let i = 0; i < this.tabData.length; ++i) {
            let data = this.tabData[i];
            let tab = cc.instantiate(this.tabPrefab).getComponent('TabCtrl');
            this.container.addChild(tab.node);
            tab.init({
                sidebar: this,
                idx: i,
                data: data
            });
            this.tabs[i] = tab;
        }
        this.tabs[this.curTabIdx].turnBig();
        this.highlight.y = this.curTabIdx * -this.tabHeight;
    },

    tabPressed (idx) {
        for (let i = 0; i < this.tabs.length; ++i) {
            let tab = this.tabs[i];
            if (tab.idx === idx) {
                tab.turnBig();
                cc.eventManager.pauseTarget(tab.node);
            } else if (this.curTabIdx === tab.idx) {
                tab.turnSmall();
                cc.eventManager.resumeTarget(tab.node);
            }
        }
        this.curTabIdx = idx;
        let highlightMove = cc.moveTo(this.tabSwitchDuration, cc.p(0, this.curTabIdx * -this.tabHeight)).easing(cc.easeQuinticActionInOut());
        this.highlight.stopAllActions();
        this.highlight.runAction(highlightMove);
        this.mainMenu.switchPanel(this.curTabIdx);
    }
});
