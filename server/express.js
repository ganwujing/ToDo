const host="http://todo.migo.group"
var express = require("express")()
    //使用中间件获取post请求的body中的数据
var bodyParser = require("body-parser")
var uuid = require("node-uuid")
var cookie = require("cookie-parser")
var session = require("express-session")
express.use(bodyParser.urlencoded({
    extended: false
}))
express.use(bodyParser.json())

express.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", host);
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //服务端可以发送cookie到客户端
    res.header("Access-Control-Max-Age", "86400");
    next();
});
var { mongoose, UsrModel, todoModel } = require('./mongoose')
const { json, response } = require("express")
var cookiesessionArray = []
var cookiesessionitem = {}

/**
 * 判断session对应的用户ID
 */
express.get('/verify_cookie', function(req, res) {
    var usr_tel=searchIDBycookie(req.query.cookie)
    usr_tel!=""?res.send("501"):res.send("502")
    
})

/**判断cookie对应的用户ID */
function searchIDBycookie(cookieVal){
    let cookieval = cookieVal.split('=');
    console.log("cookie值为" + cookieval[1])
    let filterArray = cookiesessionArray.filter(item => item.sessionID == cookieval[1])
    if (filterArray.length == 1) {
        var usr_tel = filterArray[0].usrinfo.usr_tel;
        console.log(usr_tel)
    }
    return usr_tel;
}

/**
 * 用户登录
 */
express.post("/verify_usr", function(request, response) {
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
                    if (usrinfo.cookie == "") {
                        sessionID = uuid();
                        cookiesessionitem.sessionID = uuid();
                        cookiesessionitem.usrinfo = usrinfo;
                        cookiesessionArray.push(cookiesessionitem)
                        cookieVal = cookiesessionitem.sessionID
                        console.log("在内存中的" + JSON.stringify(cookiesessionArray))
                        response.header("Set-Cookie", "logincookie=" + cookieVal + ";Max-Age:360000")


                    }
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
express.post("/register_usr", function(req, res) {
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
express.post('/add_todo', function(req, res) {
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
express.post('/modify_todo', function(req, res) {
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
express.get('/get_todo', function(req, res) {
    let date = req.query.date
    let usr_cookie = req.query.usr_cookie
    console.log("后台接受的数据为" + date + usr_cookie)
    var tel=searchIDBycookie(usr_cookie)
    todoModel.find({ date: date, usr_tel: tel }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result);
            res.send(result).end();
        }
    }).sort({ "timef": 1 })
})

express.listen(3000, () => {
    console.log("ToDo后台管理已上线")
})