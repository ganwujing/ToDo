//const host="http://todo.migo.group"
const host = "http://localhost:8080"

var express = require("express");
var bodyParser = require("body-parser")
var { v4: uuidv4 } = require('uuid')
var { UsrModel, todoModel } = require('./mongoose')
var app = express();

app.use(bodyParser.json())
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", host);
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //服务端可以发送cookie到客户端
    res.header("Access-Control-Max-Age", "86400");
    next();
});


/**
 * 用户登录
 */
app.post("/verify_usr", function(request, response) {
    const usrinfo = request.body;
    console.log("从前台接受的数据为：" + usrinfo)
    UsrModel.find({ usr_tel: usrinfo.usr_tel }, function(err, result) {
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

                    //登录成功，若cookie值为空，产生session,发送cookie给客户端
                    var sessionID = request.session
                    sessionID.todocookie = JSON.stringify(uuidv4())
                    console.log(sessionID.todocookie);
                    response.setHeader('Set-Cookie', sessionID.todocookie);


                    response.send("101").end();

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
app.post("/register_usr", function(req, res) {
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
                        console.log("注册成功:" + result)
                    }
                })
            }
        }
    })
})

/**
 * 添加todo
 */
app.post('/add_todo', function(req, res) {
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
app.post('/modify_todo', function(req, res) {
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
 * 查询todo
 */
app.get('/get_todo', function(req, res) {
    let date = req.query.date
    let usr_cookie = req.query.usr_cookie
    console.log("后台接受的数据为" + date + usr_cookie)
        //   var tel = searchIDBycookie(usr_cookie)
        // todoModel.find({ date: date, usr_tel: tel }, (err, result) => {
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         console.log(result);
        //         res.send(result).end();
        //     }
        // }).sort({ "timef": 1 })
})

app.listen(3000, () => {
    console.log("ToDo后台管理已上线")
})