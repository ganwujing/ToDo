import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './route'
import 'ant-design-vue/dist/antd.less'

//按需引入需要的ant组件
import {
    TimePicker,
    Button,
    DatePicker,
    Timeline,
    Progress,
    Input,
    Table,
    Icon,
    Tag,
    Divider,
    Alert,
    Checkbox,
    Switch,
    Slider,
    Row,
    Col,
    InputNumber,
} from 'ant-design-vue'
Vue.component(TimePicker.name, TimePicker)
Vue.component(Button.name, Button)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Timeline.name, Timeline)
Vue.component(Progress.name, Progress)
Vue.component(Input.name, Input)
Vue.component(Table.name, Table)
Vue.component(Icon.name, Icon)
Vue.component(Tag.name, Tag)
Vue.component(Divider.name, Divider)
Vue.component(Alert.name, Alert)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Switch.name, Switch)
Vue.component(Slider.name, Slider)
Vue.component(Slider.name, Slider)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(InputNumber.name, InputNumber)





Vue.use(Timeline)
Vue.use(Input)

Vue.config.productionTip = false
Vue.prototype.axios = axios

//Vue.prototype.api = "http://migo.group:3000"
Vue.prototype.api = "http://localhost:3000"

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')