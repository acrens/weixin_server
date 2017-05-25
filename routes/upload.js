const fs = require('fs');
const request = require('request-promise');

exports.uploadImg = function(req, res) {
    let that = this;
    let form = {
		"articles": [{
			"title": "测试永久素材",
			"thumb_media_id": "",
			"author": "acrens",
			"digest": "测试永久素材摘要",
			"show_cover_pic": 0,
			"content": "acrens 测试永久素材",
			"content_source_url": "https://mp.weixin.qq.com/s?__biz=MzI3MzI4NjQyNw==&tempkey=2DDPlpgnJ7FvPGvM8wbhs0Euhjk2nnsMO0ivYfydRzom9fd3U1IB6GwF%2F3ki4z8xKCOwkr%2BiwWG2j2f%2FZWjmOl7foZGdtWd5GhigQKLlrVr2wz5seZ7%2BIWacVXtGMgblFruxp7WyHDvh5sAAIbdF2w%3D%3D&chksm=6b24d5765c535c604e0fca74a674140e192f60a325e421437570991e05ac3569183037d5c10d#rd"
		}]
    }
    let uploadUrl = 'https://api.weixin.qq.com/cgi-bin/material/add_news?';

    return new Promise(function(resolve, reject) {
        new Promise(function(resolve, reject) {
            resolve({
                access_token: req.query.access_token
            });
        }).then(function(data) {
            let url = uploadUrl + 'access_token=' + data.access_token;
            let opts = {
                method: 'POST',
                url: url,
                json: true,
                body: form
            }

            request(opts).then(function(response) {
                let returnData = response.body;
                if (returnData) {
                    resolve(returnData);

                    res.send('添加成功');
                } else {
                    throw new Error('upload permanent material failed!');
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    });
}
