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
        var self = this;
        //加载部门
        depresource.get().then(function (response) {
            // set data on vm
            self.$data.e.depItems = response.data;
        }, function (error) {
            // handle error
        });
        //加载用户
        userresource.get().then(function (response) {
            // set data on vm
            var _data = response.data;
            //var _temp = [];
            //for (var i = 0; i < _data.length; i++) {
            //    var o = _data[i];
            //    if (o.parentId == 0) {
            //        _temp.push({ id: o.userId, text: o.deptName + '-' + o.userName });
            //    }
            //}
            //self.$data.e.select2options = _temp;
            self.$data.e.usersAll = _data;
        }, function (error) {
            // handle error
        });
    },
    ready: function () {
        $('#homeModal').modal('show');
    },
    data: {
        v: {
            f_sex: '',
            f_type: '',
            f_name: '',
            me_userId: 0,
            me_userInfo: {},
            selectSitNum: 0,
            f_btnalert:'',
            
            f_hname: '',
            f_hphone:'',
            f_depname: '选择部门',
            f_depid: '0',
            f_relative: '选择关系',
            f_remark:'',

            btnalert:'',
            btnhome: '添加',
            useridhome: 0
        },
        //紧急联系人
        e: {
            depItems: [],
            usersAll:[],
            //select2options: [],
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
                });
                if (this.e.usersAll != undefined && this.e.usersAll.length > 0) {
                    var gval = _.groupBy(this.e.usersAll, 'groupId');
                    var c = '.badge_ashow';
                    for (var i = 1; i < 10; i++) {
                        if (gval[i.toString()] != undefined && gval[i.toString()].length > 9) {
                            $(c + i.toString()).hide();
                        } else {
                            $(c + i.toString()).show();
                        }
                    }
                }
            }

        },
        'e.usersAll': function (val, oldVal) {
            if (this.v.me_userId > 0) {
                if (val != undefined && val.length>0) {
                    var gval = _.groupBy(val, 'groupId');
                    var c = '.badge_ashow';
                    for (var i = 1; i < 10; i++) {
                        if (gval[i.toString()]!=undefined && gval[i.toString()].length > 9) {
                            $(c + i.toString()).hide();
                        } else {
                            $(c + i.toString()).show();
                        }
                    }
                }
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
            //var n0 = ((_.countBy(this.e.usersAll, function (num) {
            //    return num.parentId == self.v.me_userId;
            //}).true || 0) + 1).toString();
            var n1 = '(' + self.v.f_type +  self.v.f_sex + ')' ;
            var r = self.v.me_userInfo.userName + '家属' + n1;
            self.v.f_name = r;
        },
        //安排座位
        sitadd: function (parentid, i) {            
            if (parentid > 0) {
                if (this.v.f_sex == '') {
                    this.v.f_btnalert = '请选择家属性别'
                    return false;
                }
                if (this.v.f_type == '') {
                    this.v.f_btnalert = '请选择家属大人还是小孩'
                    return false;
                }
            }
            this.v.f_btnalert = '';
            //坐这里
            var self = this;
            if(i!=null && i>0){
                self.v.selectSitNum = i;
            }
            var $btn = $('#myhomebtn').button('loading')
            this.$http.post('/active/sitadd', {
                userId: self.v.me_userId,
                parentId: parentid,
                userName: self.v.f_name,
                sex: self.v.f_sex,
                isChild: self.v.f_type,
                groupId: self.v.selectSitNum
            }).then(function (response) {
                userresource.get().then(function (response) {
                    // set data on vm
                    var _data = response.data;
                    self.$data.e.usersAll = _data;
                    $btn.button('reset');
                }, function (error) {
                    // handle error  
                    $btn.button('reset');
                });
                if (parentid > 0) {
                    //关闭窗体
                    $('#myModal').modal('hide');
                }
            }, function (error) {
                // handle error  
                $btn.button('reset');
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
            });
        },
        //员工住址 失去焦点
        onBlur: function () {
            var self = this;
            if (self.v.f_hname != undefined){
                var u = _.find(self.e.usersAll, function (o) {
                    //self.v.f_depid==o.deptId &&
                    return  self.v.f_hname==o.userName && o.parentId==0;
                })
                if (u != undefined) {
                    self.v.f_depname = u.deptName;
                    self.v.f_depid = u.deptId;
                    self.v.f_relative = u.relative;
                    self.v.f_remark = u.remark;
                    self.v.f_hphone = u.relativePhone;
                    self.v.useridhome = u.userId;
                    //编辑
                    self.v.btnhome = "编辑";
                }else{
                    //添加
                    self.v.useridhome = 0;
                    self.v.btnhome = "添加";
                }
            }
        },
        saveuser: function () {
            var self = this;
            if (self.v.f_depid == 0) {
                self.v.btnalert = '请选择您所在部门';
                return false;
            }
            if (self.v.f_relative == '选择关系') {
                self.v.btnalert = '请选择和紧急联系人的关系';
                return false;
            }
            //为空判断
            if (self.v.f_hname == null || self.v.f_hname.length == 0) {
                self.v.btnalert = '请输入您的姓名';
                return false;
            }
            if (self.v.f_relative == null || self.v.f_relative.length == 0) {
                self.v.btnalert = '请选择紧急联系人关系';
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
            self.v.btnalert = '';
            var data = {
                deptId: self.v.f_depid,
                userCode: '',
                userName: self.v.f_hname,
                parentId: 0,
                sex: '',
                isChild: '大人',
                relative: self.v.f_relative,
                relativePhone: self.v.f_hphone,
                remark: self.v.f_remark
            };
            var $btn = $('#homebtn').button('loading');
            if (self.v.useridhome > 0) {
                //编辑
                data.id = self.v.useridhome;
                data.userId = self.v.useridhome;
                this.$http.put('/api/user/' + data.id.toString(), data).then(function (response) {
                    userresource.get().then(function (response) {
                        // set data on vm
                        var _data = response.data;
                        self.$data.e.usersAll = _data;
                        $('#homeModal').modal('hide');
                        //$('.select2-selection__rendered').click();
                        $btn.button('reset')
                    }, function (error) {
                        $btn.button('reset')
                    });
                }, function (error) {
                    $btn.button('reset')
                });
            } else {
                //添加
                this.$http.post('/api/user', data).then(function (response) {
                    userresource.get().then(function (response) {
                        // set data on vm
                        var _data = response.data;
                        self.$data.e.usersAll = _data;
                        $('#homeModal').modal('hide');
                        //$('.select2-selection__rendered').click();
                        $btn.button('reset')
                    }, function (error) {
                        $btn.button('reset')
                    });
                }, function (error) {
                    $btn.button('reset')
                });
            }
            //添加员工住址信息
        },
        flushuserall: function () {
            var self = this;
            var $btn = $('#flashuserbtn').button('loading')
            // business logic...
            userresource.get().then(function (response) {
                // set data on vm
                var _data = response.data;
                self.$data.e.usersAll = _data;
                $btn.button('reset');
            }, function (error) {
            });
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