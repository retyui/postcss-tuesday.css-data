var Promise = require('bluebird');
var css = require('css');
var fs = Promise.promisifyAll(require('fs'));
var extend = require('util')._extend;



function getAllCssFiles(arr) {
	var _promises = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		_promises.push(fs.readFileAsync(arr[i]));
	}
	return Promise.all(_promises);
}

var files = [
	'./node_modules/tuesday/build/tuesday.css'
];


function oki(obj, resultObj) {

	let keyframesRules = obj.stylesheet.rules.filter(function(e) {
		return e.type === 'keyframes' && e.vendor == void 0
	});
	var rex = /-(webkit|o|ms|moz)-/g;
	var len = keyframesRules.length;
	while (len--) {
		obj.stylesheet.rules = [];
		var rule = keyframesRules[len];
		obj.stylesheet.rules[0] = rule;
		rule.keyframes.forEach(function(el) {
			el.declarations = el.declarations.filter(function(el) {
				debugger;
				return !rex.test(el.property);
			});
		});
		!resultObj[rule.name] ? resultObj[rule.name] = css.stringify(obj, {
			compress: true
		}) : console.warn(resultObj[rule.name] + ' is exist');
	}
}

getAllCssFiles(files).then(function(cssArr) {

	var _done = {};
	for (var i = cssArr.length - 1; i >= 0; i--) {

		oki(css.parse(cssArr[i].toString('utf-8')), _done);
	}

	fs.writeFileSync('./index.json', JSON.stringify(_done));

}, function(err) {
	console.log(err);
});