<template>
  <div>
    <div id="index">
      <header class="index-header">
        <div class="header-logo">
          <img src="../assets/logo.svg" />
        </div>
        <nav class="header-nav">
          <ul>
            <li>
              <a>首页</a>
            </li>
            <li>
              <a href="#product-introduce">产品介绍</a>
            </li>
            <li>
              <a href="#contact-us">联系我们</a>
            </li>
          </ul>
          <button class="btn nav-btn" @click="enterTodo">进入ToDo</button>
        </nav>
        <div class="header-login" >
          <span v-show="!showUid" @click="loginByTel">登录/注册</span>
          <span v-show="showUid">Hello!{{usr_id}}</span>
        </div>
      </header>
      <div class="main product-introduce">
        <h1 class="main-title">
          <span id="product-introduce">产品介绍</span>
        </h1>
        <p class="main-text">
          这是一款记录待办事项的产品，你可以添加每天不同时段要做的事项，当完成待办事项，可以标记完成。
          同时用户可以根据自己的喜好来选择不同的颜色主题。 每天完成当天的任务后你可以选择给自己一个奖励。
          这款产品目的在于督促人们能够有计划的合理的安排好自己的时间，通过奖励机制来增加做事情的动力。
        </p>
      </div>

      <div class="main contact-us">
        <h1 class="main-title">
          <span id="contact-us">联系我们</span>
        </h1>
        <div class="contanct">
          <div class="contanct-item">
            <p>WeChat</p>
            <img class="contact-img" src="../assets/weixin.jpg" />
          </div>
          <div class="contanct-item">
            <p>Weibo</p>
            <img class="contact-img" src="../assets/weibo.jpg" />
          </div>
          <div class="contanct-item">
            <p>QQ</p>
            <img class="contact-img" src="../assets/weibo.jpg" />
          </div>
        </div>
      </div>
      <div class="foot-div">
        <footer class="index-foot">
          <p class="foot-text">Designed by ganwujing.Powered by ganwujing</p>
        </footer>
      </div>
    </div>
    <login
      :isshow="showtellogin"
      :cookie="cookieVal"
      v-on:changeshowpage="isshowpage"
      @showLoginRes="loginSuccess"
    ></login>
  </div>
</template>
<script>
import login from "./login";
export default {
  name: "index",
  components: {
    login,
  },
  data: function () {
    return {
      showtellogin: false,
      cookieVal: "",
      usr_id: "",
      showUid: false,
    };
  },
  beforeCreate: function () {
    this.cookieVal = document.cookie;
    if (this.cookieVal != "") {
      this.axios({
        method: "post",
        url: this.api + "/refresh_page",
        data: this.cookieVal,
        withCredentials: true,
      })
        .then((res) => {
          if (res.data.code === "100") {
            this.usr_id = res.data.usr_id;
            this.showUid = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  methods: {
    loginSuccess: function (data) {
      this.showUid = true;
      this.showtellogin = false;
      this.usr_id = data;
    },
    enterTodo: function () {
      if (document.cookie == "") {
        this.loginByTel();
      } else {
        this.axios({
          method: "post",
          url: this.api + "/enter_todo",
          data: document.cookie,
          withCredentials: true,
        })
          .then((res) => {
            if (res.data.code === "100") {
              //cookie验证成功，转到todo页面
              this.$router.push({
                name: "todo",
              });
            } else {
              this.loginByTel();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    loginByTel: function () {
      this.showtellogin = true;
    },
    isshowpage: function (param) {
      this.showtellogin = param;
    },
    closeShowPage: function (param) {
      this.showtellogin = param;
    },
  },
};
</script>
<style>
* {
  margin: 0 auto;
}

#index {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 100;
  background-image: url('../assets/bg2.png');
}


.index-header {
  position: relative;
  width: 80%;
}


header,
header button {
  font-size: 2rem;
  font-weight: bolder;
  letter-spacing: 2px;
  height: 50px;
  color: white;
}

.header-logo {
  position: absolute;
  left: 40px;
  top: 20px;
}

.header-logo img {
  width: 30%;
}

.logo-svg:hover {
  color: aqua;
}

.header-nav {
  padding-top: 20px;
  width: 70%;
  height: 50px;
  position: relative;
}

.header-nav ul {
  display: flex;
  padding-left: 0;
  width: 45vw;
  height: 35px;
  align-items: center;
  margin-left: 0px;
}

.header-nav li {
  display: inline-block;
  flex: 1;
  text-align: center;
}

.header-nav li a {
  color: white;
  text-decoration: none;
  width: 100%;
}

.header-nav li > a:hover,
.nav-btn:hover,
.header-login:hover {
  color: rgb(255, 251, 0);
}
.nav-btn {
  width: 120px;
  height: 35px;
  font-size: 1.8rem;
  position: absolute;
  right: 60px;
  top: 20px;
}
.btn {
  background-color: rgb(253, 173, 1);
  color: white;
  border: none;
  border-radius: 6px;
  outline: none;
}

.header-login {
  position: absolute;
  right: 60px;
  top: 20px;
  height: 35px;
}

.header-login span {
  line-height: 35px;
  font-size: 1.6rem;
  font-weight: bold;
}

.main {
  width: 80vw;
  color: white;
  line-height: 40px;
  letter-spacing: 3px;
  font-size: 2rem;
  text-shadow: 2px 2px 10px rgba(172, 112, 0, 0.5);
  padding: 30px;
}

.main-title {
  padding: 10px;
  text-align: center;
  color: white;
}

.main-text:hover {
  text-shadow: 2px 2px 10px 12px rgba(172, 112, 0, 0.5);
}
.product-introduce{
  margin-top: 10px;
}

.contanct {
  display: flex;
  width: 80vw;
}

.contanct-item {
  flex-basis: 30%;
  background-color: white;
  border-radius: 5px;
  color: rgb(255, 207, 78);
  text-shadow: none;
  text-align: center;
  margin-top: 10px;
}

.contanct-item:hover {
  box-shadow: 2px 2px 12px 5px rgba(172, 112, 0, 0.5);
}

.contact-img {
  width: 50%;
}

.index-foot {
  text-align: center;
  padding-bottom: 10px;
  font-size: 1.4rem;
  color: grey;
  letter-spacing: 1px;
}
.foot-div{
  position: absolute;
  bottom:0;
  width: 80%;
  left:10%;
}

@media screen and (max-width: 600px){
   .index-header {
  width: 100%;
}
.header-login{
  right: 1%;
}
.nav-btn{
  right: 26%;
}
.header-logo{
  left:1%;
}
.main{
  width: 100vw;
}
.header-nav ul{
  display: none;
}
#index{
  height: auto;
}
.foot-div{
 position: static;
}


}
</style>