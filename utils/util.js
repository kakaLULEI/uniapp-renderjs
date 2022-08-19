import {
  loginPath
} from "@/utils/config.js"
import {
  pick,
  merge,
  cloneDeep
} from 'lodash'

import {
  requestAndroidPermission,
  gotoAppPermissionSetting
} from '@/utils/permission.js'

import Vue from 'vue'
import hzpy from './hz.js'

let support = true;
	
// #ifdef APP-PLUS
support = false;
// #endif

if(!String.prototype.localeCompare)
	support = false;

function url(value) {
  return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(value)
}

var idCardNoUtil = {
  /*省,直辖市代码表*/
  provinceAndCitys: {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
	83: "台湾",
    91: "国外"
  },

  /*每位加权因子*/
  powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],

  /*第18位校检码*/
  parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],

  /*性别*/
  genders: {
    male: "M",
    female: "F"
  },

  /*校验地址码*/
  checkAddressCode: function(addressCode) {
    var check = /^[1-9]\d{5}$/.test(addressCode);
    if (!check) return false;
    if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
      return true;
    } else {
      return false;
    }
  },

  /*校验日期码*/
  checkBirthDayCode: function(birDayCode) {
    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
    if (!check) return false;
    var yyyy = parseInt(birDayCode.substring(0, 4), 10);
    var mm = parseInt(birDayCode.substring(4, 6), 10);
    var dd = parseInt(birDayCode.substring(6), 10);
    var xdata = new Date(yyyy, mm - 1, dd);
    if (xdata > new Date()) {
      return false; //生日不能大于当前日期
    } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
      return true;
    } else {
      return false;
    }
  },

  /*计算校检码*/
  getParityBit: function(idCardNo) {
    var id17 = idCardNo.substring(0, 17);
    /*加权 */
    var power = 0;
    for (var i = 0; i < 17; i++) {
      power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
    }
    /*取模*/
    var mod = power % 11;
    return idCardNoUtil.parityBit[mod];
  },

  /*验证校检码*/
  checkParityBit: function(idCardNo) {
    var parityBit = idCardNo.charAt(17).toUpperCase();
    if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
      return true;
    } else {
      return false;
    }
  },

  /*校验15位或18位的身份证号码*/
  checkIdCardNo: function(idCardNo) {
    //15位和18位身份证号码的基本校验
    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
    if (!check) return false;
    //判断长度为15位或18位
    if (idCardNo.length == 15) {
      return idCardNoUtil.check15IdCardNo(idCardNo);
    } else if (idCardNo.length == 18) {
      return idCardNoUtil.check18IdCardNo(idCardNo);
    } else {
      return false;
    }
  },

  //校验15位的身份证号码
  check15IdCardNo: function(idCardNo) {
    //15位身份证号码的基本校验
    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    var birDayCode = '19' + idCardNo.substring(6, 12);
    //校验日期码
    check = idCardNoUtil.checkBirthDayCode(birDayCode);
    if (!check) return false;
    //验证校检码
    return idCardNoUtil.checkParityBit(idCardNo);
  },

  //校验18位的身份证号码
  check18IdCardNo: function(idCardNo) {
    //18位身份证号码的基本格式校验
    var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/
      .test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    //校验日期码
    var birDayCode = idCardNo.substring(6, 14);
    check = idCardNoUtil.checkBirthDayCode(birDayCode);
    if (!check) return false;
    //验证校检码
    return idCardNoUtil.checkParityBit(idCardNo);
  },

  formateDateCN: function(day) {
    var yyyy = day.substring(0, 4);
    var mm = day.substring(4, 6);
    var dd = day.substring(6);
    return yyyy + '-' + mm + '-' + dd;
  },

  //获取信息
  getIdCardInfo: function(idCardNo) {
    var idCardInfo = {
      gender: "", //性别
      birthday: "" // 出生日期(yyyy-mm-dd)
    };
    if (idCardNo.length == 15) {
      let aday = '19' + idCardNo.substring(6, 12);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }
    } else if (idCardNo.length == 18) {
      let aday = idCardNo.substring(6, 14);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }

    }
    return idCardInfo;
  },

  /*18位转15位*/
  getId15: function(idCardNo) {
    if (idCardNo.length == 15) {
      return idCardNo;
    } else if (idCardNo.length == 18) {
      return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
    } else {
      return null;
    }
  },

  /*15位转18位*/
  getId18: function(idCardNo) {
    if (idCardNo.length == 15) {
      var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
      var parityBit = idCardNoUtil.getParityBit(id17);
      return id17 + parityBit;
    } else if (idCardNo.length == 18) {
      return idCardNo;
    } else {
      return null;
    }
  }
};

function testIdCard(msg) {
  if (typeof msg != 'string' || !msg) return false;
  return idCardNoUtil.checkIdCardNo(msg);
}

function getQueryVariable(variable, query) {
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

function currentIsLogin(vm) {
  var pages = getCurrentPages();
  let page = pages[pages.length - 1];
  if (page && page.route == loginPath) return true;
  if (vm && !pages[0] && vm.$route?.meta?.pagePath == loginPath) return true;
  return false;
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getUrlParams(url) {
  const _url = url || window.location.href;
  const _urlParams = _url.match(/([?&])(.+?=[^&]+)/igm);
  return _urlParams ? _urlParams.reduce((a, b) => {
    const value = b.slice(1).split('=');
    a[value[0]] = value[1]
    return a;
  }, {}) : {};
}

var uniCT = {
  chooseImage(obj) {
    uni.chooseImage(obj);
  },
  makePhoneCall(...params){
    uni.makePhoneCall(...params)
  }
}

var uniC = {
  makePhoneCall(...params) {
    // #ifdef APP-PLUS
    requestAndroidPermission('android.permission.CALL_PHONE').then((res) => {
      if (res['android.permission.CALL_PHONE'] == 1) {
        uniCT.makePhoneCall(...params);
      } else if (res['android.permission.CALL_PHONE'] == -1) {
        uniC.showModal({
          title: '权限提示',
          content: '请开启APP拨打电话权限',
          confirmText: '去授权',
          success(res) {
            if (res.confirm) {
              gotoAppPermissionSetting();
            } else if (res.cancel) {
            }
          },
          fail() {
          }
        })
      } else {
        Vue.prototype.$uniToast('请再次点击，并同意APP使用拨打电话权限');
      }
    }).catch(() => {
      Vue.prototype.$uniToast('查询拨打电话权限失败');
    })
    // #endif
    // #ifndef APP-PLUS
    uniCT.makePhoneCall(...params);
    // #endif
  },
  showModal(...parmas) {
    // #ifdef APP-PLUS
    if (plus.os.name == 'Android') {
      //暂时只有安卓这么做，其他windows，ios表现暂不清楚
      try {
        let param = parmas[0] || {};
        param = merge({
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定',
          verticalAlign: 'center',
        }, param)
        let buttons = [...param.showCancel && [param.confirmText, param.cancelText] || [param.confirmText]];
        if (!param.editable)
          plus.nativeUI.confirm(param.content || '', function(e) {
            param.success && param.success({
              confirm: e.index == 0,
              cancel: e.index == 1,
            });
            param.complete && param.complete();
          }, {
            ...param.title && {
              title: param.title
            } || {},
            buttons,
            verticalAlign: param.verticalAlign
          });
        else {
          plus.nativeUI.prompt(param.content || '', function(e) {
              param.success && param.success({
                confirm: e.index == 0,
                cancel: e.index == 1,
                content: e.value,
              });
              param.complete && param.complete();
            }, param.title !== undefined ? param.title : undefined, param.placeholderText !== undefined ? param
            .placeholderText : undefined, buttons);
        }
      } catch (e) {
        param.fail && param.fail();
        param.complete && param.complete();
      }
    } else {
      uni.showModal(...parmas)
    }
    // #endif
    // #ifndef APP-PLUS
    uni.showModal(...parmas)
    // #endif
  },
  chooseImage(obj = {}) {
    obj = obj && cloneDeep(obj) || {};
    if (obj.sourceType == '') {
      delete obj.sourceType;
    }
    // #ifdef APP-PLUS
    if (!obj.sourceType || obj.sourceType.includes('camera')) {
      //判断权限
      requestAndroidPermission('android.permission.CAMERA').then((res) => {
        if (res['android.permission.CAMERA'] == 1) {
          uniCT.chooseImage(obj);
        } else if (res['android.permission.CAMERA'] == -1) {
          uniC.showModal({
            title: '权限提示',
            content: '请开启APP相机权限',
            cancelText: '从相册选取',
            confirmText: '去授权',
            success(res) {
              if (res.confirm) {
                gotoAppPermissionSetting();
              } else if (res.cancel) {
                obj.sourceType = ['album'];
                uniCT.chooseImage(obj);
              }
            },
            fail() {
              obj.sourceType = ['album'];
              uniCT.chooseImage(obj);
            }
          })
        } else {
          Vue.prototype.$uniToast('请再次点击，并同意APP使用相机权限');
        }
      }).catch(() => {
        Vue.prototype.$uniToast('查询相机权限失败');
      })
      return;
    }
    // #endif
    uniCT.chooseImage(obj);
  }
}

//多音字的姓
const dyX = {
	'褚':'Z',
	'万俟':'M',
	'解':'X',
	'单':'S',
	'仇':'Q',
	'阚':'K',
	'乜':'N',
	'查':'Z',
	'尉迟':'Y',
	'澹台':'T',
	'单于':'C',
	'乐正':'Y',
	'佴':'N',
	'召':'S',
	"辟":'B',
	"其":'J',
	"繁":"P",
	"秘":"B",
	"种":"C",
	"长":"C",
	"祭":"Z",
	"澄":"D",
	"折":"S",
	"藏":"Z",
	"覃":"Q",
	"区":'O',
}

let wLetters = '*abcdefghjklmnopqrstwxyz'.split('');
let wZh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');

function searchFirstLetter(word,model){
	if(!word || !word[0]){
		return '*';
	}
	word = word.toString();
	if(word.charCodeAt(0) >= 'a'.charCodeAt(0) && word.charCodeAt(0) <= 'z'.charCodeAt(0) || word.charCodeAt(0) >= 'A'.charCodeAt(0) && word.charCodeAt(0) <= 'Z'.charCodeAt(0)){
		return String.fromCharCode(word.charCodeAt(0)).toUpperCase();
	}
	if(model){
		let r = dyX[word.substr(0,2)];
		if(r)
			return r;
		r = dyX[word.substr(0,1)];
		if(r)
			return r;
	}
		
	if(!support){
		let f = word.charCodeAt(0);
		if(f >= 19968 && f <= 40869){
			if(hzpy[word[0]]){
				return hzpy[word[0]][0].toUpperCase();
			}
		}
		return '*'
	}
	
	for(let i = 0;i<wLetters.length;i++){
		let letter = wLetters[i];
		if((!wZh[i-1] || wZh[i-1].localeCompare(word,'zh') <=0 ) && word.localeCompare(wZh[i],'zh') < 0){
			return letter.toUpperCase();
		}
	}
}
export {
  url,
  testIdCard,
  getQueryVariable,
  guid,
  getUrlParams,
  idCardNoUtil,
  uniC,
  searchFirstLetter
};
