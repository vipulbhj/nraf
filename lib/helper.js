const qs = require('querystring');
const path = require('path');
const fs = require('fs');

// class fo holding includes string
class myIncludesString {

	constructor() {
		this.checkForIncludeString;
	};

	setIncludeString(str) {
		this.checkForIncludeString = str;
	}

	getIncludeString() {
		// console.log(this.checkForIncludeString);
		return this.checkForIncludeString;
	}
};

// create new instance of myIncludesStringClass
let myInclude  = new myIncludesString();


let viewFolder = '';

// function to set view folder
function setViewFolder(dir) {
	viewFolder = dir;
}


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
				 
				// check for includes in file and include them
				let newFile = checkForIncludes(file);

				// console.log('New File', newFile);

				// let newFile = '';

				// if the file is not empty change it to the new string
				// if(myInclude.getIncludeString() != '') newFile = myInclude.getIncludeString();

				callback(false, nrafInterpolateHtml(newFile, data));
			} else {
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
		Object.keys(data).forEach(key => {
			if(data.hasOwnProperty(key)) {
				let find = new RegExp(`({{){1}[^a-zA-Z0-9_.-]*${key}{1}[^a-z]*(}}){1}`, 'gi');
				str = str.replace(find, data[key]);
			}
		});
	}

	return str;
}

function checkForIncludes(str) {

	let returnString = '';

	// check for includes
	let match = str.match(/({{){1,}include ([a-zA-Z0-9_.-]+.html)(}}){1,}/gi);
	

	// loop through all include found
	match.forEach(function(element) {
		// split into array
		let elArray = element.split(' ');
		// get file
		let file = elArray[1].replace(/}/g, '');

		// read file
		let newFile = fs.readFileSync(`${viewFolder}/${file}`, 'utf8');

		// replace regular expression
		let replaceStr = new RegExp(`({{){1,}include (${file})(}}){1,}`, 'g');

		// replace file
		str = str.replace(replaceStr, newFile);

		returnString = str;
		// myInclude.setIncludeString(str);
	});

	return returnString;

}

module.exports = {
	typeBasedParser,
	nrafReadFile,
	nrafRenderFile,
	nrafInterpolateHtml,
	checkForIncludes,
	setViewFolder
};
