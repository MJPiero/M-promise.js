var http = require("http"),
	url = require("url"),
	eventHandle = require("eventhandle.js");


// main
var Promise = function(){
	if (!(this instanceof Promise)) {
		return new Promise();
	}
	this._handle = new eventHandle();

};

/**
 * 对象串行化
 */
function serialize( a ) {
    var s = [ ];
    if ( a.constructor === Array ) {
        for ( var i = 0; i < a.length; i++ ) {
            s.push( a[i].name + "=" + encodeURIComponent( a[i].value ) );
        }
    } else {
        for ( var j in a ) {
            s.push( j + "=" + encodeURIComponent( a[j] ) );
        }
    }
    return s.join( "&" );
}
/**
 * 合并属性
 */
function extend( target, options ) {
    var hasOwn = Object.prototype.hasOwnProperty;
    for( var name in options ) {
        if( hasOwn.call( options, name ) ) {
            target[ name ] = options[ name ];
        }
    }
    return target;
}

/**
 * Promise.get
 */
Promise.prototype.get = function(opt){
	var promiseHandle= this;
	http.get(url.parse(opt), function(resp){
		var returnData = "";
		resp.setEncoding('utf8');

		if(resp.statusCode === 200){
			resp.on('data', function(data) {
				returnData += data;
				// promiseHandle._handle.emit("progress", data);
			});
			resp.on('end', function() {
				returnData = JSON.parse(returnData);
				if(returnData.status === 200){
					promiseHandle._handle.emit("success", returnData);
				}else{
					promiseHandle._handle.emit("error", returnData);
				}
			});
		}else{
			promiseHandle._handle.emit("error", resp.statusCode);
		}
	});
	return this;
};

/**
 * Promise.post
 */
Promise.prototype.post = function(posturl, data){
	var promiseHandle= this;
	var postData = serialize(data);
	var posturl = url.parse(posturl);
	var option = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}
	option = extend(option, posturl);
	var req = http.request(option, function(resp){
		var returnData = "";
		resp.setEncoding('utf8');
		if(resp.statusCode === 200){
			resp.on('data', function(data) {
				returnData += data;
				// promiseHandle._handle.emit("progress", data);
			});
			resp.on('end', function() {
				returnData = JSON.parse(returnData);
				if(returnData.status === 200){
					promiseHandle._handle.emit("success", returnData);
				}else{
					promiseHandle._handle.emit("error", returnData);
				}
			});
		}else{
			promiseHandle._handle.emit("error", resp.statusCode);
		}
	});
	req.write(postData);
	req.end();
	return this;
};


Promise.prototype.then = function(successHandle, errorHandle, progressHandle){
	if(typeof successHandle === "function"){
		this._handle.once("success", successHandle);
	}
	if(typeof errorHandle === "function"){
		this._handle.fail(errorHandle);
	}
	if(typeof progressHandle === "function"){
		this._handle.on("progress", progressHandle);
	}
	return this;
};

// export
module.exports = Promise;