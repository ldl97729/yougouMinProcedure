export default function (options) {
    return new Promise((resolve, reject) => {
        if (!options.baseUrl) {
            options.baseUrl = 'https://autumnfish.cn/wx/'
        }
        wx.request({
            url: options.baseUrl + options.url,
            method: options.method || 'GET',
            header: options.header || {},
            data: options.data || {},
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}