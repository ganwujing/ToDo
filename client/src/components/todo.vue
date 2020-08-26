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
          <span class="todo-inputText">ToDo时间</span>
          <a-time-picker placeholder="开始时间" format="HH:mm" size="large" v-on:change="changeTimeF"></a-time-picker>
          <a-time-picker placeholder="结束时间" format="HH:mm" size="large" v-on:change="changeTimeT"></a-time-picker>
        </div>
        <div class="todo-input todo-inputitem">
          <span class="todo-inputText">ToDo事项</span>
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
      </div>
      <div class="progress top-child">
        <h1 class="todo-title">ToDo完成进度</h1>
        <div style="width: 50%" class="todo-progress" v-for="item in tododata" :key="item._id">
          <span>{{ item.item }}</span>
          <a-progress :percent="item.status == 'undo' ? 0 : 100" size="small" />
        </div>
        <div class="todo-progress-circle">
          <a-progress type="circle" :percent="todopercent" />
        </div>

        <h1 class="todo-title">ToDo时间轴</h1>
        <div class="todo-line">
          <a-timeline>
            <a-timeline-item
              v-for="item in tododata"
              :key="item._id"
              :color="item.status == 'undo' ? 'blue' : 'green'"
              style="padding-bottom:40px"
            >
              {{ item.timef }}~{{ item.timet }}
              <span>{{ item.item }}</span>
            </a-timeline-item>
          </a-timeline>
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
  background-color: #ffecb3;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  font-size: 16px;
  font-family: microsoft;
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
  flex-basis: 50%;
}
.progress,
.todoline {
  flex-basis: 48%;
}
.fillinfo,
.todotable,
.progress,
.todoline {
  background-color: #fafafa;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 2px 4px 8px 5px rgba(216, 164, 67, 0.5);
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
  margin-left: 5%;
}
.todo-list {
  float: left;
  margin-left: 10%;
}
.todolist-item {
  margin-bottom: 20px;
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
  margin-top: 20px;
  font-size: 20px;
  font-family: microsoft;
  letter-spacing: 2px;
  font-weight: bold;
  margin-left: 2%;
}
</style>
