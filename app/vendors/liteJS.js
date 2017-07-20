!function(a,b){function c(){return o.get("q")}function d(a){var b=g(a.target),c=b.data("instance");c&&(q.lock=!0,q.push(c),q.lock=!1),a.target&&a.target.innerHTML&&(b.find("[data-instance]").each(function(a){var b=g(a).data("instance");q.push(b)}),q.lock=!1)}function e(a){a.each(function(a){var b=a.getAttribute("data-component"),c=(a.getAttribute("data-template"),o.get(b,a));c.element=a,c.name=b,c.init()})}function f(a,b,c,d,e,f){h[a]={name:a,class:c,dependencies:b,isSingleton:d,isFunction:e,isProvider:f}}var g,h={},i={},j={},k=function(){};k.prototype.init=function(){},k.prototype.destroy=function(){},k.prototype.on=function(a,b,c){if(!c)throw"subscriber key is not passed ex: .on(eventName, callback, this.key);";return r.on(a,b,this,c)},k.prototype.off=function(a,b){r.off(a,this,b)},k.prototype.trigger=function(a,b){r.publish(a,b,this)},k.prototype.completeOff=function(){if(this.events)for(var a in this.events)for(var b=0;b<this.events[a].length;b++)"function"!=typeof this.events[a]&&r.off(a,this,this.events[a][b].subscriberKey)};var l=function(a){this.notifyParent=function(b,c){a.trigger(b,c)},this.notifyParentExP=function(b,d){var e=c(),f=new e.Deferred;return a.trigger(b,{data:d,deferred:f}),f.promise}};for(var m in k.prototype)l.prototype[m]=k.prototype[m];l.prototype.render=function(a,b,c){this.config={template:a,append:c},c?this.element.innerHTML+="<div lpTemplate>"+j.templateFunc(a,b)+"</div>":this.element.innerHTML=j.templateFunc(a,b);var d=this.events;if(d)for(var e in d)for(var f=e.split(","),h=0;h<f.length;h++){var i=f[h].split(" "),k=i[0],l=i[1],m=g(this.element).find(l);m.each(function(a){g(a).on(k,d[e])})}},l.prototype.reRender=function(a){this.render(this.config.template,a,this.config.append)},l.prototype.createChild=function(a,b,c){if(!a||!b||!c)throw"Please check parameter pass to create child";var d=o.get(a,c,this);return d.init(b),d},l.prototype.addChild=function(a,b){if(!a)throw"child element is missing";b?b.appendChild(a):this.element.appendChild(a)},l.prototype.createAddChild=function(a,b,c,d){if(!a||!b||!c)throw"Please check parameter pass to create child";var e=this.createChild(a,b,c);return d?d.appendChild(c):this.element.appendChild(c),e},l.prototype.removeChild=function(a){this.element.removeChild(a)},l.prototype.remove=function(){this.element.parentNode.removeChild(this.element)};var n=0,o={export:function(a){for(var b in a.export)"function"==typeof a.export[b]&&(a.export[b]=a.export[b].bind(a));return a.export},get:function(a,b,c){var d,e=h[a];if(d=e?i[e.name]:i[a])return d instanceof Function||!d.export?d:this.export(d);if(!e)throw a+" is not found. Please check the component name";var f=[];if("function"==typeof e.dependencies)throw a+" dependencies can't be omit. It can be blank array";if(e.dependencies)for(var g=e.dependencies.length,j=0;j<g;j++){var m=h[e.dependencies[j]];if(m&&!m.isSingleton)throw"UI component can't be injected, instead use services for communication";var o=this.get(e.dependencies[j]);f.push(o)}var p;if(e.isFunction)d=e.class.apply({},f);else{if(b){if(null!==b.getAttribute("data-instance"))throw"Element for "+a+" is already in use.";d=new l(c),p="key_"+n++,d.key=p,d.element=b,i[p]=d,b.setAttribute("data-instance",p)}else d=new k,d.key=e.name;e.class.apply(d,f)}return d.typeof=e.name,d.isProvider=e.isProvider,e.isSingleton&&delete h[a],b||(i[e.name]=d),e.isFunction||!d.export?d:this.export(d)},updateProvider:function(){for(var a in i)if(i[a].isProvider){for(var b in i[a].export)"lt$get"!==b&&delete i[a].export[b];i[a].export=i[a].export.lt$get}for(var a in h)h[a].isProvider&&delete h[a]}},p=[],q={lock:!1,push:function(a){p.push(a)},init:function(){function a(){var a;for(p.length;a=p.pop();){var b=i[a];if(b){b.completeOff(),b.destroy();var c=b.events;if(c)for(var d in c)for(var e=d.split(","),f=0;f<e.length;f++){var h=e[f].split(" "),j=h[0],k=h[1],l=g(b.element).find(k);l.each(function(a){g(a).off(j,c[d])})}delete i[a]}}q.lock=!0}setInterval(function(){!q.lock&&p.length&&a()},2e3)}};a.liteJS={component:function(a,b,c){f(a,b,c)},service:function(a,b,c){f(a,b,c,!0)},provider:function(a,b,c){f(a,b,c,!0,!1,!0)},func:function(a,b,c){f(a,b,c,!0,!0)},app:function(a){return this.appName=a,g=o.get("query"),this.service("config",[],function(){this.export=j}),this.service("instanceFactory",[],function(){this.export={initUIComponents:e}}),this},run:function(a,c){if(a){for(var e=[],f=0;f<a.length;f++)e.push(o.get(a[f]));c.apply(this,e)}else c.call();j.templateFunc,j.defaultLayout,o.updateProvider(),q.init(),o.get("router").run(),g(b).on("DOMNodeRemoved",function(a){a.target.getAttribute&&d(a)})},ready:function(a){g=g||o.get("query"),g(b).ready(function(){a()})}};var r={on:function(a,b,c,d){c.events=c.events||{},c.events[a]||(c.events[a]=[]);var e=g.token();return c.events[a].push({subscriberKey:d,callback:b,eventToken:e}),e},off:function(a,b,c){var d=b.events[a];if(d){for(var e=0;e<d.length;e++)if(d[e].subscriberKey===c){d.splice(e,1);break}}else for(var f in b.events)for(var g=0;g<b.events[f].length;g++)if(b.events[f][g].eventToken=a)return void b.events[f].splice(g,1)},publish:function(a,b,c){var d=c.events[a];if(d)for(var e=0;e<d.length;e++)if(d[e].subscriberKey in i)if("object"==typeof b)if(b.deferred){var f=b.deferred;delete b.deferred,d[e].callback({data:b.data,deferred:f})}else d[e].callback({data:b});else d[e].callback({data:b});else c.off(a,c,d[e].subscriberKey)}}}(window,document),liteJS.provider("ajax",["q"],function(a){function b(b){var d=window.XMLHttpRequest?new window.XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),e=b.headers,f=new a.Deferred;if(e)for(var g=0;g<e.length;g++)d.setRequestHeader(e[g].key,e[g].value);return d.open(b.method,b.url,b.async||!0),b.before&&b.before(d),c.settings.before&&c.settings.before(d),d.onreadystatechange=function(){switch(d.readyState){case 2:b.sent&&b.sent(d);break;case 4:c.settings.after&&c.settings.after(d.responseText,d.status,d);var a,e=d.getResponseHeader("content-type");e&&-1!=e.toLowerCase().indexOf("json")&&(a=JSON.parse(d.responseText)),200==d.status?(b.success&&b.success(a||d.responseText,d,d.status),f.resolve(a||d.responseText)):(b.error&&b.error(a||d.responseText,d,d.status),f.reject(d))}},setTimeout(function(){d.send()},0),function(){return f.promise}}var c=this;c.settings={},this.export={lt$get:{get:function(a){return a.method="GET",b(a)},put:function(a){return a.method="PUT",b(a)},post:function(a){return a.method="POST",b(a)},delete:function(a){return a.method="DELETE",b(a)}},before:function(a){c.settings.before=a},after:function(a){c.settings.after=a}}}),liteJS.func("query",[],function(){function a(a,b){return b?b.elements[0].querySelectorAll(a):document.querySelectorAll(a)}function b(b){if("object"==typeof b){switch(b){case document:this.ready=function(a){c.push(a)}}b.length>=0?this.elements=b:this.elements=[b]}else this.elements="string"==typeof b?a(b):b}var c=[],d={addEventListener:document.addEventListener,removeEventListener:document.removeEventListener,createEvent:"createEvent"in document};b.prototype={find:function(c){return new b(a(c,this))},get:function(a){return this.elements[a]},first:function(a){return new b(this.elements[0])},addClass:function(a){for(var b=this.elements.length,c=this.elements,d=0;d<b;d++)-1==c[d].className.indexOf(a)&&(c[d].className=c[d].className.length>0?c[d].className+" "+a:a);return this},removeClass:function(a){for(var b=this.elements.length,c=0;c<b;c++)this.elements[c].className.length&&(this.elements[c].className=this.elements[c].className.replace(a,""));return this},hasClass:function(a){return this.elements[0].className.indexOf(a)>-1},append:function(a){for(var b=this.elements.length,c=0;c<b;c++)"string"==typeof a?this.elements[c].innerHTML=this.elements[c].innerHTML+a:a.elements.length&a.elements.length>0&&this.elements[c].appendChild(a.elements[0]);return this},html:function(a){if(a||""===a){for(var b=this.elements.length,c=0;c<b;c++)"string"==typeof a?this.elements[c].innerHTML=a:(this.elements[c].innerHTML="",a.elements.length&a.elements.length>0&&this.elements[c].appendChild(a.elements[0]));return this}return this.elements[0].innerHTML},on:function(a,b){for(var c=0;c<this.elements.length;c++)d.addEventListener?this.elements[c].addEventListener(a,b):this.elements[c].attachEvent("on"+a,b)},off:function(a,b){for(var c=0;c<this.elements.length;c++)d.removeEventListener?this.elements[c].removeEventListener(a,b):this.elements[c].detachEvent("on"+a,b)},each:function(a){for(var b=this.elements.length,c=0;c<b;c++)a(this.elements[c],c)},trigger:function(a,b){for(var c=0;c<this.elements.length;c++){var d=document.createEvent("HTMLEvents");d.initEvent(a,!0,!0),d.data=b,this.elements[c].dispatchEvent(d)}},prop:function(a,b){if(b){for(var c=this.elements.length,d=0;d<c;d++)this.elements[d][a]=b;return this}return this.elements[0][a]},attr:function(a,b){if(b){for(var c=this.elements.length,d=0;d<c;d++)this.elements[d].setAttribute(a,b);return this}return this.elements[0].getAttribute(a)},data:function(a,b){return this.attr("data-"+a,b)},css:function(a,b){if("string"==typeof a)this.each(function(c){c.style[a]=b});else for(var c in a)this.each(function(b){b.style[c]=a[c]})},parent:function(){return new b(this.elements[0].parentElement)}},document.addEventListener("DOMContentLoaded",function(){for(var a=0;a<c.length;a++)c[a].call()});var e=function(a){return new b(a)};return e.extend=function(){var a={};for(key in arguments){var b=arguments[key];for(prop in b)Object.prototype.hasOwnProperty.call(b,prop)&&(a[prop]=b[prop])}return a},e.queryParam=function(a){var b,c,d,e={},f=a.lastIndexOf("?");if(-1!==f)for(a=a.slice(f+1),b=a.split("&"),d=0;d<b.length;d++)c=b[d].split("="),c.length<2&&c.push(""),e[decodeURIComponent(c[0])]=decodeURIComponent(c[1]);return e},e.new=function(a,b){return b?e(document.createElement(a)):document.createElement(a)},e.token=function(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)},e}),liteJS.service("q",[],function(){function a(){this.promise={}}function b(b){function c(a,b){h.cancelled||(e[a]=b,g=this.hasError||g,f--,h.updateProgress&&h.updateProgress(a,b),f||(g?h.errorCall.apply({},e):h.successCall.apply({},e)))}var d=[],e=[],f=b.length,g=!1,h=this;this.call=function(e){for(var f,g=0;g<b.length;g++)if("object"==typeof b[g]&&"done"in b[g]&&"fail"in b[g]){var i=new a;d.push(i.promise),i.promise.push=c.bind(i.promise,g),b[g].done(function(a){i.resolve(a)}).fail(function(a){i.promise.hasError=!0,i.reject(a)})}else f=e[g]?b[g].apply(h,e[g]):b[g](),f.push=c.bind(f,g),d.push(f)}}function c(a){var c=new b(a);return setTimeout(function(){c.call(c.params)},0),c}a.prototype.resolve=function(a){this.promise.push&&this.promise.push(a)},a.prototype.reject=function(a){this.promise.hasError=!0,this.promise.push&&this.promise.push(a)},b.prototype.success=function(a){return this.successCall=a,this},b.prototype.error=function(a){return this.errorCall=a,this},b.prototype.progress=function(a){return this.updateProgress=a,this},b.prototype.cancel=function(){return this.cancelled=!0,this},b.prototype.params=function(){return this.params=arguments,this},this.export={when:function(){return c(arguments)},Deferred:a,dynamic:function(b){return function(){var c=new a,d=arguments;return setTimeout(function(){try{var a=b.apply({},d);c.resolve(a)}catch(a){c.reject(a)}},0),c.promise}}}}),liteJS.provider("router",["query","config","instanceFactory"],function(a,b,c){function d(a){for(var b in a)"/"===b?j={path:b,routeObj:a[b]}:k.push({path:b.split("?")[0],routeObj:a[b]})}function e(b){if(l.before_route_change){var c=g(b);c.done=function(d){a(document).trigger("change_app_route",{routeConfig:g(b),params:a.queryParam(window.location.hash),done:function(){l.trigger("after_route_change",c)}})},l.trigger("before_route_change",c)}else a(document).trigger("change_app_route",{routeConfig:g(b),params:a.queryParam(window.location.hash),done:function(){l.trigger("after_route_change",c)}})}function f(a,b){b?e(a):window.location.hash=a}function g(a){var b,c;a&&(b=a.split("?")[0]);for(var d=0;d<k.length;d++)if(b===k[d].path){c=k[d].routeObj;break}return c||(c=j.routeObj),c}function h(){i(),window.addEventListener("hashchange",function(){f(location.hash.slice(1),!0)}),f(location.hash.slice(1),!0)}function i(){var d,e,f;a(document).on("change_app_route",function(g){var h=g.data,i=h.routeConfig;if(d||(d=a("[ltApp]")),e=d.attr("layout")){var j;i.layout&&e!==i.layout&&(d.html(b.templateFunc(i.layout)),d.attr("layout",i.layout),j=!0),i.layout||e===b.defaultLayout||(d.html(b.templateFunc(b.defaultLayout)),d.attr("layout",b.defaultLayout),j=!0),f=d.find("[ltView]");var k=a.new("div",!0);k.attr("data-component",i.component),f.html(k),c.initUIComponents(j?d.find("[data-component]"):k)}else d.html(b.templateFunc(i.layout||b.defaultLayout)),d.attr("layout",i.layout||b.defaultLayout),f=d.find("[ltView]").html("<div data-component='"+i.component+"'></div>"),c.initUIComponents(d.find("[data-component]"));a(document).trigger("route_changed",d),g.data.done()})}var j,k=[],l=this;this.export={registerRoutes:function(a){d(a)},beforeRouteChange:function(a){l.on("before_route_change",a,l)},afterRouteChange:function(a){l.on("after_route_change",a,l)},lt$get:{goTo:function(a){f(a)},run:function(){h(),delete this.run}}}});