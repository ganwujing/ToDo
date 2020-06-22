var mongoose = require('mongoose')
var mongooseUrl = "mongodb://127.0.0.1:27017/ToDo_Db"
mongoose.connect(mongooseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        if (err) {
            console.log("连接数据库失败")
        } else {
            console.log("连接数据库成功")
        }
    })
    //定义Schema结构
const usrSchema = mongoose.Schema({
        usr_tel: { type: String, require: true },
        usr_pwd: { type: String, require: true },
    })
    //定义Model
const UsrModel = mongoose.model('usr_infos', usrSchema)

//定义todo表
const todoSchema = mongoose.Schema({
    date: { type: String, require: true },
    timef: { type: String, require: true },
    timet: { type: String, require: true },
    item: { type: String, require: true },
    status: { type: String, require: true },
    usr_tel: { type: String, require: true },
})
const todoModel = mongoose.model('todo_info', todoSchema)

//insert
// const usr = {
//     usr_tel: "1235",
//     usr_pwd: "123"
// }
// insertOne(UsrModel, usr);

//search
//searchOne(UsrModel);

//delete
// deleteOne(UsrModel);

//update
//update(userModel)
var insertOne = function(UsrModel, usr) {
    const newModel = new UsrModel(usr);
    newModel.save((err, user) => {
        if (err) {
            console.log("插入失败")
        } else {
            console.log(user)
        }
    })
}

var deleteOne = function(UsrModel) {
    UsrModel.deleteOne({ usr_tel: '12345' }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

var searchOne = function(UsrModel) {
    UsrModel.find((err, user) => {
        if (err) {
            console.log("查询失败")
        } else {
            console.log(user)
        }
    })
}

var update = function(userModel) {
    userModel.findByIdAndUpdate({ _id: '5cdfacc55684652a08b49014' }, { username: '一个老板' }, function(err, user) {
        console.log(err, user)
    })
}

module.exports = { mongoose, UsrModel, todoModel };