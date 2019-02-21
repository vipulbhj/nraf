const qs = require('querystring');
const path = require('path');
const fs = require('fs');

function typeBasedParser(type, data) {
	if(type === 'application/x-www-form-urlencoded')
		return qs.parse(data);
	else if(type === 'application/json;charset=utf-8')
		return JSON.parse(data)
	else
		return null
}

// function to read static files
function nrafReadFile(dir, filename, callback) {
	//console.log('Dir', dir);
	filename = typeof(filename) === 'string' && filename.length > 0 ? filename : false;

	if(filename) {
	   fs.readFile(`${dir}/${filename}`, 'utf8', (err, file) => {
          if(!err && file && file.length > 0 ) {
			// convert file from buffer to string if the file is an html file
			if(filename.indexOf('.html') || file.indexOf('.htm')) file = file.toString();

			// console.log('File content', file);
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

module.exports =  {
	typeBasedParser,
	nrafReadFile
};
