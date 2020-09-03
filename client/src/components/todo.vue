<template>
  <div class="todobg">
    <div class="alert-msg">
      <a-alert v-show="successalert" message="添加ToDo事项成功" type="success" show-icon />
    </div>
    <div class="top">
      <div class="fillinfo top-child">
        <h1 class="todo-title">添加ToDO事项</h1>
        <div class="todo-input todo-inputdate">
          <span class="todo-inputText">ToDo日期</span>
          <a-date-picker
            size="large"
            :defaultValue="moment()"
            format="YYYY-MM-DD"
            v-on:change="changedate"
          ></a-date-picker>
          <span class="todo-inputText mobile">ToDo时间</span>
          <div class="todoinput">
          <a-time-picker placeholder="开始时间" format="HH:mm" size="large" v-on:change="changeTimeF"></a-time-picker>
          <a-time-picker placeholder="结束时间" format="HH:mm" size="large" v-on:change="changeTimeT"></a-time-picker>
        </div>
        </div>
        <div class="todo-input todo-inputitem">
          <span class="todo-inputText mobile">ToDo事项</span>
          <div class="todoinput">
            <a-input-search
              placeholder="input todo item"
              enter-button="添加ToDo"
              size="large"
              style="width:80%"
              @search="addToDO"
              v-model="todoitem"
            ></a-input-search>
          </div>
        </div>
        <hr style="background-color:#ececec;border:0;height:5px" />

        <h1 class="todo-title">ToDo时间轴</h1>
        <div class="todo-line">
          <a-timeline>
            <a-timeline-item
              v-for="item in tododata"
              :key="item._id"
              :color="item.status == 'undo' ? 'blue' : 'green'"
              style="padding-bottom:40px"
            >
               <a-icon type="edit"  :style="{fontSize:'18px',marginLeft:'5px'}" />
              <a-icon type="delete" @click="deleteTodo(item)" :style="{fontSize:'18px',marginRight:'20px',marginLeft:'20px'}" />
              <span style="font-weight:bolder">{{ item.timef }}~{{ item.timet }}</span>
              <span style="margin-left:10px">{{ item.item }}</span>
           
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
      <div class="progress top-child">
        <h1 class="todo-title">ToDo待办事项</h1>
        <div style="position:relative;left:18vw;top:-35px">
          <a-switch @change="Showdone" checked-children="不显示Done" un-checked-children="显示Done" />
          <span style="margin-left:3vw">todo日期：</span>
          <a-date-picker :defaultValue="moment()" placeholder="ToDo日期" v-on:change="changeShowDT" />
        </div>
        <div class="todo-list">
          <div
            v-for="item in tododata"
            :key="item._id"
            class="todolist-item"
            v-show="showtododone||item.status=='undo'"
          >
            <a-checkbox
              :checked="item.status=='do'?donechecked:!donechecked"
              @change="modifyTodo(item)"
            >
              <span :style="item.status=='undo'?unfinishtodo:finishtodo">{{item.item}}</span>
            </a-checkbox>
          </div>
        </div>
        <hr style="background-color:#ececec;border:0;height:5px" />
        <h1 class="todo-title">ToDo完成进度</h1>
        <div class="todo-processout">
          <div class="todo-progress-out" v-for="item in tododata" :key="item._id">
            <a-row style="marginBottom:10px">
              <a-col :span="8">
                <a-slider
                  :default-value="item.status=='do'?100:0"
                  :min="0"
                  :max="100"
                  :step="10"
                  @afterChange="changeProcess(item)"
                  @change="beforechangeProcess"
                />
              </a-col>

              <a-col :span="12">
                <span style="fontSize:14px;margin-left:10%">{{ item.item }}</span>
              </a-col>
            </a-row>
          </div>
        </div>

        <div class="todo-progress-circle">
          <a-progress type="circle" :percent="todopercent" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "todo",
  props: {
    tel: String,
  },
  data: function () {
    return {
      tododata: [],
      selectdate: moment().format("YYYY-MM-DD"),
      showdate: moment().format("YYYY-MM-DD"),
      showtododone: true,
      donechecked: true,
      todoitem: "",
      selecttimeF: moment().format("HH:mm"),
      selecttimeT: moment().format("HH:mm"),
      successalert: false,
      docCookie: "",
      fullprocess: 100,
      processvalue: "",
      zeroprocess: 0,
      unfinishtodo: {
        "font-style": "",
        "text-decoration": "",
        color: "",
      },
      finishtodo: {
        "font-style": "italic",
        "text-decoration": "line-through",
        color: "grey",
      },
    };
  },
  created: function () {
    this.getdata();
  },
  computed: {
    todopercent: function () {
      return Math.round((this.doStatusCount / this.tododata.length) * 100);
    },
    doStatusCount: function () {
      return this.tododata.filter((item) => item.status == "do").length;
    },
    undoStatusCount: function () {
      return this.tododata.filter((item) => item.status == "undo").length;
    },
  },
  methods: {
    Showdone: function (checked) {
      this.showtododone = !checked;
    },
    moment,
    changedate: function (date) {
      this.selectdate = moment(date).format("YYYY-MM-DD");
    },
    changeTimeF: function (time) {
      this.selecttimeF = moment(time).format("HH:mm");
    },
    changeTimeT: function (time) {
      this.selecttimeT = moment(time).format("HH:mm");
    },
    changeShowDT: function (date) {
      this.showdate = moment(date).format("YYYY-MM-DD");
      this.getdata();
    },
    cookieIsNull: function () {
      this.docCookie = document.cookie;
      if (this.docCookie == "") {
        alert("登录已过期，请重新登录");
        return false;
      } else {
        return true;
      }
    },
    beforechangeProcess: function (value) {
      this.processvalue = value;
    },
    changeProcess: function (item) {
      var process = this.processvalue;
      if (process == 100 ) {
        item.status="undo"
        this.modifyTodo(item);
      }
      if(process==0){
        item.status="do";
        this.modifyTodo(item);
      }
    },
    getdata: function () {
      let currdate = this.showdate;
      if (this.cookieIsNull()) {
        this.axios({
          method: "get",
          url: this.api + "/get_todo",
          params: {
            date: currdate,
            cookie: this.docCookie,
          },
        })
          .then((res) => {
            if (res.data == "501") {
              alert("请重新登录");
            } else {
              this.tododata = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    deleteTodo:function(item){
        if(this.cookieIsNull()){
            this.axios({
              method:'post',
              data:item,
              url:this.api+'/delete_todo',
              headers:{
                "Content-Type": "application/json;charset=UTF-8",
              },
              withCredentials: true,
            }).then((res)=>{
              if (res.data == "501") {
              alert("请重新登录");
            }
            if (res.data == "601") {
              this.getdata();
            }
            }).catch((err)=>{
              console.log(err);
            })
        }
    },
    modifyTodo: function (item) {
      if (this.cookieIsNull()) {
        const data = {};
        item.status == "undo" ? (data.status = "do") : (data.status = "undo");
        console.log(item._id);
        data._id = item._id;
        // data.cookie = this.docCookie;
        console.log(data.status);
        this.axios({
          method: "post",
          url: this.api + "/modify_todo",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          data: data,
          withCredentials: true,
        })
          .then((res) => {
            if (res.data == "501") {
              alert("请重新登录");
            }
            if (res.data == "401") {
              this.getdata();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    addToDO: function () {
      if (this.cookieIsNull()) {
        var data = {};
        data.date = this.selectdate;
        data.timef = this.selecttimeF;
        data.timet = this.selecttimeT;
        data.item = this.todoitem;
        data.status = "undo";
        data.usr_tel = this.docCookie.split("&")[0].split("=")[1];

        this.axios({
          method: "post",
          url: this.api + "/add_todo",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          data: data,
          withCredentials: true,
        })
          .then((res) => {
            if (res.data == "501") {
              alert("请重新登录");
            }
            if (res.data == "301") {
              this.successalert = true;
              setTimeout(() => {
                this.successalert = false;
              }, 3000);
              this.todoitem = "";
            }
            this.getdata();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>
<style>
.alert-msg {
  position: fixed;
  right: 50px;
  top: 80vh;
  z-index: 500;
  width: 200px;
}
.todobg {
  background-color: #ececec;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  font-size: 16px;
  font-family: microsoft;
  position: absolute;
}
.top {
  display: flex;

  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.child {
  height: 200px;
}

.fillinfo,
.todotable {
  flex-basis: 47.5%;
  margin-left: 2%;
}
.progress,
.todoline {
  flex-basis: 47.5%;
  margin-right: 2%;
}
.fillinfo,
.todotable,
.progress,
.todoline {
  background-color: #ffffff;
  margin-bottom: 20px;
  border-radius: 5px;
  /* box-shadow: 2px 4px 8px 5px rgba(216, 164, 67, 0.5); */
}

.todoinput {
  /* width: 70%; */
  position: relative;
  top: -30px;
  right: -18%;
}

.todo-inputText {
  margin: 4%;
}

.ant-progress-bg {
  float: left;
}

.todo-input,
.todo-progress,
.todo-table,
.todo-line {
  margin: 20px 0px;
  margin-left: 6%;
}
.todo-list {
  margin-left: 10%;
}
.todolist-item {
  margin-bottom: 10px;
  font-size: 20px;
}
.todo-progress {
  margin: 10px 0px;
  margin-left: 5%;
  font-size: 14px;
}
.todo-progress-circle {
  position: absolute;
  right: 8%;
  top: 100px;
}
@font-face {
  font-family: microsoft;
  src: url("../assets/microsoft.ttf");
}
.todo-title {
  padding-top: 20px;
  font-size: 20px;
  font-family: microsoft;
  letter-spacing: 2px;
  font-weight: bold;
  margin-left: 2%;
}
.todo-line {
  margin-top: 30px;
  margin-left: 10%;
}
.todo-list {
  margin-top: -20px;
}
.todo-processout {
  margin-top: 20px;
  margin-left: 10%;
}
@media screen and (max-width: 600px){
  .top{
    display:block;
  }
  .fillinfo, .todotable {
    margin-left: 0;
}
.progress, .todoline {
    margin-right: 0;
}
.mobile{
  display: block;
}
.todoinput{
  position: relative;
  left: 5%;
  top: -10px;
}

}
</style>
