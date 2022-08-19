<template>
	<view :searchTxt="searchTxtLater" :change:searchTxt="worder.searchWorkerDo" :passData="passData" :change:passData="worder.wInit" class="page-container flex flex-direction">
		<view class="o-h" :class="{'h-0':search}" :style="style">
			<cu-custom @right="refresh" ref="header" backEmit @back="backSo" watermark bgColor="bg-blue2" :isBack="showBack">
				<view class="text-white" slot="content">{{pTitle}}</view>
				<template slot="right">
					<text class="cuIcon-refresh"></text>
				</template>
			</cu-custom>
		</view>
		<view v-show="search" :style="zStyle"></view>
		<view v-show="!initLoading" class="m10 search flex">
			<u--input
				v-model.trim="searchTxt"
				@focus="showSearch"
				border="none"
				class="bg-white w-0"
				placeholder="请输入姓名或网格名称搜索"
				prefixIcon="search"
				prefixIconStyle="font-size: 20px;color: #909399;"
			>
			</u--input>
			<view v-show="search" @tap="cancel" style="width: 4em;color: #3c9cff;" class="flex align-center justify-center">
				取消
			</view>
		</view>
		<view class="page-content">
			<view class="h100 flex">
				<view class="w-0">
					<scroll-view scroll-with-animation :scroll-into-view="scrollPosition" v-show="!tipShow && !search" style="height: 100%;" scroll-y="true" >
						<template v-if="pList != ''">
							<view @click="toScroll('p')" class="lxt flex align-center justify-between">
								<text class="f14">人员</text>
								<view class="f14 flex align-center" @click.stop="changeShow('pShow')" style="padding: 0 10px;">
									<text :class="{'cuIcon-unfold':!pShow,'cuIcon-fold':pShow}"></text>
									<text>{{pShow?'收起':'展开'}}</text>
								</view>
							</view>
							<view v-show="pShow">
								<view :id="'p' + item.key" v-for="item in pList" :key="item.key">
									<view class="py">{{item.key}}</view>
									<view @click="makePhone(ele)" v-for="ele in item.value" class="bg-white zt-d solid-bottom flex align-center justify-between" :key="ele.id">
										<view>
											<text style="margin-right: 10px;color:#3c9cff;font-weight: 600;" class="cuIcon-my"></text>
											<text>{{ele.xm}}</text>
											<!-- <text>{{ele.lxdh}}</text> -->
										</view>
										<text v-if="ele.lxdh" style="color: #3c9cff;font-size: 16px;" class="cuIcon-dianhua"></text>
									</view>
								</view>
							</view>
						</template>
						<template v-if="wgList != ''">
							<view @click="toScroll('w')" :class="{lxt2:pList != ''}" class="lxt flex align-center justify-between">
								<text class="f14">网格</text>
								<view class="f14 flex align-center" @click.stop="changeShow('wgShow')" style="padding:0 10px;">
									<text :class="{'cuIcon-unfold':!wgShow,'cuIcon-fold':wgShow}"></text>
									<text>{{wgShow?'收起':'展开'}}</text>
								</view>
							</view>
							<view v-show="wgShow">
								<view :id="'w' + item.key" v-for="item in wgList" :key="item.key">
									<view class="py">{{item.key}}</view>
									<view @click="toNext(ele)" v-for="ele in item.value" class="bg-white zt-d solid-bottom flex align-center justify-between" :key="ele.id">
										<view>
											<text style="margin-right: 10px;color:#3c9cff;font-size: 18px;font-weight: 600;" class="cuIcon-group"></text>
											<text>{{ele.orgName}}</text>
										</view>
										<text class="cuIcon-right"></text>
									</view>
								</view>
							</view>
						</template>
					</scroll-view>
					<scroll-view scroll-with-animation :scroll-into-view="scrollPosition" v-show="!tipShow && search" style="height: 100%;" scroll-y="true" >
						<view @click="searchClick(ele)" style="padding: 0 0 0 15px;" v-for="ele in spList" class="bg-white zt-d solid-bottom flex align-center justify-between" :key="ele.id">
							<view class="w-0 flex align-center" style="margin-right: 15px;padding: 15px 0;">
								<text style="margin-right: 10px;color:#3c9cff;font-weight: 600;" class="cuIcon-my"></text>
								<view>
									<view class="txt-one" v-html="ele.html"></view>
									<view style="font-size: 12px;color: #999;" class="txt-one">{{ele.orgName}}</view>
								</view>
								<!-- <text>{{ele.lxdh}}</text> -->
							</view>
							<view class="flex ass">
								<view class="flex align-center" style="padding: 0 8px;">
									<text v-if="ele.lxdh" style="color: #3c9cff;font-size: 16px;" class="cuIcon-dianhua"></text>
								</view>
								<view @click.stop="searchClick(ele,true)" class="flex align-center" style="padding: 0 15px 0 8px;">
									<text v-if="ele.orgId" style="color: #3c9cff;font-size: 18px;" class="cuIcon-group"></text>
								</view>
							</view>
						</view>
						<view @click="toNext(ele)" v-for="ele in swgList" class="bg-white zt-d solid-bottom flex align-center justify-between" :key="ele.id">
							<view>
								<text style="margin-right: 10px;color:#3c9cff;font-size: 18px;font-weight: 600;" class="cuIcon-group"></text>
								<text v-html="ele.html"></text>
							</view>
							<text class="cuIcon-right"></text>
						</view>
					</scroll-view>
					<view v-show="tipShow" class="tip">{{tip}}</view>
				</view>
				<letterIndex @letterChange="letterChange" ref="letterIndex" v-show="!search"></letterIndex>
			</view>
			<loading v-show="initLoading"></loading>
		</view>
	</view>
</template>

<script module="worder" lang="renderjs">
	export default {
		data(){
			return {
				initF:false,
			}
		},
		mounted() {
		},
		methods: {
			initWSuccess(data,ownerInstance){
				data.data = data.data || {
					enter:[],
					allData:{},
				};
				this.result = data;
				ownerInstance.callMethod('workerInitData',{
					success:true,
					data:data,
				})
			},
			initError(data,ownerInstance){
				ownerInstance.callMethod('workerInitData',{
					success:false,
					data:data,
				})
			},
			wInit(n,o,ownerInstance){
				if(!n || !n.guid || !n.data || n.data == ''){
					return;
				}
				this.initF = false;
				try{
					if(!this.initWorder || this.initWorder.ing){
						this.initWorder && this.initWorder.terminate();
						var workerBlob = new Blob([`
							function findExitName(obj,id){
								if(!obj[id])
									return [];
								if(obj[id].orgName){
									return [id];
								}else{
									let temp = [];
									if(!obj[id].children){
										return temp;
									}
									Object.keys(obj[id].children).forEach(item=>{
										temp = temp.concat(findExitName(obj,item));
									})
									return temp;
								}
							}
							function resolveData(result){
								let temp = result,hasP = {
									
								},firstCode = {},allResult = {},codeId={},persons = {
									
								};
								temp.forEach((item)=>{
									if(item.flag==1){
										let p = item.parentId,id = item.id;
										if(!codeId[item.orgCode]){
											codeId[item.orgCode] = id;
										}
										if(!allResult[id]){
											allResult[id] = {
												orgName:item.orgName,
												orgCode:item.orgCode,
												children:{},
												pId:p,
											}
										}else{
											allResult[id].orgName = item.orgName;
											allResult[id].orgCode = item.orgCode;
											allResult[id].pId = p;
										}
										if(p){
											if(!allResult[p])
												allResult[p] = {
													children:{},
												};
											if(!allResult[p].children[id])
												allResult[p].children[id] = allResult[id];
											if(!hasP[id]){
												hasP[id] = true;
												delete firstCode[id];
											}
											if(!hasP[p]){
												firstCode[p] = undefined;
											}else{
												// delete firstCode[p];
											}
										}else{
											if(!hasP[id]){
												firstCode[id] = undefined;
											}
										}
									}else{
										let orgCode = item.orgCode;
										if(orgCode){
											if(!persons[orgCode])
												persons[orgCode] = [];
											persons[orgCode].push(item);
										}
									}
								})
								Object.keys(persons).forEach(item=>{
									let id = codeId[item];
									if(id){
										allResult[id].persons = persons[item].map(ele=>{
											ele.orgId = id;
											ele.pId = allResult[id].pId;
											return ele;
										});
									}
								})
								let last = [];
								Object.keys(firstCode).forEach(item=>{
									last = last.concat(findExitName(allResult,item));
								});
								return {
									enter:last,
									allData:allResult,
								}
							}
							onmessage = function(e) {
								postMessage(resolveData(e.data));
							}
						`], { type: "text/javascript" });
						
						var url = window.URL.createObjectURL(workerBlob);
						this.initWorder = new Worker(url);
						window.URL.revokeObjectURL(url);
					}
					this.initWorder.onerror = (event) => {
						this.initWorder.terminate();
						this.initError(n,ownerInstance)
					};
					this.initWorder.onmessage = (e)=>{
						this.initWorder.ing = false;
						this.initF = true;
						this.initWSuccess({
							guid:n.guid,
							data:e.data,
						},ownerInstance)
					};
					this.initWorder.onmessageerror = ()=>{
						this.initWorder.terminate();
						this.initError(n,ownerInstance)
					}
					this.initWorder.postMessage(n.data);
					this.initWorder.ing = true;
				}catch(e){
					this.initError(n,ownerInstance)
				}
			},
			error(data,ownerInstance){
				ownerInstance.callMethod('searchBack',{
					success:false,
					data,
				})
			},
			success(data,ownerInstance){
				ownerInstance.callMethod('searchBack',{
					success:true,
					data:data,
				})
			},
			searchWorkerDo(n,o,ownerInstance){
				let guid = this.result && this.result.guid || '';
				if(!n || !this.initF || !guid){
					this.success({
						guid,
						searchTxt:n,
						p:[],
						w:[],
					},ownerInstance)
					return;
				}
				try{
					if(!this.searchWorker || this.searchWorker.ing){
						this.searchWorker && this.searchWorker.terminate();
						var workerBlob = new Blob([`
							function searchCT(txt,data,enter,p,w){
								if(!data || !data[enter])
									return;
								let reg = new RegExp(txt),reg2 = new RegExp('<|>|&|'+txt,'g');
								searchCTN(reg,reg2,data,enter,p,w)
							}
							function searchCTN(reg,reg2,data,enter,p,w){
								if(!data[enter] || !data[enter].orgName)
									return;
								let name = nameToHtml(data[enter].orgName,reg,reg2);
								if(name){
									w.push({
										id:enter,
										orgCode:data[enter].orgCode,
										orgName:data[enter].orgName,
										html:name,
										pId:data[enter].pId,
									})
								}
								for(let key in data[enter].children){
									searchCTN(reg,reg2,data,key,p,w)
								}
								if(data[enter].persons)
									data[enter].persons.forEach(item=>{
										if(!item.xm)
											return;
										name = nameToHtml(item.xm,reg,reg2);
										if(name){
											p.push({
												id:item.id,
												orgId:item.orgId,
												xm:item.xm,
												lxdh:item.lxdh,
												orgCode:item.orgCode,
												orgName:item.orgName,
												html:name,
												pId:item.pId,
											})
										}
									});
							}
							function nameToHtml(name,reg,reg2){
								if(!reg.test(name)){
									return false;
								}
								return name.replace(reg2,function(s){
									if(s=='<')
										return '&lt;'
									if(s=='>')
										return '&gt;'
									if(s=='&')
										return '&amp;'
									return '<span style="color:#ff4d4f;">'+s+'</span>';
								})
							}
							
							onmessage = function(e) {
								let txt = e.data.searchTxt,p = [],w = [];
								if(e.data.data && e.data.data.enter && e.data.data.enter != ''){
									e.data.data.enter.forEach((item)=>{
										searchCT(txt,e.data.data.allData,item,p,w);
									});
								}
								postMessage({
									p,
									w,
								});
							}
						`], { type: "text/javascript" });
						
						var url = window.URL.createObjectURL(workerBlob);
						this.searchWorker = new Worker(url);
						window.URL.revokeObjectURL(url);
					}
					this.searchWorker.onerror = (event) => {
						this.searchWorker.terminate();
						this.error({
							guid,
							searchTxt:n,
							p:[],
							w:[],
						},ownerInstance)
					};
					this.searchWorker.onmessage = (e)=>{
						this.searchWorker.ing = false;
						this.success({
							guid,
							searchTxt:n,
							p:e.data.p,
							w:e.data.w,
						},ownerInstance)
					};
					this.searchWorker.onmessageerror = ()=>{
						this.searchWorker.terminate();
						this.error({
							guid,
							searchTxt:n,
							p:[],
							w:[],
						},ownerInstance)
					}
					this.searchWorker.postMessage({
						data:this.result.data,
						searchTxt:n,
					});
					this.searchWorker.ing = true;
				}catch(e){
					this.error({
						guid,
						searchTxt:n,
						p:[],
						w:[],
					},ownerInstance)
				}
			},
		}
	}
</script>

<script>
	import letterIndex from '@/components/letterIndex.vue'
	import loading from '@/components/common/loading.vue'
	import {guid} from '@/utils/util.js'
	function findExitName(obj,id){
		if(!obj[id])
			return [];
		if(obj[id].orgName){
			return [id];
		}else{
			let temp = [];
			if(!obj[id].children){
				return temp;
			}
			Object.keys(obj[id].children).forEach(item=>{
				temp = temp.concat(findExitName(obj,item));
			})
			return temp;
		}
	}
	function searchCT(txt,data,enter,p,w){
		if(!data || !data[enter])
			return;
		let reg = new RegExp(txt),reg2 = new RegExp('<|>|&|'+txt,'g');
		searchCTN(reg,reg2,data,enter,p,w)
	}
	function searchCTN(reg,reg2,data,enter,p,w){
		if(!data[enter] || !data[enter].orgName)
			return;
		let name = nameToHtml(data[enter].orgName,reg,reg2);
		if(name){
			w.push({
				id:enter,
				orgCode:data[enter].orgCode,
				orgName:data[enter].orgName,
				html:name,
				pId:data[enter].pId,
			})
		}
		for(let key in data[enter].children){
			searchCTN(reg,reg2,data,key,p,w)
		}
		if(data[enter].persons)
			data[enter].persons.forEach(item=>{
				if(!item.xm)
					return;
				name = nameToHtml(item.xm,reg,reg2);
				if(name){
					p.push({
						id:item.id,
						orgId:item.orgId,
						xm:item.xm,
						lxdh:item.lxdh,
						orgCode:item.orgCode,
						orgName:item.orgName,
						html:name,
						pId:item.pId,
					})
				}
			});
	}
	function nameToHtml(name,reg,reg2){
		if(!reg.test(name)){
			return false;
		}
		return name.replace(reg2,function(s){
			if(s=='<')
				return '&lt;'
			if(s=='>')
				return '&gt;'
			if(s=='&')
				return '&amp;'
			return '<span style="color:#ff4d4f;">'+s+'</span>';
		})
	}
	export default {
		components:{
			letterIndex,
			loading
		},
		watch:{
			searchTxt(n){
				if(n){
					this.searchLoading = true;
				}else{
					this.searchLoading = false;
				}
				this.laterSearch();
			}
		},
		computed:{
			tip(){
				if(this.search){
					return this.searchLoading ? '搜索中...' : this.searchTxt ? '未搜索到相关数据' : '请输入关键字进行搜索';
				}
				// return this.initLoading || this.loading ? '加载中...' : '暂无数据';
				return this.initLoading ? '加载中...' : '暂无数据';
			},
			tipShow(){
				if(!this.search && this.wgList == '' && this.pList == ''){
					return true;
				}
				if(this.search && this.spList == '' && this.swgList == ''){
					return true;
				}
				if(this.search && this.searchLoading){
					return true;
				}
				if(!this.search && this.initLoading){
					return true;
				}
				return false;
			},
			pTitle(){
				if(this.levels == '')
					return '通讯录';
				return this.levels[this.levels.length - 1].orgName;
			},
			showBack(){
				return this.levels.length >= 1;
			}
		},
		data() {
			return {
				letterInitFirst:false,
				style:{
					height:this.$CustomBar + 'px',
				},
				zStyle:{
					height:this.$StatusBar + 'px',
				},
				search:false,
				searchTxt:'',
				searchTxtLater:'',
				searchTime:0,
				// loading:true,
				searchLoading:false,
				onTop:false,
				initLoading:false,
				passData:{},
				worderError:false,
				wgList:[],
				pList:[],
				swgList:[],
				spList:[],
				pShow:true,
				wgShow:true,
				levels:[],
				scrollPosition:'',
			}
		},
		methods: {
			laterSearch(){
				clearTimeout(this.searchTime);
				this.searchTxtLater = '';
				this.searchTime = setTimeout(()=>{
					this.dispatchSearch();
				},300)
			},
			dispatchSearch(){
				if(!this.searchTxt){
					this.searchSuccess([],[]);
					return;
				}
				if(!this.allData || !this.allData.enter || this.allData.enter == ''){
					this.searchSuccess([],[]);
					return;
				}
				if(this.worderError){
					this.searchNoWorker();
				}else{
					this.searchTxtLater = this.searchTxt;
				}
			},
			searchSuccess(p,w){
				this.spList = Object.freeze(p);
				this.swgList = Object.freeze(w);
				this.searchLoading = false;
			},
			searchNoWorker(){
				let txt = this.searchTxt,p = [],w = [];
				if(this.allData && this.allData.enter && this.allData.enter != ''){
					this.allData.enter.forEach((item)=>{
						searchCT(txt,this.allData.allData,item,p,w);
					});
				}
				this.searchSuccess(p,w);
			},
			searchClick(ele,f){
				if(!f && ele.lxdh){
					this.makePhone(ele);
					return;
				}
				if(ele.orgId){
					this.toNext({
						id:ele.orgId,
						orgName:ele.orgName,
						orgCode:ele.orgCode,
						pId:ele.pId,
					});
					return;
				}
			},
			makePhone(ele){
				if(!ele.lxdh){
					return;
				}
				let t = (ele.orgName || '') + (ele.xm || '');
				this.$uniC.showModal({
					content:'您确认要拨打'+(t?t + '的':'此') +'电话吗？',
					success: (res) => {
						if (res.confirm) {
							this.$uniC.makePhoneCall({
								phoneNumber:ele.lxdh
							})
						}
					}
				})
			},
			searchBack(r){
				if(!r.data.guid || !r.data.searchTxt || r.data.guid!=this.initGuid || r.data.searchTxt != this.searchTxt){
					return;
				}
				this.searchSuccess(r.data.p,r.data.w);
			},
			workerInitData(r){
				if(r.data.guid!=this.initGuid)
					return;
				if(!r.success){
					this.worderError = true;
					this.resolveData(r.data.data);
				}else{
					this.initSuccess(r.data.data);
				}
			},
			initSuccess(result){
				this.allData = result;
				this.showData(this.allData.enter,true);
				this.initLoading = false;
			},
			cgLevels(ele){
				this.levels = [];
				if(this.allData.enter.includes(ele.id)){
					return;
				}
				this.xhLevel(ele.pId);
			},
			xhLevel(pId){
				let ele = this.allData.allData[pId];
				this.levels.unshift({
					id:pId,
					orgName:ele.orgName,
					orgCode:ele.orgCode,
				});
				if(this.allData.enter.includes(pId)){
					return;
				}
				this.xhLevel(ele.pId);
			},
			toNext(ele){
				if(this.search){
					this.cgLevels(ele);
					this.searchTxt = '';
					this.search = false;
				}
				this.showData(ele.id);
				this.levels.push(Object.freeze({
					id:ele.id,
					orgName:ele.orgName,
					orgCode:ele.orgCode,
				}))
			},
			showData(ids,first){
				this.pList = [];
				this.wgList = [];
				this.py = {};
				this.$refs.letterIndex.initPyList([],'');
				ids = [].concat(ids);
				let p = [],w = [];
				ids.forEach(item=>{
					if(first){
						w.push({
							id:item,
							orgName:this.allData.allData[item].orgName,
							orgCode:this.allData.allData[item].orgCode,
						})
					}else{
						p.push(...this.allData.allData[item].persons || []);
						Object.keys(this.allData.allData[item].children).forEach(ele=>{
							w.push({
								id:ele,
								orgName:this.allData.allData[ele].orgName,
								orgCode:this.allData.allData[ele].orgCode,
							})
						});
					}
				});
				let t;
				if(p!=''){
					this.letterGuid = guid();
					t = this.$refs.letterIndex.initList(p,'xm',true,false,this.letterGuid);
					this.pList = t.data;
					this.py.p = t.pyList;
					t = this.$refs.letterIndex.initList(w,'orgName',true,true);
					this.wgList = t.data;
					this.py.wg = t.pyList;
				}else{
					if(w!=''){
						this.letterGuid = guid();
						t = this.$refs.letterIndex.initList(w,'orgName',true,false,this.letterGuid);
						this.wgList = t.data;
						this.py.wg = t.pyList;
					}
				}
				this.pShow = true;
				this.wgShow = true;
			},
			changeShow(prop){
				this[prop] = !this[prop];
				this.initLetter();
			},
			initLetter(){
				this.letterGuid = guid();
				if(this.pList!='' && this.pShow){
					this.$refs.letterIndex.initPyList(this.py.p,this.letterGuid);
					return;
				}else if(this.wgList!='' && this.wgShow){
					this.$refs.letterIndex.initPyList(this.py.wg,this.letterGuid);
					return;
				}
				this.$refs.letterIndex.initPyList([],this.letterGuid);
			},
			letterChange(e){
				if(e.guid!=this.letterGuid)
					return;
				if(this.pList!='' && this.pShow){
					this.scrollTo('p',e.letter)
				}else if(this.wgList!='' && this.wgShow){
					this.scrollTo('w',e.letter)
				}
			},
			toScroll(w){
				if(w=='p' && (!this.pShow || this.pList == '') || w=='w' && (!this.wgShow || this.wgList == '')){
					return;
				}
				this.scrollPosition = '';
				this.$nextTick(()=>{
					this.scrollPosition = w + this.py[w=='p'?'p':'wg'][0];
				})
			},
			scrollTo(w,l){
				if(w=='p' && (!this.pShow || this.pList == '') || w=='w' && (!this.wgShow || this.wgList == '')){
					return;
				}
				this.scrollPosition = '';
				this.$nextTick(()=>{
					this.scrollPosition = w + l;
				})
			},
			refresh(){
				this.scrollPosition = '';
				this.levels = [];
				this.allData = {};
				this.wgList = [];
				this.pList = [];
				this.swgList = [];
				this.spList = [];
				this.search = false;
				this.searchTxt = '';
				this.searchTxtLater = '';
				clearTimeout(this.searchTime);
				// this.loading = true;
				this.searchLoading = false;
				this.initLoading = false;
				this.passData = {};
				this.initGuid = '';
				this.letterGuid = '';
				this.py = {};
				this.$refs.letterIndex.initPyList([],this.letterGuid);
				this.init();
			},
			show(){
				this.onTop = true;
				if(!this.letterInitFirst){
					this.letterInitFirst = true;
					this.init();
				}else{
					this.initLetter();
				}
			},
			hide(){
				this.onTop = false;
			},
			backaction(){
				if(!this.onTop)
					return;
				let r = this.backSo();
				return r;
			},
			backSo(){
				if(this.search){
					this.search = false;
					return true;
				}
				if(this.levels.length){
					this.levels.pop();
					if(this.levels == '')
						this.showData(this.allData.enter,true);
					else{
						this.showData(this.levels[this.levels.length-1].id);
					}
					return true;
				}
			},
			showSearch(){
				this.search = true;
			},
			cancel(){
				this.searchTxt = '';
				this.search = false;
			},
			resolveData(result){
				let temp = result,hasP = {
					
				},firstCode = {},allResult = {},codeId={},persons = {
					
				};
				temp.forEach((item)=>{
					if(item.flag==1){
						let p = item.parentId,id = item.id;
						if(!codeId[item.orgCode]){
							codeId[item.orgCode] = id;
						}
						if(!allResult[id]){
							allResult[id] = {
								orgName:item.orgName,
								orgCode:item.orgCode,
								children:{},
								pId:p,
							}
						}else{
							allResult[id].orgName = item.orgName;
							allResult[id].orgCode = item.orgCode;
							allResult[id].pId = p;
						}
						if(p){
							if(!allResult[p])
								allResult[p] = {
									children:{},
								};
							if(!allResult[p].children[id])
								allResult[p].children[id] = allResult[id];
							if(!hasP[id]){
								hasP[id] = true;
								delete firstCode[id];
							}
							if(!hasP[p]){
								firstCode[p] = undefined;
							}else{
								// delete firstCode[p];
							}
						}else{
							if(!hasP[id]){
								firstCode[id] = undefined;
							}
						}
					}else{
						let orgCode = item.orgCode;
						if(orgCode){
							if(!persons[orgCode])
								persons[orgCode] = [];
							persons[orgCode].push(item);
						}
					}
				})
				Object.keys(persons).forEach(item=>{
					let id = codeId[item];
					if(id){
						allResult[id].persons = persons[item].map(ele=>{
							ele.orgId = id;
							ele.pId = allResult[id].pId;
							return ele;
						});
					}
				})
				let last = [];
				Object.keys(firstCode).forEach(item=>{
					last = last.concat(findExitName(allResult,item));
				});
				this.initSuccess({
					enter:last,
					allData:allResult,
				});
			},
			worderInit(result){
				if(result==''){
					this.initSuccess({
						enter:[],
						allData:{},
					});
					return;
				}
				this.initGuid = guid();
				this.passData = {
					guid:this.initGuid,
					data:Object.freeze(result)
				};
			},
			init(){
				if(this.initLoading){
					return;
				}
				this.initLoading = true;
				this.$http.get('/tzl/wgGzryxxb/txl').then(res => {
					if (res.code == 200) {
						if(this.worderError)
							this.resolveData(res.result);
						else{
							this.worderInit(res.result);
						}
					} else {
						return Promise.reject({
							code: 0,
							errMsg: res.message || '获取通讯录失败'
						})
					}
				}).catch((res) => {
					this.$uniToast(res.errMsg);
					this.initLoading = false;
				})
			}
		},
		mounted() {
		},
	}
</script>

<style scoped>
	.search ::v-deep .uni-input-placeholder{
		font-size: 14px;
		color: #909399;
		line-height:normal;
		padding: 8px 0;
		height: auto;
	}
	.search ::v-deep .uni-input-input{
		font-size: 14px;
		padding: 8px 0;
		line-height:normal;
		height: auto;
	}
	.search ::v-deep .u-input__content{
		padding: 0 0 0 6px;
	}
	.search ::v-deep .u-input__content__subfix-icon{
		align-self: stretch;
		background-color: #f8f8f8;
		justify-content: center;
	}
	.search ::v-deep .u-button{
		border: none;
		background: none;
	}
	.search ::v-deep .u-input__content__field-wrapper__field{
		height: auto;
	}
	.l2{
		line-height: 2;
	}
	.o-h{
		overflow: hidden;
		transition: heigth 0.5s;
	}
	.h-0{
		height: 0 !important;
	}
	.w-0{
		width: 0;
		flex-grow: 1;
	}
	.pyi{
		width: 1.5em;
		text-align: center;
		line-height: 1.5em;
		font-size: 18px;
	}
	.w10{
		width: 10px;
	}
	.p10{
		padding: 0 0 0 10px;
	}
	.m10{
		margin: 8px;
	}
	.tip{
		font-size: 12px;
		color: #aaa;
		text-align: center;
		line-height: 4;
	}
	.f16{
		font-size: 16px;
	}
	.lxt{
		/* color: #3c9cff; */
		height: 2.5em;
		padding: 0 0 0 10px;
		background-color: #f1f1f1;
		position: sticky;
		top: 0;
		z-index: 1;
	}
	.lxt2{
		top: 2.5em;
	}
	.py{
		font-size: 12px;
		padding-left: 13px;
		line-height: 2;
		background-color: #f1f1f1;
	}
	.zt-d{
		padding: 15px;
		font-size: 14px;
	}
	.f14{
		font-size: 14px;
	}
	::v-deep .uni-scroll-view-content{
		height: auto;
	}
	.ass{
		align-self: stretch;
	}
</style>
