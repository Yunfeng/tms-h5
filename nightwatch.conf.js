module.exports = (function(settings) {
	//增加或修改nightwatch.json中的设置
  settings.test_workers = false;
  // console.log(settings);

  settings.selenium['server_path'] = require('selenium-server').path;
  settings.selenium.cli_args['webdriver.chrome.driver'] = require('chromedriver').path;
  settings.selenium.cli_args['webdriver.firefox.driver'] = require('geckodriver').path;
  console.log(settings);

  return settings;
})(require('./nightwatch.json'));