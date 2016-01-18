Vue.config.debug = true;

var depresource = Vue.resource('/api/department{/id}');
var userresource = Vue.resource('/active/userall');

//自定义指令
Vue.directive('select', {
    twoWay: true,
    priority: 1000,
    params: ['options'],
    bind: function() {
        var self = this;
        $(this.el).select2({
            data: this.params.options,
            placeholder: "输入姓名 确认身份",
            allowClear: true
        }).on('change', function () {
            self.set(this.value);
        })
    },
    update: function (value) {
        $(this.el).val(value).trigger('change')
    },
    unbind: function () {
        $(this.el).off().select2('destroy')
    }
});

var app = new Vue({
    http: {
        root: '/root',
        headers: {
            Authorization: 'Basic YXBpOnBhc3N3b3Jk'
        }
    },
    el: '#app',
    compiled: function () {
        console.log('compiled');
        var self = this;
        //加载部门
        depresource.get().then(function (response) {
            console.log('加载部门');
            // set data on vm
            self.$data.e.depItems = response.data;
        }, function (error) {
            // handle error
            console.log(error);
            console.log('ajax发生异常');
        });
        //加载用户
        userresource.get().then(function (response) {
            console.log('加载用户');
            // set data on vm
            var _data = response.data;
            var _temp = [];
            for (var i = 0; i < _data.length; i++) {
                var o = _data[i];
                if (o.parentId == 0) {
                    _temp.push({ id: o.userId, text: o.deptName + '-' + o.userName });
                }
            }
            self.$data.e.select2options = _temp;
            self.$data.e.usersAll = _data;
        }, function (error) {
            // handle error
            console.log(error);
            console.log('ajax发生异常');
        });
    },
    ready: function () {
        console.log('ready');
        $('#homeModal').modal('show');
    },
    data: {
        v: {
            f_sex: '男',
            f_type: '大人',
            f_name: '',
            me_userId: 0,
            me_userInfo: {},
            selectSitNum: 0,
            
            f_hname: '',
            f_hphone:'',
            f_depname: '技术部',
            f_depid: '1',
            f_relative: '亲属',
            f_remark:'',

            btnalert:'',
            btnhome: '添加',
            useridhome:0,
        },
        //紧急联系人
        e: {
            depItems: [],
            usersAll:[],
            select2options: [],
            relativeitems: [
               {text: '亲属'},
               {text: '邻居'},
               {text: '朋友'}
            ],
            sexItems: [
                { text: '男' },
                { text: '女' }
            ],
            typeItems: [{ text: '大人'},
                { text: '小孩' }
            ]
        }
    },
    watch: {
        'v.me_userId': function (val, oldVal) {
            if (val>0){
                this.v.me_userInfo = _.find(this.e.usersAll, function (o) {
                    return o.userId == val;
                })
            }
        },
    },
    methods: {
        selectdepfn: function (dep) {
            this.$data.v.f_depname = dep.deptName;
            this.$data.v.f_depid = dep.deptId;
        },
        selectrelpfn: function (rel) {
            this.$data.v.f_relative = rel.text;
        },
        //当前选中了那一桌
        sitherefn:function(i) {
            //坐这里
            this.v.selectSitNum = i;
        },
        //家庭成员名称
        familyNamefn: function () {
            var self = this;
            var n0 = ((_.countBy(this.e.usersAll, function (num) {
                return num.parentId == self.v.me_userId;
            }).true || 0) + 1).toString();
            var n1 = '(' + self.v.f_type + n0 + self.v.f_sex + ')';
            var r = self.v.me_userInfo.userName + '家属' + n1 
            console.log(r);
            self.v.f_name = r;
        },
        //安排座位
        sitadd: function ( parentid,i) {
            //坐这里
            var self = this;
            if(i!=null && i>0){
                self.v.selectSitNum = i;
            }
            this.$http.post('/active/sitadd', {
                userId: self.v.me_userId,
                parentId: parentid,
                userName: self.v.f_name,
                sex: self.v.f_sex,
                isChild: self.v.f_type,
                groupId: self.v.selectSitNum
            }).then(function (response) {
                userresource.get().then(function (response) {
                    console.log('加载用户');
                    // set data on vm
                    var _data = response.data;
                    self.$data.e.usersAll = _data;
                }, function (error) {
                    // handle error
                    console.log(error);
                    console.log('ajax发生异常');
                });
                if (parentid > 0) {
                    //关闭窗体
                    $('#myModal').modal('hide');
                }
            }, function (error) {
                // handle error
                console.log(error);
                console.log('ajax发生异常');
            });
        },
        //移除座位
        sitdel: function (groupid, userid, parentId) {
            var self = this;                
            this.$http.post('/active/sitdel', {
                userId: userid,
                groupId: groupid
            }).then(function (response) {
                //移除该块
                self.e.usersAll.$remove(_.find(self.e.usersAll, function(num) {
                    return num.userId == userid
                }));
            }, function (error) {
                // handle error
                console.log(error);
                console.log('ajax发生异常');
            });
        },
        //员工住址 市区焦点
        onBlur: function () {
            console.log('员工住址 市区焦点');
            var self=this;
            var u=_.find(self.e.usersAll,function(o) {
                return self.v.f_depid==o.deptId && self.v.f_hname==o.userName && o.parentId>0;
            })
            if(u!= undefined ){           
                self.v.f_relative = u.relative;
                self.v.f_remark = u.remark;
                self.v.f_hphone = u.relativePhone;
                self.v.useridhome = u.userId;
                //编辑
                self.v.btnhome = "编辑";
            }else{
                //添加
                self.v.btnhome = "添加";
            }
        },
        saveuser: function () {
            var self = this;
            //为空判断
            if (self.v.f_hname == null || self.v.f_hname.length == 0) {
                self.v.btnalert = '请输入您的姓名';
                return false;
            }
            if (self.v.f_hphone == null || self.v.f_hphone.length == 0) {
                self.v.btnalert = '请输入紧急联系人联系方式';
                return false;
            }
            if (self.v.f_remark == null || self.v.f_remark.length == 0) {
                self.v.btnalert = '请输入您的居住地址';
                return false;
            }

            var data = {
                userName: self.v.f_hname,
                deptId: self.v.f_depid,
                parentId: 0,
                sex: '',
                isChild: '大人',
                relative: self.v.f_relative,
                relativePhone: self.v.f_hphone,
                remark: self.v.f_remark
            };

            if (self.v.useridhome > 0) {
                //编辑
                data.id = self.v.useridhome;
                this.$http.put('/api/user', data).then(function (response) {
                    userresource.get().then(function (response) {
                        console.log('加载用户');
                        // set data on vm
                        var _data = response.data;
                        self.$data.e.usersAll = _data;
                    }, function (error) {
                    });
                }, function (error) {
                });
            } else {
                //添加
                this.$http.post('/api/user', data).then(function (response) {
                    userresource.get().then(function (response) {
                        console.log('加载用户');
                        // set data on vm
                        var _data = response.data;
                        self.$data.e.usersAll = _data;
                    }, function (error) {
                    });
                }, function (error) {
                });
            }
            //添加员工住址信息
        }
    },
    computed: {
        //是否显示我要坐这里
        isSitHere: function () {
            return this.v.me_userId > 0 ;
        },
        canAddFamily: function () {
            return this.v.me_userId > 0;
        }
    }
});