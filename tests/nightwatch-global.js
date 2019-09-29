module.exports = {
	'default': {
		isLocal: true,
	},

	'integration': {
		isLocal: false
	},

	before: function (cb) {
		console.log('Global Before');
		cb();	
	},

	beforeEach: function (browser, cb) {
		console.log('Global BeforeEach');
		cb()
	},

	after: function (cb) {
		console.log('Global After');
		cb();
	},

	afterEach: function (browser, cb) {
		browser.perform(function() {
			console.log('Global afterEach');
			cb()			
		})
	}
};