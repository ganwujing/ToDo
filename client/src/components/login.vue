<template>
    <div v-show="isshow" class="loginpage">
        <div class="mask"></div>
        <div class="tel-login">
            <div class="tellogin-head">
                <span >登录</span>
                <img src="../assets/close.svg"  @click="$emit('changeshowpage',false)">
            </div>
            <div class="tellogon-body">
                <input class="input logintel login-input " placeholder="请输入手机号" v-model="telinput">
                <input class="input logintel login-input " placeholder="请输入密码" v-model="pwdinput">
                    <button class="btn  login-btn" @click="sendTelCode">登录</button>
                <span>没有账号？<a  @click="openRegisterPage" >去注册</a></span>
                <span style="color:red">{{msg}}</span>
            </div>
        </div>
        <register :showregister="isshowregister" v-on:closeshowpage="closeRegisterPage"></register>
    </div>
</template>
<script>
import register from './register'
export default {
    name:'tellogin',
    props:{
        isshow:Boolean,
    },
    components:{
        register,
    },
    data:function(){
        return{
           telinput:'',
           pwdinput:'',
           isshowregister:false,
           msg:'',
           todourl:'',
        }
    },
    methods:{
        openRegisterPage:function (){
             this.isshowregister=true
        },
        closeRegisterPage:function(){
            this.isshowregister=false
        },
       sendTelCode:function(){
            var data={}
            data.usr_tel=this.telinput
            data.usr_pwd=this.pwdinput
            //查找用户是否存在，以及密码是否正确
            this.axios({
                method:'POST',
                url:this.api+"/verify_usr",
                data:data
            }).
            then((res)=>{
                if(res.data=="103"){
                    this.msg="号码不存在,请注册"
                }
                if(res.data=="102"){
                    this.msg="密码错误"
                    this.pwdinput=""
                }
                if(res.data=="101"){
                    this.msg="登录成功"
                    this.$router.push(
                        {
                            name:'todo',
                            params:{
                                tel:this.telinput
                            }
                        }
                    );
                }
            }).catch((err)=>{
                console.log("axios传输失败:"+err)
            })
       }
    }
}
</script>
<style>
.loginpage{
    width: 100vw;
}
.mask{
    z-index: 101;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    background-color: black;
    opacity: 0.5;
}
.tel-login{
    z-index: 102;
    position: fixed;
    width: 30vw;
    height: 400px;
    top: 10vw;
    left: 35vw;
    background-color: white;
    font-size: 18px;
}
.tellogin-head{
    width: 80%;
    padding: 20px;
    margin: 0 auto;
}
.tellogin-head img{
    float: right;
}
.logintel{
display: block;
}
.login-input{
    
    width: 50%;
    height: 40px;
    margin: 20px;
    margin-left: 25%;
}
.input{
    border-radius: 6px;
    outline: none;
    border: 1px rgb(253, 173, 1) solid;
    text-indent: 5px;
}
.login-verifycode{
    float: left;
    width: 52%;
    height: 40px;
    border-top-right-radius:0px ;
    border-bottom-right-radius:0px ;
}
.login-input button{
    float: left;
    width: 45%;
    height: 44px;
    border-top-left-radius:0px ;
    border-bottom-left-radius:0px ;
}
.login-btn{
    display: block;
    margin: 0 auto;
    width: 50%;
    height: 40px;
    font-size: 18px;
}
.login-btn~span{
    display: block;
    text-align: center;
    margin-top: 20px;
}
.login-btn+span a{
    color:rgb(253, 173, 1);
    text-decoration: none;
}

</style>>
