var MainScene = cc.Scene.extend({
    ctor:function(chapter){
      this._super();
    },
    onEnter: function () {
        this._super();

        var size = cc.winSize;
        //背景图片
        var bg = new cc.Sprite(res.candyBG);
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        //游戏场景
        var playScene = new PlayScene();
        playScene.x = (size.width - 64 * 10) / 2;
        playScene.y = (size.height - 64 * 10) / 2;
        // this.addChild( this.playScene);

        //添加UI
        var UIlayer = new UILayer(playScene);
        this.addChild(UIlayer,9);

        //遮罩
        var clip = this.clip();
        clip.addChild(playScene);
        this.addChild(clip,7);
    },
    clip: function () {
        var size = cc.winSize;
        var clipNode = new cc.ClippingNode();
        var stencil = new cc.DrawNode();//绘制矩形大小
        stencil.drawRect(
            cc.p(0, 0),     //起点坐标
            cc.p(640, 640), //终点坐标
            cc.color(0, 0, 0),//颜色
        );
        stencil.x = (size.width - (Constant.CANDY_MAXSIZE * 64)) / 2;
        stencil.y = (size.height - (Constant.CANDY_MAXSIZE * 64)) / 2;
        clipNode.stencil = stencil;
        return clipNode;
    }
});

