import store from "../store/index";
import {
	baseUrl
} from '@/utils/config.js'

import {
	merge,
	cloneDeep
} from 'lodash'
import {
	url as uUrl
} from './util.js'

function factory() {
	this.config = {
		baseUrl: baseUrl, // 请求的根域名
		// 默认的请求头
		header: {
			// 'content-type': 'application/x-www-form-urlencoded',
		},
		method: 'GET',
		timeout: 300000,
		// 设置为json，返回后uni.request会对数据进行一次JSON.parse
		dataType: 'json',
		// 此参数无需处理，因为5+和支付宝小程序不支持，默认为text即可
		responseType: 'text',
		task:false,
	}

	this.interceptor = {
		// 请求前的拦截
		request: null,
		// 请求后的拦截
		response: null,
		// fail
		fail: null,
	}
	// let resolve, reject;
	var success = (response,url,noTip,resolve,reject) => {
			// 判断是否存在拦截器
			//TODO 也可以加入一些其他逻辑，比如判断sucess，失败的话直接reject
			if (this.interceptor.response && typeof this.interceptor.response === 'function') {
				response = this.interceptor.response(response, resolve, reject,url,noTip);
			}
			//TODO 处理一些其他逻辑，如code不是200等
			resolve(response);
		},
		error = (res,resolve,reject) => {
			if (res.errMsg == 'request:fail abort')
				return;
			if (this.interceptor.fail && typeof this.interceptor.fail === 'function') {
				res = this.interceptor.fail(res, resolve, reject);
			}
			reject(res)
		};

	this.request = (options) => {
		options = merge({}, this.config, cloneDeep(options));
		// 检查请求拦截
		if (this.interceptor.request && typeof this.interceptor.request === 'function') {
			options = this.interceptor.request(options);
		}
		var task, request = new Promise((r, rj) => {
			// resolve = r, reject = rj;
			options.fail = (err)=>{
				error(err,r,rj);
			};
			options.success = (response)=>{
				success(response,options.url,!!options.noTip,r,rj);
			}

			// 判断用户传递的URL是否/开头,如果不是,加上/，这里使用了uView的test.js验证库的url()方法
			options.url = uUrl(options.url) ? options.url : (this.config.baseUrl + (options.url.indexOf(
					'/') == 0 ?
				options.url : '/' + options.url));
			task = uni.request(options);
		});
		if(options.task)
			return {
				task,
				request
			}
		return request;
	}

	this.get = (url, data = {}, config = {}) => {
		return this.request({
			method: 'GET',
			url,
			...config,
			data
		})
	}

	this.post = (url, data = {}, config = {}) => {
		return this.request({
			url,
			method: 'POST',
			...config,
			data
		})
	}

	// put请求，不支持支付宝小程序(HX2.6.15)
	this.put = (url, data = {}, config = {}) => {
		return this.request({
			url,
			method: 'PUT',
			...config,
			data
		})
	}

	// delete请求，不支持支付宝和头条小程序(HX2.6.15)
	this.delete = (url, data = {}, config = {}) => {
		return this.request({
			url,
			method: 'DELETE',
			...config,
			data
		})
	}
}

export default factory;
