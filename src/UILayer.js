var UILayer = cc.Layer.extend({
    //分数，等级，步数显示
    scoreLabel: null,
    levelLabel: null,
    stepLabel: null,
    targetScoreLabel: null,
    limitStepLabel: null,
    playScene: null,
    //胜负判断
    windowStatus: false,//当前是否存在弹出框
    sucessWindow: null,
    failWindow: null,
    ctor: function (playScene) {
        this._super();
        var size = cc.winSize;

        //等级面板
        this.levelLabel = new cc.LabelTTF("等级:1", "楷体", 30);
        this.levelLabel.x = size.width - 600;
        this.levelLabel.y = size.height - 40;
        this.addChild(this.levelLabel);
        //分数面板
        this.scoreLabel = new cc.LabelTTF("分数:0", "楷体", 30);
        this.scoreLabel.x = size.width - 390;
        this.scoreLabel.y = size.height - 40;
        this.addChild(this.scoreLabel);
        //步数面板
        this.stepLabel = new cc.LabelTTF("步数:25", "楷体", 30);
        this.stepLabel.x = size.width - 190;
        this.stepLabel.y = size.height - 40;
        this.addChild(this.stepLabel);
        //目标分数面板
        this.targetScoreLabel = new cc.LabelTTF("目标分数:500", "楷体", 30);
        this.targetScoreLabel.x = size.width - 350;
        this.targetScoreLabel.y = size.height - 90;
        this.addChild(this.targetScoreLabel);
        //限制步数
        this.limitStepLabel = new cc.LabelTTF("限制步数:25", "楷体", 30);
        this.limitStepLabel.x = size.width - 150;
        this.limitStepLabel.y = size.height - 90;
        this.addChild(this.limitStepLabel);
        //分数，等级，步数更新
        this.playScene = playScene;
        this.scheduleUpdate();

        this.schedule(this.show, 1);
    },
    update: function () {
        this.scoreLabel.setString("分数:" + this.playScene.score);
        this.levelLabel.setString("等级:" + this.playScene.level);
        this.stepLabel.setString("步数:" + this.playScene.step);
        this.targetScoreLabel.setString("目标分数:" + this.playScene.targetScore);
        this.limitStepLabel.setString("限制步数:" + this.playScene.limitStep);
    },
    show: function () {
        if (!this.windowStatus
            && this.playScene.score >= this.playScene.targetScore
            && this.playScene.step <= this.playScene.limitStep) {
            this.sucess();
        } else if (!this.windowStatus
            && this.playScene.score < this.playScene.targetScore
            && this.playScene.step >= this.playScene.limitStep) {
            this.fail();
        }
    },
    sucess: function () {
        this.windowStatus = true;
        var size = cc.winSize;
        this.sucessWindow = new cc.LayerColor(cc.color(0, 0, 0, 138), 640, 640);
        this.sucessWindow.name = "sucess";
        var label = new cc.LabelTTF("恭喜通过第" + this.playScene.level + "关!", "楷体", "50");
        this.sucessWindow.x = this.playScene.x
        this.sucessWindow.y = this.playScene.y;
        label.x = (size.width-64) / 2;;
        label.y = this.sucessWindow.y + 150;
        label.setColor(cc.color(0, 0, 0));
        this.sucessWindow.addChild(label);

        this.addChild(this.sucessWindow);


        var startItem = new cc.MenuItemImage(
            res.Start_N_png,
            res.Start_S_png,
            function () {
                this.playScene._init(this.playScene.level + 1);
                this.sucessWindow.removeFromParent();
                this.windowStatus = false;
            }, this);
        startItem.x = (size.width-64) / 2;
        startItem.y = this.sucessWindow.y - 30;
        var menu = new cc.Menu(startItem);
        menu.x = 0;
        menu.y = 0;
        this.sucessWindow.addChild(menu);
    },
    fail: function () {
        this.windowStatus = true;
        var size = cc.winSize;
        this.failWindow = new cc.LayerColor(cc.color(0, 0, 0, 138), 640, 640);
        this.failWindow.name = "fail";
        var label = new cc.LabelTTF("第" + this.playScene.level + "关失败!", "楷体", "50");
        this.failWindow.x = this.playScene.x
        this.failWindow.y = this.playScene.y;
        label.x = (size.width-64) / 2;;
        label.y = this.failWindow.y + 150;
        label.setColor(cc.color(0, 0, 0));
        this.failWindow.addChild(label);

        this.addChild(this.failWindow);


        var startItem = new cc.MenuItemImage(
            res.Start_N_png,
            res.Start_S_png,
            function () {
                this.playScene._init(this.playScene.level);
                this.failWindow.removeFromParent();
                this.windowStatus = false;
            }, this);
        startItem.x = (size.width-64) / 2;
        startItem.y = this.failWindow.y - 30;
        var menu = new cc.Menu(startItem);
        menu.x = 0;
        menu.y = 0;
        this.failWindow.addChild(menu);
    }
})