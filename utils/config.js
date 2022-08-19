let baseUrl = ''; //测试环境

// #ifdef H5
baseUrl = window.h5Config.baseUrl;
const storageKey = {
	token:'token',
}

//达到缓存的一半时间就去请求新数据，达到缓存的时间就清空缓存，每次退出登录会清空缓存
const baseDataRefresh = {
  longRefresh:60 * 24 * 1, //长期缓存刷新时间，
  shortRefresh:60,//短期缓存的刷新时间，短期缓存不存储localstorage
  customRefresh:60,//用户自定义缓存的刷新时间，用户自定义缓存不存储localstorage
}

export {
	baseUrl,
	baseDataRefresh,
};
