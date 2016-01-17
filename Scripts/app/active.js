Vue.config.debug = true;

var depresource = Vue.resource('/api/department{/id}');
var userresource = Vue.resource('/api/user{/id}');
var app = new Vue({
    http: {
        root: '/root',
        headers: {
            Authorization: 'Basic YXBpOnBhc3N3b3Jk'
        }
    },
    el: '#app',
    compiled: function () {
        var self = this;
        //加载部门
        depresource.get({ id: 1 }).then(function (response) {
            // set data on vm
            self.$data.depitems = response.data;
        }, function (error) {
            // handle error
            console.log(error);
            console.log('ajax发生异常');
        });
    },
    data: {
        v: {
            f_relative: '选择关系',
            f_depname: '选择部门',
            f_depid: 0
        },
        depitems: [],
        //紧急联系人
        e:{
            relativeitems: [
                { text: '亲属' },
                { text: '邻居' },
                { text: '朋友' }
            ]
        }
    },
    methods: {
        selectdepfn: function (dep) {
            this.$data.v.f_depname = dep.deptName;
            this.$data.v.f_depid = dep.deptId;
        },
        selectrelpfn: function (rel) {
            this.$data.v.f_relative = rel.text;
        }


    }
});
