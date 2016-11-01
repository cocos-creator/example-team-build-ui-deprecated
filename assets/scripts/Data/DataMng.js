let heroes = {};
let activeSkills = {};
let passiveSkills = {};
module.exports = {
    loadHeroes (cb) {
        cc.loader.loadRes('data/heroes', function(err, data){
            if (err) {
                cc.log(err);
            } else {
                let list = data;
                let count = list.length;
                for (let i = 0; i < count; ++i) {
                    let heroInfo = list[i];
                    heroes[heroInfo.id] = heroInfo;
                    let posArr = heroInfo.iconPos.split('|');
                    let anchorArr = heroInfo.portraitAnchor.split('|');
                    heroInfo.iconPos = cc.p(parseFloat(posArr[0]), parseFloat(posArr[1]));
                    heroInfo.portraitScale = parseFloat(heroInfo.portraitScale);
                    heroInfo.portraitAnchor = cc.p(parseFloat(anchorArr[0]), parseFloat(anchorArr[1]));
                    let sfUrl = 'heroes/' + heroInfo.id;
                    cc.loader.loadRes(sfUrl, cc.SpriteFrame, function(err, spriteFrame) {
                        if (err) {
                            cc.log(err);
                        } else {
                            heroInfo.sf = spriteFrame;
                            if (--count <= 0) {
                                return cb(list);
                            }
                        }
                    });
                }
            }
        });
    },
    loadActiveSkills (cb) {
        cc.loader.loadRes('data/activeskills', function(err, data){
            if (err) {
                cc.log(err);
            } else {
                let list = data;
                let count = list.length;
                for (let i = 0; i < list.length; ++i) {
                   let skillInfo = list[i];
                   cc.loader.loadRes('skills/' + skillInfo.icon, cc.SpriteFrame, function(err, spriteFrame) {
                        skillInfo.sf = spriteFrame;
                        activeSkills[skillInfo.id] = skillInfo;
                        if (--count <= 0) {
                            return cb(list)
                        }
                   });
                }
            }
        });
    },
    loadPassiveSkills (cb) {
        cc.loader.loadRes('data/passiveskills', function(err, data){
            if (err) {
                cc.log(err);
            } else {
                let list = data;
                let count = list.length;
                for (let i = 0; i < list.length; ++i) {
                   let skillInfo = list[i];
                   cc.loader.loadRes('skills/' + skillInfo.icon, cc.SpriteFrame, function(err, spriteFrame) {
                        skillInfo.sf = spriteFrame;
                        passiveSkills[skillInfo.id] = skillInfo;
                        if (--count <= 0) {
                            return cb(list)
                        }
                   });
                }
            }
        });
    },
    getHero (id) {
        return heroes[id];
    },
    getActiveSkill (id) {
        if (id) {
            return activeSkills[id];
        } else {
            return null;
        }
    },
    getPassiveSkill (id) {
        if (id) {
            return passiveSkills[id];
        } else {
            return null;
        }
    },
    heroes,
    activeSkills,
    passiveSkills
};
