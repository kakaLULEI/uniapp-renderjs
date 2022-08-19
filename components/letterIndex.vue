<template>
	<view v-if="list!=''" class="h100 pr z10">
		<view :prop="option" ref="fd" :change:prop="py.initPY" class="pa pn xfc dn" id="fd" :style="'width:'+fw+'px;height:'+fh+'px;border-top-left-radius:'+fw+'px;border-bottom-left-radius:'+fw+'px;'"></view>
		<view id="pyc" @touchend="py.end" @touchstart="py.start" @touchmove="py.move" :style="'width:'+w+'px;font-size:'+fz+'px;'" class="h100 flex flex-direction flex-wrap align-center justify-center pr">
			<view class="pyi pr" :style="eStyle" v-for="item in list" :key="item">{{item}}</view>
		</view>
	</view>
</template>

<script module="py" lang="renderjs">
	const x16 = [],aCode = 'a'.charCodeAt(0);
	for(let i = 0;i<15;i++){
		if(i<10)
			x16.push(i)
		else{
			x16.push(String.fromCharCode(aCode + i - 10));
		}
	}
	export default {
		data(){
			return {
				// pStyle:'',
				pyOption:{},
				letter:'',
				// ready:false,
				t:0,
			}
		},
		mounted() {
		},
		methods: {
			end(e){
				let p = this.$el.querySelector('#pyc');
				if(e){
					this.addClass(p,'t-5');
				}
				let all = p.querySelectorAll('.pyi');
				for(let i = 0;i<all.length;i++){
					try{
						all[i].setAttribute('style',this.pyOption.eStyle);
					}catch(e){
						
					}
				}
				this.refFD && this.addClass(this.refFD,'dn');
			},
			start(e,ownerInstance){
				e.preventDefault();
				e.stopPropagation();
				this.resetLetter();
				let p = this.$el.querySelector('#pyc');
				this.removeClass(p,'t-5');
				this.move(e,ownerInstance);
			},
			resetLetter(){
				clearTimeout(this.t);
				this.letter = '';
			},
			removeClass(el,cn){
				el.classList.remove(cn);
			},
			addClass(el,cn){
				if(!el.classList.contains(cn))
					el.classList.add(cn);
			},
			initPY(n){
				//处理h5和app差异
				this.refFD = this.$refs.fd && this.$refs.fd.$el || this.$refs.fd;
				if(this.refFD){
					// this.pStyle = this.refFD.$el.getAttribute('style').split(';').slice(0,4);
					this.pyOption = n;
					// this.ready = true;
				}
			},
			move(e,ownerInstance){
				if(!this.refFD)
					return;
				let fl = e.touches[0].clientX - this.pyOption.wB.left;
				if(fl < 0 || fl > this.pyOption.wB.right - this.pyOption.wB.left){
					this.end();
					return;
				}
				if(e.touches[0].clientY < this.pyOption.wB.top || e.touches[0].clientY > this.pyOption.wB.bottom){
					this.end();
					return;
				}
				let which = Math.ceil(fl/this.pyOption.ew);//在第几列
				let x = (which - 0.5) * this.pyOption.ew,y = e.touches[0].clientY - this.pyOption.wB.top;
				//判断在不在y范围
				if(y < this.pyOption.firstLTop || y > this.pyOption.firstLTop + this.pyOption.n * this.pyOption.ew){
					this.end();
					return;
				}
				if(which==this.pyOption.col){
					if(y < this.pyOption.lastLTop || y > this.pyOption.lastLTop + this.pyOption.lastN * this.pyOption.ew){
						this.end();
						return;
					}
				}
				y -= this.pyOption.fn * this.pyOption.ew / 2;
				this.refFD.style.top = y + 'px';
				this.refFD.style.right = this.pyOption.w - x + 'px';
				this.computedItem(y,which,ownerInstance);
				this.removeClass(this.refFD,'dn');
				// console.log(letter.$vm.$el.innerHTML)
			},
			computedItem(row,col,ownerInstance){
				let toTop = row - (col==this.pyOption.col?this.pyOption.lastLTop:this.pyOption.firstLTop );
				let start = (col - 1) * this.pyOption.n;
				let nW = start;
				if(toTop > this.pyOption.ew / 2){
					let temp = Math.floor(toTop / this.pyOption.ew);
					start += temp + (toTop - temp * this.pyOption.ew - this.pyOption.ew / 2 > 0 ? 1 : 0);
				}
				let end = col == 1 ? this.pyOption.n - 1 : col * this.pyOption.n - 1;//这边的end算出来在只有一列的时候，会大于实际的end，不过下面有数组的范围，所以没关系
				let lastTop = row + this.pyOption.fn * this.pyOption.ew - (col==this.pyOption.col?this.pyOption.lastLTop:this.pyOption.firstLTop );
				let offset = Math.floor(lastTop / this.pyOption.ew);
				offset += lastTop - (offset + 0.5) * this.pyOption.ew > 0 ? 1 : 0;
				offset += (col - 1) * this.pyOption.n - 1;
				end = offset > end ? end : offset;
				let all = this.$el.querySelector('#pyc').querySelectorAll('.pyi');
				let yy = row + this.pyOption.fn * this.pyOption.ew / 2;
				
				let yyTop = yy - (col==this.pyOption.col?this.pyOption.lastLTop:this.pyOption.firstLTop );
				let tn = Math.floor(yyTop / this.pyOption.ew);
				if(tn * this.pyOption.ew == yyTop){
					nW += tn - 1;
				}else{
					nW += tn;
				}
				
				// for(let i = 0;i<(this.pyOption.col - 1) * this.pyOption.n + this.pyOption.lastN;i++){
				for(let i = 0;i<all.length;i++){
					let index = i < (col - 1) * this.pyOption.n || i >= col * this.pyOption.n ? 1 : 3;
					let x = 0,c = '',f = '';
					if(i>=start && i<=end){
						//对x，y进行计算
						let ny = 0;
						if(col != this.pyOption.col){
							ny = this.pyOption.firstLTop + ((i + 1) % this.pyOption.n + this.pyOption.n - 1) % this.pyOption.n * this.pyOption.ew + this.pyOption.ew / 2;
						}else{
							ny = this.pyOption.lastLTop + ((i + 1) % this.pyOption.n + this.pyOption.n - 1) % this.pyOption.n * this.pyOption.ew + this.pyOption.ew / 2;
						}
						ny = Math.abs(ny - yy);
						x = Math.sqrt(Math.pow(this.pyOption.ew * this.pyOption.fn / 2,2) - Math.pow(ny,2));
						x = x < 0 ? 0 : x ;
						if(i==nW){
							index = 4;
							c = 'color:#1890ff;'
							f = 'font-size:'+this.pyOption.mFz+'px;'
							this.message(all[i],ownerInstance)
						}else if(this.pyOption.fn > 1){
							let offsetN = Math.abs(nW - i);
							let level = this.pyOption.fn / 2;
							let each = 11 / level;
							c = 'color:#'+this.getColor((level - offsetN + 1) * each + 3)+';'
							each = (this.pyOption.mFz - this.pyOption.fz) / level;
							f = 'font-size:'+ parseInt((level - offsetN) * each + this.pyOption.fz) + 'px;'
						}
					}
					try{
						all[i].setAttribute('style',this.pyOption.eStyle + 'z-index:'+index+';right:'+x+'px;' + c + f);
					}catch(e){
						
					}
				}
			},
			getFz(){
				
			},
			getColor(n){
				n = parseInt(n);
				let t = 224;
				if(n > 14){
					t = 'F5'; 
				}else{
					t = x16[n];
				}
				return [t,t,t].join('');
			},
			message(el,ownerInstance){
				clearTimeout(this.t);
				let guid = this.pyOption.guid;
				if(!guid){
					return;
				}
				this.t = setTimeout(()=>{
					if(this.letter!=el.innerText){
						this.letter = el.innerText;
						ownerInstance.callMethod('indexChange', {
							letter: this.letter,
							guid,
						})
					}
				},200)
			}
		}
	}
</script>

<script>
	import {searchFirstLetter} from '@/utils/util.js'
	const fz = 14,ewp = 2,mFz = 22,fn = 5;
	export default {
		data(){
			return {
				list:[],
				fz,
				n:0,
				col:1,
				firstLTop:0,
				lastLTop:0,
				lastN:0,
				wB:{
					
				},
				fn,
				pfn:fn,
				ewp,
				mFz,
				guid:'',
			}
		},
		mounted() {
			// this.initList();
		},
		computed: {
			eStyle(){
				return 'width:'+(this.ewp * this.fz)+'px;line-height:'+(this.ewp * this.fz)+'px;'
			},
			fw(){
				return this.ew * this.fn / 2;
			},
			fh(){
				return this.ew * this.fn;
			},
			w() {
				return this.col *  this.ew;
			},
			ew(){
				return this.fz * ewp;
			},
			option(){
				return {
					w:this.w,
					ew:this.ew,
					col:this.col,
					firstLTop:this.firstLTop,
					lastLTop:this.lastLTop,
					wB:this.wB,
					fn:this.fn,
					n:this.n,
					lastN:this.lastN,
					eStyle:this.eStyle,
					mFz:this.mFz,
					fz:this.fz,
					guid:this.guid,
				}
			}
		},
		watch:{
			fz(){
				this.init();
			},
			list(n){
				if(n==''){
					return;
				}
				this.init();
			},
		},
		methods:{
			initPyList(list,guid,initF){
				this.guid = guid;
				if(list.length<2){
					this.list = [];
					return;
				}else{
					this.list = [...list];
				}
				if(initF)
					initF(this);
				else{
					if(this.list.length < this.fn){
						this.fn = this.list.length;
					}else{
						this.fn = this.pfn;
					}
				}
			},
			initList(list,name = 'name',model,onlyGet,guid,initF){
				let temp = {};
				list.forEach(item=>{
					let t = searchFirstLetter(item[name],model);
					if(!temp[t]){
						temp[t] = {
							value:[item]
						}
					}else{
						temp[t].value.push(item);
					}
				})
				let lList = Object.keys(temp).sort((a,b)=>{
					if(a == '*'){
						return 1;
					}
					if(b == '*'){
						return -1;
					}
					return a.charCodeAt(0) - b.charCodeAt(0);
				});
				let r = [];
				lList.forEach(item=>{
					r.push({
						key:item,
						value:temp[item].value
					})
					// r = r.concat(temp[item].value);
				})
				r = {
					pyList:lList,
					data:r,
				}
				if(onlyGet){
					return r;
				}
				this.guid = guid;
				if(lList.length < 2){
					this.list = [];
					return r;
				}else{
					this.list = lList;
				}
				if(initF)
					initF(this);
				else{
					if(this.list.length < this.fn){
						this.fn = this.list.length;
					}else{
						this.fn = this.pfn;
					}
				}
				return r;
				// let s = 'A';
				// while(s[s.length-1]!='Z'){
				// 	s += String.fromCharCode(s[s.length-1].charCodeAt(0) + 1);
				// }
				// this.list = s.split('');
			},
			init(){
				this.$nextTick(()=>{
					const query = uni.createSelectorQuery().in(this);
					query.select('#pyc').boundingClientRect(data => {
						if(!data)
							return;
						this.n = Math.floor(data.height / this.ew);
						this.col = Math.ceil(this.list.length / this.n);
						this.firstLTop = ( data.height - this.ew * this.n ) / 2;
						this.lastN = this.list.length - this.n * (this.col - 1);
						this.lastLTop = ( data.height - this.lastN * this.ew ) / 2;
						this.wB = {
							...data,
							left:data.right - this.w,
						};
					}).exec();
				})
			},
			indexChange(e){
				// console.log(e.letter);
				this.$emit('letterChange',e);
			}
		}
	}
</script>

<style scoped>
	.pyi{
		color: #333;
		/* width: 2em; */
		text-align: center;
		/* line-height: 2em; */
		z-index: 1;
		will-change: right,color,font-size;
		right: 0;
	}
	.t-5 > *{
		transition: right 1s,color 1s,font-size 1s;
	}
	.pr{
		position: relative;
	}
	.z10{
		z-index: 10;
	}
	.pa{
		position: absolute;
	}
	.pn{
		pointer-events: none;
	}
	.xfc{
		/* overflow: hidden; */
		/* background-color: #fff; */
		z-index: 2;
	}
	.dn{
		display: none;
	}
</style>