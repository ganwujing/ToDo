<template>
     <div v-show="showregister">
        <div class="tel-login">
            <div class="tellogin-head">
                <span >注册</span>
                <img src="../assets/close.svg"  @click="$emit('closeshowpage',false)">
            </div>
            <div class="tellogon-body">
                <input class="input logintel login-input " placeholder="请输入手机号" v-model="telinput">
                <input type="password" class="input logintel login-input " placeholder="请输入密码" v-model="pwdinput">
                <input type="password" class="input logintel login-input " placeholder="再次输入密码" v-model="twopwdinput">
                    <button class="btn  login-btn" v-on:click="register">注册</button>
                <span style="color:red">{{msg}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'tellogin',
    props:{
        showregister:Boolean,
    },
    data:function(){
        return{
            telinput:'',
            pwdinput:'',
            twopwdinput:'',
            msg:'',
           
        }
    },
    methods:{
        register:function(){
            if(this.pwdinput!=this.twopwdinput){
                this.msg="两次密码不一致"
            }
            else{
                this.msg=""
                //后端发送注册信息
                var data={}
                data.usr_tel=this.telinput
                data.usr_pwd=this.pwdinput
                this.axios({
                    method:'post',
                    url:this.api+"/register_usr",
                    data:data
                }).then((res)=>{
                    if(res.data=="201"){
                        this.msg="注册成功，请登录"
                    }
                    if(res.data=="202"){
                        this.msg="账号已注册"
                    }
                  
                }).catch((err)=>{
                    console.log(err)
                })
            }

        }
    }
    
}
</script>