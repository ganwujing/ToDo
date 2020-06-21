<template>
    <div class="todobg">
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
                    <a-time-picker
                        placeholder="开始时间"
                        format="HH:mm"
                        size="large"
                        v-on:change="changeTimeF"
                    ></a-time-picker>
                    <a-time-picker
                    placeholder="结束时间"
                        format="HH:mm"
                        size="large"
                        v-on:change="changeTimeT"
                    ></a-time-picker>
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
                    >
                    </a-input-search>
                    </div>
                </div>

                 <h1 class="todo-title">ToDo待办事项</h1>
            <div class="todo-table">
                <a-table :columns="columns" :data-source="tododata">
                    <a slot="name" slot-scope="text">{{ text }}</a>
                    <span slot="customTitle"
                        ><a-icon type="smile-o" /> Name</span
                    >
                    <span slot="tags" slot-scope="tags">
                        <a-tag
                            v-for="tag in tags"
                            :key="tag"
                            :color="
                                tag === 'loser'
                                    ? 'volcano'
                                    : tag.length > 5
                                    ? 'geekblue'
                                    : 'green'
                            "
                        >
                            {{ tag.toUpperCase() }}
                        </a-tag>
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a>Invite 一 {{ record.name }}</a>
                        <a-divider type="vertical" />
                        <a>Delete</a>
                        <a-divider type="vertical" />
                        <a class="ant-dropdown-link">
                            More actions <a-icon type="down" />
                        </a>
                    </span>
                </a-table>
                </div>
            </div>
            <div class="progress top-child">
                <h1 class="todo-title">
                    ToDo完成进度
                </h1>
                <div style="width: 50%" class="todo-progress" v-for="item in tododata" :key="item._id" >
                    <span >{{item.item}}</span>
                    <a-progress  :percent="item.status=='undo'?'0':'100'" size="small" />
                   
                </div>
                <div class="todo-progress-circle">
                    <a-progress type="circle" :percent="75" />
                </div>

                 <h1 class="todo-title">ToDo时间轴</h1>
                <div class="todo-line">
                <a-timeline >
                    <a-timeline-item 
                    v-for="item in tododata" :key="item._id"
                    :color="item.status=='undo'?'blue':'red'" 
                    style="padding-bottom:40px"
                    >
                       {{item.timef}}~{{item.timet}}
                       <span>{{item.item}}</span>
                    </a-timeline-item>
                </a-timeline>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
const config ={
   tododate:moment().format('YYYY-MM-DD'),
}
const columns = [
    {
        dataIndex: "name",
        key: "name",
        slots: { title: "customTitle" },
        scopedSlots: { customRender: "name" },
    },
    {
        title: "Age",
        dataIndex: "age",
        key: "age",
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
    },
    {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        scopedSlots: { customRender: "tags" },
    },
    {
        title: "Action",
        key: "action",
        scopedSlots: { customRender: "action" },
    },
];

//const data = showTodo
import moment from "moment"
export default {
    name: "todo",
    props:{
        usr_tel:String
    },
    data: function() {
        return {
            tododata:[],
            columns,
            selectdate:moment().format('YYYY-MM-DD'),
            todoitem:'',
            selecttimeF:moment().format('HH:mm'),
            selecttimeT:moment().format('HH:mm'),
            
        };
    },
    created:function(){
            this.getdata();
    },
    computed:{
 
    },
    methods: {
        getdata:function(){
            let currdate=config.tododate
            this.axios({
                method:'get',
                url:this.api+'/get_todo',
                params:{
                    date:currdate,
                }
            }).then((res)=>{
                this.tododata=res.data;
                console.log(this.tododata)
            }).catch((err)=>{
                console.log(err)
            })
        },
        moment,
        changedate:function(date){
         this.selectdate= moment(date).format('YYYY-MM-DD')
        },
        changeTimeF:function(data){
            this.selecttimeF=moment(data).format('HH:mm')
        },
        changeTimeT:function(data){
            this.selecttimeT=moment(data).format('HH:mm')
        },
        addToDO: function() {
            var data={}
            data.date=this.selectdate;
            data.timef=this.selecttimeF;
            data.timet=this.selecttimeT;
            data.item=this.todoitem;
            data.status="undo"
            this.axios({
                method:'post',
                url:this.api+'/add_todo',
                data:data,
            }).then((res)=>{
                if(res.data=="301"){
                    alert("success")
                    this.todoitem="";
                }
                console.log(res.data)
                console.log(this.usr_tel)
                this.getdata();
            }).catch((err)=>{
                console.log(err)
            })
        },       
    },
   
};
</script>
<style>
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
.todoline{
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

.todo-input,.todo-progress ,.todo-table,.todo-line{
    margin:20px 0px;
    margin-left: 5%;
}
.todo-progress{
    margin:10px 0px;
    margin-left: 5%;
}
.todo-progress-circle{
    position: absolute;
    right: 8%;
    top: 100px;
}
@font-face {
    font-family: microsoft;
    src: url('../assets/microsoft.ttf');
}
.todo-title{
    margin-top: 20px;
    font-size: 20px;
    font-family: microsoft;
    letter-spacing: 2px;
    font-weight: bold;
    margin-left:2% ;
}

</style>
