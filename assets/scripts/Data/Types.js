const HeroClass = cc.Enum({
    Tank: -1,
    Assasin: -1,
    Shooter: -1,
    Wizard: -1
});

const HeroStats = cc.Enum({
    HP: -1,
    ATK: -1,
    AP: -1
});

const ActiveSkill = cc.Enum({
    None: -1,
    HealOne: -1,
    HealAll: -1,
    Blizzard: -1,
    DeathTouch: -1,
    Beam: -1,
    Slashes: -1,
    StunHammer: -1
});

const PassiveSkill = cc.Enum({
    None: -1,
    AtkUpSelf: -1,
    AtkUpAll: -1,
    ApUpSelf: -1,
    ApUpAll: -1,
    MoveUpAll: -1,
    LeechAll: -1,
    HasteAll: -1,
    RegenAll: -1
});

module.exports = {
    ActiveSkill,
    PassiveSkill,
    HeroClass,
    HeroStats
};