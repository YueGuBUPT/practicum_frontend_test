(function() {function n(a,b){this.F=a;this.namespace=void 0===b?null:b}n.prototype.setItem=function(a,b){try{return this.F.setItem(null==this.namespace?a:this.namespace+"."+a,b),!0}catch(c){return!1}};n.prototype.getItem=function(a){return this.F.getItem(null==this.namespace?a:this.namespace+"."+a)};n.prototype.removeItem=function(a){this.F.removeItem(null==this.namespace?a:this.namespace+"."+a)};function p(){this.xhr=null}p.prototype.cancel=function(){this.xhr&&(this.xhr.abort(),this.xhr=null)};p.prototype.finish=function(){this.xhr=null};function r(a){this.D=a&&a.analyticsContext||null;this.o=a&&a.authToken||null;this.u=a&&a.authzToken||null;this.G=a&&a.brandRestriction||null;this.H=a&&a.buildName||null;this.J=a&&a.buildSha||null;this.i=a&&a.csrfTokens||{};this.C=a&&a.serverRoot||null;this.W=!!this.C;this.X=this.C?this.C+"/_ajax":"/_ajax"}
r.prototype.copy=function(a){var b={analyticsContext:this.D,authToken:this.o,authzToken:this.u,brandRestriction:this.G,buildName:this.H,buildSha:this.J,serverRoot:this.C},c;for(c in a)b[c]=a[c];if(null===a.csrfTokens)c=null;else{c={};a=a.csrfTokens||{};for(var d in this.i)c[d]=this.i[d];for(d in a)c[d]=a[d]}b.csrfTokens=c;return new r(b)};function t(a){var b=a.indexOf("/",1);return-1==b?a:a.substring(0,b)}r.prototype.get=function(a,b){var c=new p;this.send("GET",a,null,!0,null,c,null,b);return c};
r.prototype.post=function(a,b,c,d){var f=new p;u(this,"POST",a,b,!0,0,f,c,d);return f};function u(a,b,c,d,f,h,k,l,m){var g=t(c);if(g in a.i){var e=a.i[g];a.send(b,c,d,f,e,k,l,function(q,y){418==q&&1>h?(a.i[g]==e&&delete a.i[g],u(a,b,c,d,f,h+1,k,l,m)):(m&&m(q,y),k.finish())})}else a.send("GET","/csrf"+g,null,f,null,k,null,function(e,y){200==e?(g in a.i||(a.i[g]=String(y)),u(a,b,c,d,f,h,k,l,m)):(m(e,null),k.finish())})}
r.prototype.send=function(a,b,c,d,f,h,k,l){function m(){4==e.readyState&&g()}function g(){var a,b,c;try{a=e.status;var d,f;try{d=e.getResponseHeader("X-Canva-Auth")}catch(g){}try{f=e.getResponseHeader("X-Canva-Authz")}catch(g){}d&&(q.o="!"!=d?d:null);f&&(q.u="!"!=f?f:null);b=e.responseText}catch(g){if(g.message&&g.message.match(/c00c023f/))a=0,b="";else throw h.finish(),g;}b=b&&b.trim?b.trim():"";d=b.substring(0,20);if(0<d.length){if("'\"])}while(1);\x3c/x\x3e//"!=d){l(500,null);h.finish();return}b=
b.substring(20);try{c=JSON.parse(b)}catch(g){l(500,null);h.finish();return}}else c=null;l(a,c);h.finish()}b=this.X+b;var e=h.xhr=new XMLHttpRequest,q=this;e.open(a,b,d);this.W&&(e.withCredentials=!0);"GET"!=a&&f&&e.setRequestHeader("X-Csrf-Token",f);this.D&&e.setRequestHeader("X-Canva-Analytics",this.D);this.o&&e.setRequestHeader("X-Canva-Auth",this.o);this.u&&e.setRequestHeader("X-Canva-Authz",this.u);this.G&&e.setRequestHeader("X-Canva-Brand",this.G);this.H&&e.setRequestHeader("X-Canva-Build-Name",
this.H);this.J&&e.setRequestHeader("X-Canva-Build-Sha",this.J);null===c?a=null:"object"==typeof c&&"undefined"!==typeof Blob&&c instanceof Blob?(e.setRequestHeader("Content-Type",c.type),k&&e.upload.addEventListener("progress",k,!1),a=c):(e.setRequestHeader("Content-Type","application/json;charset\x3dUTF-8"),a=JSON.stringify(c));d?(e.onreadystatechange=m,e.send(a)):(e.send(a),g())};function v(){this.view=null}v.prototype.l=function(a){var b=this;this.view&&(this.view.remove(),this.view=null);a&&(this.view=new w,this.view.render(a).$el.appendTo("body"),this.view.once("hide",function(){return b.trigger("hide")}))};v.prototype.on=Backbone.Events.on;v.prototype.off=Backbone.Events.off;v.prototype.trigger=Backbone.Events.trigger;function w(){}w=Backbone.View.extend({className:"systemAlert"});w.prototype.events=function(){return{"click .systemAlertHide":this.hide}};
w.prototype.hide=function(a){a.preventDefault();this.trigger("hide")};w.prototype.render=function(a){var b=this.el;soy.asserts.assertType(goog.isString(a)||a instanceof goog.soy.data.SanitizedContent,"message",a,"string|goog.soy.data.SanitizedContent");a=soydata.VERY_UNSAFE.ordainSanitizedHtml('\x3cp class\x3d"systemAlertMessage"\x3e'+soy.$$escapeHtml(a)+'\x3c/p\x3e\x3ca class\x3d"systemAlertHide" href\x3d"#"\x3eOK, hide\x3c/a\x3e');b.innerHTML=a;return this};function x(){}x.prototype.now=function(){return Date.now()};var z=new x;var B=new A;function A(){}A.prototype.setInterval=function(a,b){return window.setInterval(a,b)};A.prototype.clearInterval=function(a){window.clearInterval(a)};A.prototype.setTimeout=function(a,b){return window.setTimeout(a,b)};A.prototype.clearTimeout=function(a){window.clearTimeout(a)};A.prototype.requestAnimationFrame=function(a){return window.requestAnimationFrame(a)};A.prototype.cancelAnimationFrame=function(a){window.cancelAnimationFrame(a)};function C(a,b,c,d,f){var h=this;this.view=a;this.j=this.message=null;this.K=c;this.R=b;this.O=d;this.N=f;this.v=null;this.view.on("hide",function(){if(h.message){var a=h.K,b="acknowledged."+h.message,c=h.N.now();try{var d=JSON.stringify(c);a.setItem(b,d)}catch(e){}h.l(null)}})}function D(a){a.j&&a.j.cancel();a.j=a.R.get("/alerts/active",function(b,c){a.j=null;200===b&&a.l(c)})}
C.prototype.start=function(a){var b=this;null==this.v&&(this.l(void 0!==a?a:null),this.v=this.O.setInterval(function(){return D(b)},3E5))};C.prototype.stop=function(){null!=this.j&&(this.j.cancel(),this.j=null);null!=this.v&&this.O.clearInterval(this.v)};C.prototype.l=function(a){if(a){var b;try{var c=this.K.getItem("acknowledged."+a);b=null!==c?JSON.parse(c):null}catch(d){b=null}if(null!=b&&864E5>this.N.now()-b)return}this.message=a;this.view.l(a)};$(function(){var a;if(window.localStorage)a=new n(window.localStorage,"SystemAlertController");else throw Error("ClientStore: localStorage is not defined on window, likely an unsupported browser");(new C(new v,new r(window.httpServiceConfig),a,B,z)).start(window.systemAlert)});})();