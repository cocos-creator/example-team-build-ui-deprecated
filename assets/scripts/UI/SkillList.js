const DataMng = require('DataMng');
cc.Class({
    extends: cc.Component,

    properties: {
        skillPrefab: cc.Prefab,
        container: cc.Node
    },

    onLoad () {
        this.skillIcons = [];
        for (let i = 0; i < 3; ++i) {
            let skillIcon = cc.instantiate(this.skillPrefab).getComponent('SkillIcon');
            this.container.addChild(skillIcon.node);
            this.skillIcons.push(skillIcon);
        }
    },

    // use this for initialization
    init (heroInfo) {
        let activeSkill = DataMng.getActiveSkill(heroInfo.activeSkill);
        let passiveSkill1 = DataMng.getPassiveSkill(heroInfo.passiveSkill1);
        let passiveSkill2 = DataMng.getPassiveSkill(heroInfo.passiveSkill2);
        if (activeSkill) {
            this.skillIcons[0].node.active = true;
            this.skillIcons[0].init(activeSkill);
        } else {
            this.skillIcons[0].node.active = false;
        }
        if (passiveSkill1) {
            this.skillIcons[1].node.active = true;
            this.skillIcons[1].init(passiveSkill1);
        } else {
            this.skillIcons[1].node.active = false;
        }
        if (passiveSkill2) {
            this.skillIcons[2].node.active = true;
            this.skillIcons[2].init(passiveSkill2);
        } else {
            this.skillIcons[2].node.active = false;
        }
    }

});
