/**
 * 用于被node调用，然后运行程序
 * */


var express=require('express');
var config=require('./config/index');

var port=9000;

var app=express();

var router=express.Router();

router.get('/',function(req,res,next){
  req.url='index.html';
  next();
});


app.use(router);

var appDate=require('./data.json')
var seller=appDate.seller
var goods=appDate.goods
var ratings=appDate.ratings

var apiRoutes=express.Router();

app.get('/api/seller',function (req,res) {
  res.json({//错误的情况下返回的json
    errno:0,
    data:seller
  })
}),

  app.get('/api/goods',function (req,res) {
    res.json({//错误的情况下返回的json
      errno:0,
      data:goods
    })
  }),

  app.get('/api/ratings',function (req,res) {
    res.json({//错误的情况下返回的json
      errno:0,
      data:ratings
    })
  })

app.use('/api',apiRoutes);//使用数据


app.use(express.static('./dist'));

module.exports=app.listen(port,function (err) {
  if (err){
    console.log(err)
    return
  }
  console.log('listening at http://localhost:'+port+'\n')

});
