var CandySprite = cc.Sprite.extend({

    type:null,//颜色类型
    column:0,//坐标
    row:0,//坐标
    ctor:function (type,column,row) {
        this._init(type,column,row);
        this._super("res/"+type+".png");
    },
    _init:function (type,column,row) {
        this.type = type;
        this.column = column;
        this.row = row;
    },
});
CandySprite.createCandy = function (column,row) {
    return new CandySprite(parseInt(Math.random() * Constant.CANDYCOUNT) + 1,column,row);
}