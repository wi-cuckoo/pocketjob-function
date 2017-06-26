const axios = require('axios');

const instance = axios.create({
	baseURL: 'https://api.weixin.qq.com/',
	timeout: 1000,
	headers: {'content-type': 'application/json'},
	withCredentials: true
});

exports.get = (url, params) => {
	return instance.get(url, { params: params })
	.then(resp => resp.data)
	.catch(err => console.log(err))
}

exports.post = (url, data) => {
	return instance.post(url, {data: data})
	.then(resp => resp.data)
	.catch(err => console.log(err))
}