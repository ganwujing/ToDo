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
                    ></a-date-picker>
                    <span class="todo-inputText">ToDo时间</span>
                    <a-time-picker
                        :default-value="moment()"
                        format="HH:mm"
                        size="large"
                    ></a-time-picker>
                </div>
                <div class="todo-input todo-inputitem">
                    <span class="todo-inputText">ToDo事项</span>
                    <div class="todoinput">
                    <a-input-search
                        placeholder="input todo item"
                        enter-button="添加ToDo"
                        size="large"
                        @search="addToDO"
                        
                    >
                    </a-input-search>
                    </div>
                </div>
            </div>
            <div class="progress top-child">
                <h1 class="todo-title">
                    今日完成进度
                </h1>
                <div style="width: 50%" class="todo-progress">
                    <span>事项一</span>
                    <a-progress :percent="30" size="small" />
                    <span>事项二</span>
                    <a-progress :percent="50" size="small" />
                    <span>todo前端静态页面</span>
                    <a-progress :percent="100" size="small" />
                </div>
                <div class="todo-progress">
                    <a-progress type="circle" :percent="75" />
                </div>
            </div>
        </div>
        <div class="top">
            <div class="todotable">
            <h1 class="todo-title">ToDo待办事项</h1>
            <div class="todo-table">
                <a-table :columns="columns" :data-source="data">
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
            <div class="todoline">
                <h1 class="todo-title">今日待办时间轴</h1>
                <div class="todo-line">
                <a-timeline >
                    <a-timeline-item color="green">
                        Create a services site 2015-09-01
                    </a-timeline-item>
                    <a-timeline-item color="green">
                        Create a services site 2015-09-01
                    </a-timeline-item>
                    <a-timeline-item color="red">
                        <p>Solve initial network problems 1</p>
                        <p>Solve initial network problems 2</p>
                        <p>Solve initial network problems 3 2015-09-01</p>
                    </a-timeline-item>
                    <a-timeline-item>
                        <p>Technical testing 1</p>
                        <p>Technical testing 2</p>
                        <p>Technical testing 3 2015-09-01</p>
                    </a-timeline-item>
                    <a-timeline-item color="gray">
                        <p>Technical testing 1</p>
                        <p>Technical testing 2</p>
                        <p>Technical testing 3 2015-09-01</p>
                    </a-timeline-item>
                    <a-timeline-item color="gray">
                        <p>Technical testing 1</p>
                        <p>Technical testing 2</p>
                        <p>Technical testing 3 2015-09-01</p>
                    </a-timeline-item>
                </a-timeline>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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

const data = [
    {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
    },
    {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
    },
];
import moment from "moment"
export default {
    name: "todo",

    methods: {
        moment,
        addToDO: function() {},
    },
    data: function() {
        return {
            data,
            columns,
        };
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
    flex-basis: 45%;
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
    right: -20%;
}

.todo-inputText {
    margin: 5%;
}

.ant-progress-bg {
    float: left;
}
.todo-progress {
    float: left;
}
.todo-input,.todo-progress ,.todo-table,.todo-line{
    margin:20px 0px;
    margin-left: 5%;
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
