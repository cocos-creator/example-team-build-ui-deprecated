cc.Class({
    extends: cc.Component,

    properties: {
        root: cc.Node,
        target: cc.Node,
        originRootScale: 0,
        followDist: 0,
        followSpeed: 0,
        zoomInTime: 0,
        zoomStayTime: 0,
        zoomOutTime: 0,
        zoomToScale: 0
    },

    onLoad () {
        this.targetX = 0;
        this.isFollowing = false;
        this.isZooming = false;
        this.rootPosBeforeZoom = null;
        this.rootTargetPos = null;
        this.root.scale = this.originRootScale;
    },

    zoomToTarget () {
        if (this.isZooming) {
            return;
        }
        this.isZooming = true;
        this.rootPosBeforeZoom = this.root.position;
        this.rootTargetPos = cc.p(-this.target.x, -this.target.y);
        let zoomIn = cc.spawn(cc.moveTo(this.zoomInTime, this.rootTargetPos), cc.scaleTo(this.zoomInTime, this.zoomToScale));
        let zoomOut = cc.spawn(cc.moveTo(this.zoomOutTime, this.rootPosBeforeZoom), cc.scaleTo(this.zoomOutTime, this.originRootScale));
        let callback = cc.callFunc(this.finishZoom, this);
        let action = cc.sequence(zoomIn, cc.delayTime(this.zoomStayTime), zoomOut, callback);
        this.root.runAction(action);
    },

    finishZoom () {
        this.isZooming = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this.target || this.isZooming) {
            return;
        }

        if (Math.abs(this.root.x + this.target.x) > this.followDist) {
            this.isFollowing = true;
            this.targetX = -this.target.x;
        }

        if (this.isFollowing) {
            this.root.position = cc.pLerp(this.root.position, cc.p(this.targetX, this.root.y), this.followSpeed * dt);
        }
    },
});
