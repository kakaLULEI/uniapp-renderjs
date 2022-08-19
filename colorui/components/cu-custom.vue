<template>
	<view>
		<view v-if="!noHeader" :class="['cu-custom',hasBanner? 'has-banner':'']" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar text-white" :style="style"
				:class="[bgImage!=''?'none-bg text-white bg-img':'',bgColorP?bgColor:'']">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<view @tap="rightClick" class='padding right'>
					<slot name="right"></slot>
				</view>
			</view>
		</view>
		<view v-if="hasBanner" :class="[bannerClass]"></view>
		<wm-watermark v-if="watermark"></wm-watermark>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				StatusBar: this.$StatusBar,
				CustomBar: this.$CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			...mapGetters(['noHeader']),
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			},
			bannerClass() {
				return 'hasBannerClass'
			}
		},
		props: {
			differentBg: {
				type: String,
				default: ''
			},
			hasBanner: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			watermark: {
				type: Boolean,
				default: true
			},
			backEmit: {
				type: Boolean,
				default: false
			},
			bgColorP: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			BackPage() {
				if (this.backEmit) {
					this.$emit('back');
				} else
					uni.navigateBack({
						delta: 1
					});
			},
			rightClick() {
				this.$emit('right');
			},
			hide(){
				this.CustomBar = this.$StatusBar;
			},
			show(){
				this.CustomBar = this.$CustomBar;
			}
		}
	}
</script>

<style scoped>
	.has-banner {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;

	}

	.right {
		position: absolute;
		right: 0;
	}

	.hasBannerClass {
		background-image: url('../../static/bg.png');
		background-size: 100% 100%;
		width: 100%;
		height: 224px
	}
</style>
