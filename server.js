let express = require('express');
let bodyParser = require('body-parser')
let app = express();
const config = require('./config.js');

app.use(bodyParser.json());
app.use(function(req,res,next){
    if((!req.query.code&&req.url==='/')||req.query.winzoom||req.query.from){
        return res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.appId+'&redirect_uri='+config.serverUrl+'&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect');
    }
    next();
});
app.use(express.static(__dirname + '/view'));
const routes = require('./routes/index')(app);
app.listen(8059);
