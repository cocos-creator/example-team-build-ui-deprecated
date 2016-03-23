const TabSize = cc.Class({
    name: 'TabSize',
    properties: {
        topMin: '',
        topMax: '',
        botMin: '',
        botMax: ''
    }
});

const TabSidebar = require('TabSidebar');

cc.Class({
    extends: cc.Component,

    properties: {
        tabSizes: {
            default: [],
            type: TabSize
        },
        tabs: {
            default: [],
            type: TabSidebar
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
