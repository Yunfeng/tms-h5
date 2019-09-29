module.exports = {
    'login': function (client) {
        // 定义页面元素
        const usernameInput = '#username';
        const passwordInput = '#password';
        const loginBtn = '#btnLogin';
        const flightTable = '#flight-orders';
        const searchBtn = "#btnSearch"

        const baseUrl = 'http://localhost:8090/'
        const testUrl = baseUrl + 'tbooking/orders'
        // 启动浏览器并打开
        client
            .url(baseUrl)
            .waitForElementVisible(usernameInput, 1000)
            .setValue(usernameInput, 'test2')
            .waitForElementVisible(passwordInput, 1000)
            .setValue(passwordInput, '123456')
            .click(loginBtn)
            .waitForElementVisible(flightTable, 1000)
    },

    'step two: search tbooking orders': function (client) {
        // 定义页面元素
        const searchBtn = "#btnSearch"

        const baseUrl = 'http://localhost:8090/'
        const testUrl = baseUrl + 'tbooking/orders'
        // 启动浏览器并打开
        client
            .url(testUrl)
            .waitForElementVisible(searchBtn, 1000)
            .click(searchBtn)
            .pause(1000)
    },

    after: function(client) {
        client.end()
    }
}