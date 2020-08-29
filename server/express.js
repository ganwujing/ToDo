//const host="http://todo.migo.group"
const host = "http://localhost:8080"

var express = require("express");
var bodyParser = require("body-parser")
var { v4: uuidv4 } = require('uuid')
var { UsrModel, todoModel } = require('./mongoose')
var app = express();

app.use(bodyParser.json())
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", host);
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //服务端可以发送cookie到客户端
    res.header("Access-Control-Max-Age", "86400");
    next();
});

/**
 * 创建cookie
 */
function createCookie(usrinfo, uid, response) {
    var sid = uuidv4();
    console.log(sid);
    return new Promise(function (resolve, reject) {
        todoModel.findOneAndUpdate({ id: usrinfo._id }, { session_id: sid }, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                var cookie = "uid=" + uid + "&" + "sid=" + sid;
                var exp = new Date();
                exp.setTime(exp.getTime() + 60 * 1000*60*24);//过期时间 2分钟
                var maxAge = ";expires=" + exp.toGMTString();
                response.setHeader('Set-Cookie', cookie+maxAge);
                resolve();
            }
        })
    })
}

/**
 * 验证cookie
 */
app.all(['/refresh_page', '/enter_todo', '/add_todo', '/modify_todo','delete_todo', '/get_todo'], function (req, res, next) {
    var url = req.baseUrl || req.originalUrl.split('?')[0];
    console.log('!!!URL:'+url);
    console.log(url);
    var cookie = req.headers.cookie;

    if (url == '/get_todo') {
        cookie = req.query.cookie;
    }

    console.log("接收到的cookie" + cookie)
    try {
        var splitcookie = cookie.split('&');
        var usr_id = splitcookie[0].split('=')[1];
        var session_id = splitcookie[1].split('=')[1];
    } catch (error) {
        res.send();
    }

    UsrModel.find({ usr_tel: usr_id }, { session_id: session_id }, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        else if (result.length == 0) {
            res.send("501")
        }
        else {
            if (url == "/refresh_page" || url == '/enter_todo') {
                result = new Object();
                result.usr_id = usr_id;
                result.code = "100"
                res.send(result);
            }
            else{
                next();
            }
        }
    })
})

/**
 * 添加todo
 */
app.post('/add_todo', function (req, res) {
    let data = req.body
    let newtodoModel = new todoModel(data);
    newtodoModel.save((err, result) => {
        if (err) {
            console.log("添加事项失败")
        } else {
            res.send("301").end();
            console.log("添加事项成功" + result)
        }
    })
})

/**
 * 修改todo
 */
app.post('/modify_todo', function (req, res) {
    let data = req.body
    todoModel.findOneAndUpdate({ _id: data._id }, { status: data.status }, (err, result) => {
        if (err) {
            console.log("修改事项失败")
        } else {
            res.send("401").end();
            console.log("修改事项成功" + result)
        }
    })
})

/**
 * 删除todo
 */
app.post('/delete_todo',function(req,res){
    let data=req.body;
    todoModel.findByIdAndDelete({_id:data._id},(err,result)=>{
        if(err){
            console.log('删除事项失败')
        }
        else{
            res.send("601").end();
        }
    })
})

/**
 * 查询todo
 */
app.get('/get_todo', function (req, res) {
    let date = req.query.date
    var cookie = req.query.cookie;
    var splitcookie = cookie.split('&');
    var usr_id = splitcookie[0].split('=')[1];
    console.log('我要查'+date+'\t\t'+usr_id);
    todoModel.find({ date: date, usr_tel: usr_id }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result);
            res.send(result).end();
        }
    }).sort({ "timef": 1 })
})


/**
 * 用户登录
 */
app.post("/verify_usr", function (request, response) {
    const usrinfo = request.body;
    const uid = usrinfo.usr_tel;
    UsrModel.find({ usr_tel: uid }, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            if (result.length == 0) {
                console.log("没有查询到手机号" + result)
                response.send("103").end();
            } else {
                console.log("查询到手机号为：" + result)
                //判断密码是否相同
                if (result[0].usr_pwd === usrinfo.usr_pwd) {
                    //登录成功，产生sid
                    createCookie(usrinfo, uid, response)
                        .then(() => {
                            response.send("101").end();
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                } else {
                    response.send("102").end();
                }
            }
        }
    })
})

/**
 * 用户注册
 */
app.post("/register_usr", function (req, res) {
    const data = req.body;
    //查找手机号是否已经注册过
    UsrModel.find({ usr_tel: data.usr_tel }, (err, result) => {
        if (!err) {
            if (result.length != 0) {
                res.send("202").end()
            } else {
                const newUsrModel = new UsrModel(data)
                newUsrModel.save((err, result) => {
                    if (err) {
                        console.log("注册账号失败")
                    } else {
                        res.send("201").end();
                    }
                })
            }
        }
    })
})


app.listen(3000, () => {
    console.log("ToDo后台管理已上线")
})