let heroes = {};
let activeSkills = {};
let passiveSkills = {};

function loadSpriteFrame (url, cb) {
    cc.loader.loadRes(url, cc.SpriteFrame, cb);
}

module.exports = {
    // load heroInfo data and portrait spriteFrame
    loadHeroes (cb) {
        cc.loader.loadRes('data/heroes', function(err, data){
            if (err) {
                cc.error(err);
            } else {
                let list = data;
                // use this counter to callback when all spriteFrames are loaded
                let count = list.length;
                for (let i = 0; i < list.length; ++i) {
                    let heroInfo = list[i];
                    // push heroInfo to heroes list
                    heroes[heroInfo.id] = heroInfo;
                    // parse icon position and portrait scale and anchor
                    let posArr = heroInfo.iconPos.split('|');
                    let anchorArr = heroInfo.portraitAnchor.split('|');
                    heroInfo.iconPos = cc.p(parseFloat(posArr[0]), parseFloat(posArr[1]));
                    heroInfo.portraitScale = parseFloat(heroInfo.portraitScale);
                    heroInfo.portraitAnchor = cc.p(parseFloat(anchorArr[0]), parseFloat(anchorArr[1]));
                    // load spriteFrame
                    let sfUrl = 'heroes/' + heroInfo.id;
                    loadSpriteFrame(sfUrl, function(err, spriteFrame) {
                        if (err) {
                            cc.error(err);
                            return;
                        } else {
                            heroInfo.sf = spriteFrame;
                            count -= 1;
                            if (count <= 0) {
                                return cb (list);
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
                    loadSpriteFrame('skills/' + skillInfo.icon, function(err, spriteFrame) {
                        if (err) {
                            cc.error(err);
                            return;
                        } else {
                            skillInfo.sf = spriteFrame;
                            activeSkills[skillInfo.id] = skillInfo;
                            count -= 1;
                            if (count <= 0) {
                                return cb (list);
                            }
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
                    loadSpriteFrame('skills/' + skillInfo.icon, function(err, spriteFrame) {
                        if (err) {
                            cc.error(err);
                            return;
                        } else {
                            skillInfo.sf = spriteFrame;
                            passiveSkills[skillInfo.id] = skillInfo;
                            count -= 1;
                            if (count <= 0) {
                                return cb (list);
                            }
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
