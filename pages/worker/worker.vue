<template>
	<view>
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
			console.log('我是renderjs')
			this.searchWorker = new Worker('static/js/worder.js');
			this.searchWorker.onerror = (event) => {
				console.log('worker error')
			};
			this.searchWorker.onmessage = (e)=>{
				console.log('worker message',e.data)
			};
			this.searchWorker.onmessageerror = ()=>{
				console.log('worker message error')
			}
			console.log('worker post message')
			this.searchWorker.postMessage('');
		},
		methods: {
		}
	}
</script>
<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
		},
        computed:{
		},
		methods: {
		},
		mounted() {},
		onUnload() {
		}
	}
</script>

<style>
</style>
