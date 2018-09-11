var PlayScene = cc.Scene.extend({

    candySprite: null,
    score: 0,//得分数
    level: 0,//等级
    step: 0,//已走步数
    targetScore: 0,//目标分数
    limitStep: 0,//限制步数
    ctor: function (chapter) {
        this._super();
        this.candySprite = [];
        this._init(0);
        //console.log("准备生成糖果");
        //添加糖果
        for (var i = 0; i < Constant.CANDY_MAXSIZE; i++) {
            var column = [];
            for (var j = 0; j < Constant.CANDY_MAXSIZE; j++) {
                var candy = CandySprite.createCandy(i, j);
                candy.x = 64 * i + 32;
                candy.y = 64 * j + 32;
                this.addChild(candy);
                column.push(candy);
            }
            this.candySprite.push(column);
        }
        //console.log("糖果生成成功");
        this._addEvent();
    },
    //初始化
    _init: function (level) {
        this.level = level;
        this.score = 0;
        this.step = 0;
        this.limitStep = Constant.level[this.level].limitStep;
        this.targetScore = Constant.level[this.level].targetScore;
    },
    //添加事件
    _addEvent: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this._onMouseDown.bind(this)
        }, this);
    },
    //鼠标点击事件，获取糖果在数组中的位置
    _onMouseDown: function (event) {
        var pos = event.getLocation();
        var size = cc.winSize;
        //限制鼠标点击范围
        if (pos.x >= this.x && pos.x <= this.x + Constant.CANDY_MAXSIZE * 64
            && pos.y >= this.y && pos.y <= this.y + Constant.CANDY_MAXSIZE * 64) {
            var column = Math.floor((pos.x - this.x) / 64);
            var row = Math.floor((pos.y - this.y) / 64);
            //位置正确
            // console.log(column)
            // console.log(row);
            this.step++;
            this._popCandy(column, row);
        }
    },
    //弹出糖果
    _popCandy: function (column, row) {

        var pool = [this.candySprite[column][row]];//选择的糖果加入糖果池
        var index = 0;//当前糖果池的中糖果的个数
        //向糖果池中添加糖果
        var addpool = function (candy) {
            if (pool.indexOf(candy) < 0) {
                pool.push(candy);
            }
        }
        //对已在糖果池中的糖果四个方向循环，颜色相同加入到池中，直到糖果池中没有糖果
        while (index < pool.length) {
            //console.log("poolLength:" + pool.length);
            var candy = pool[index];//当前糖果
            column = candy.column;
            row = candy.row;
            //向上找
            console.log(this.candySprite[column][row].type);
            if (this._checkExist(column + 1, row) && this.candySprite[column + 1][row].type == candy.type) {
                addpool(this.candySprite[column + 1][row]);
            }
            //向下找
            if (this._checkExist(column - 1, row) && this.candySprite[column - 1][row].type == candy.type) {
                addpool(this.candySprite[column - 1][row]);
            }
            //向左找
            if (this._checkExist(column, row - 1) && this.candySprite[column][row - 1].type == candy.type) {
                addpool(this.candySprite[column][row - 1]);
            }
            //向右找
            if (this._checkExist(column, row + 1) && this.candySprite[column][row + 1].type == candy.type) {
                addpool(this.candySprite[column][row + 1]);
            }
            index++;
            //console.log("index:" + index);
        }
        //判断连通的个数
        if (index <= 2) {
            return;
        } else {
            //消除自己
            for (var i = 0; i < pool.length; i++) {
                var candy = pool[i];
                this.removeChild(candy);
                this.candySprite[candy.column][candy.row] = null;

            }
            this.score += pool.length * pool.length;
            //生成新节点并下落
            this._generateCandy();
        }

    },
    //检查周围是否存在相同糖果
    _checkExist: function (column, row) {
        if (column < 0 || column >= 10 || row < 0 || row >= 10) {
            return false;
        } else {
            return true;
        }
    },
    //糖果下落
    _generateCandy: function () {
        for (var i = 0; i < Constant.CANDY_MAXSIZE; i++) {
            var misscount = 0;
            for (var j = 0; j < this.candySprite[i].length; j++) {
                var candy = this.candySprite[i][j];
                if (!candy) {     //如果该位置是空,生成糖果
                    var newCandy = CandySprite.createCandy(i, 10 + misscount);//设置到显示外
                    newCandy.column = i;
                    newCandy.row = 10 + misscount;
                    newCandy.x = newCandy.column * 64 + 32;
                    newCandy.y = (10 + misscount) * 64 + 32;
                    this.addChild(newCandy);
                    this.candySprite[i][newCandy.row] = newCandy;
                    misscount++;
                } else {
                    if (misscount > 0) {
                        var move = cc.moveTo(1, candy.x, candy.y - 64 * misscount);
                        candy.runAction(move);
                        this.candySprite[i][j] = null;
                        candy.row -= misscount;
                        this.candySprite[i][j - misscount] = candy;
                    }
                }
            }
            for (var j = this.candySprite[i].length; j >= 10; j--) {
                this.candySprite[i].splice(j, 1);
            }
        }
    }
})