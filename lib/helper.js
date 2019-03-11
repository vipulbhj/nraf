const qs = require('querystring');
const path = require('path');
const fs = require('fs');

function typeBasedParser(type, data) {
	if (type === 'application/x-www-form-urlencoded')
		return qs.parse(data);
	else if (type === 'application/json;charset=utf-8')
		return JSON.parse(data)
	else
		return null
}

// function to read static files
function nrafReadFile(dir, filename, callback) {
	//console.log('Dir', dir);
	filename = typeof (filename) === 'string' && filename.length > 0 ? filename : false;

	if (filename) {
		fs.readFile(`${dir}/${filename}`, (err, file) => {
			if (!err && file && file.length > 0) {
				// convert file from buffer to string if the file is an html file
				callback(false, file);
			} else {
				// console.log('readfile error', err);
				callback(new Error(`cannot read file ${filename}`))
			}
		});
	} else {
		// console.log('Error', 'file wrong')
		callback(new Error(`file ${filename} not found`));
	}
}

// function to read static files
function nrafRenderFile(dir, filename, data , callback) {
	// console.log('Dir', dir);
	filename = typeof (filename) === 'string' && filename.length > 0 ? filename : false;

	if (filename) {
		fs.readFile(`${dir}/${filename}.html`, 'utf8', (err, file) => {
			if (!err && file && file.length > 0) {
				// convert file from buffer to string if the file is an html file

				callback(false, nrafInterpolateHtml(file, data));
			} else {
				// console.log('readfile error', err);
				callback(new Error(`cannot read file ${filename}`))
			}
		});
	} else {
		// console.log('Error', 'file wrong')
		callback(new Error(`file ${filename} not found`));
	}
}

function nrafInterpolateHtml(str, data) {
	str = typeof (str) === 'string' && str.length > 0 ? str : false;
	data = typeof (data) === 'object' && data !== null ? data : {};

	if (str) {
		console.log('String yes');
		Object.keys(data).forEach(key => {
			console.log('key', key);
			let find = '{{' + key + '}}';
			// let find1 = new RegExp(`\\b${key}\\b`, 'g');
			let find1 = new RegExp(`({{){1}(.)*[${key}]+(.)*(}}){1}`, 'g');
			str = str.replace(find1, data[key]);
		});
	}

	return str;
}

module.exports = {
	typeBasedParser,
	nrafReadFile,
	nrafRenderFile,
	nrafInterpolateHtml
};
