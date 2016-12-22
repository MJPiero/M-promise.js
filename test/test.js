var chai = require('chai') ,
  	expect = chai.expect,
  	should = chai.should;

var Promise = require("../");
var promise = new Promise();

describe("test promise", function(){
	it("should success get promise", function(done){
		promise
		.get("http://www.mob.com/download/products")
		.then(function(resp){
			expect(resp.status).to.be.equal(200);
			expect(resp.res).to.have.all.keys("products","sdk_plats");
			done();
		},function(error){
			if(error){
				throw error;
			}
		});
	});

	it("should success post promise", function(done){
		promise
		.post("http://www.mob.com/download/detail",{
			type: "ShareSDK",
			plat: "android"
		})
		.then(function(resp){
			expect(resp).to.be.a("object");
			expect(resp.status).to.be.equal(200);
			expect(resp.res).to.have.all.keys('sdk', 'history');
			done();
		},function(error){
			if(error){
				throw error;
			}
		});
	});
});