define("lib/utils",[],function(){var e={$:function(e){return e.charAt(0)=="#"?document.getElementById(e.substr(1)):document.getElementsByTagName(e)},$new:function(e){return document.createElement(e)},isObject:function(e){return e===Object(e)},isFunction:function(e){return"function"==typeof e}};return["Arguments","String","Number","Date","RegExp"].forEach(function(t){e["is"+t]=function(e){return toString.call(e)=="[object "+t+"]"}}),e.clone=function(t){if(!t||t instanceof HTMLElement||t instanceof Function)return t;var n;t.constructor==Object?n={}:t instanceof Array?n=[]:n=new t.constructor(t.valueOf());for(var r in t)n[r]!=t[r]&&(t[r]&&typeof t[r]=="object"?n[r]=e.clone(t[r]):n[r]=t[r]);return n},e.device=function(){return/mobile/i.test(window.navigator.userAgent)?"mobile":"pc"}(),Array.prototype.remove=function(e){for(var t=this.length;t--;)this[t]===e&&this.splice(t,1);return this},Function.prototype.bind=function(e){var t=this;return function(){var n=Array.prototype.slice.call(arguments);return t.apply(e||null,n)}},e}),define("lib/class",["lib/utils"],function(e){var t=function(){};return t.extend=function(t){function s(){if(!initializing){for(var t in this)this[t]&&e.isObject(this[t])&&(this[t]=e.clone(this[t]));this.init&&this.init.apply(this,arguments)}return this}var n=this.prototype;initializing=!0;var r=new this;initializing=!1;for(var i in t)e.isFunction(t[i])&&e.isFunction(n[i])?r[i]=function(e,t){return function(){var r=this.super||null;this.super=n[e];var i=t.apply(this,arguments);return r&&(this.super=r),i}}(i,t[i]):r[i]=t[i];return s.prototype=r,s.prototype._events={},s.prototype.on=function(e,t){this._events[e]?this._events[e].push(t):this._events[e]=[t]},s.prototype.trigger=function(e){var t=this,n=Array.prototype.slice.call(arguments,1);t._events[e]&&t._events[e].forEach(function(e){e.apply(t,n)})},s.prototype.listenTo=function(e,t,n){var r=this;e.on(t,function(){n.apply(r,arguments)})},s.prototype.constructor=s,s.extend=arguments.callee,s},t}),define("lib/texture",["lib/class"],function(e){var t=e.extend({path:"",image:null,width:0,height:0,rows:1,columns:1,tileWidth:0,tileHeight:0,loaded:!1,init:function(e,n,r){return this.path=t.IMGPATH+e,this.rows=n||1,this.columns=r||1,this},load:function(e){var t=this;return this.loaded?window.setTimeout(function(){t.onload.call(t,e)},0):(this.image=new Image,this.image.onload=function(){t.onload.call(t,e)},this.image.src=this.path+"?"+Date.now()),this},reload:function(){this.loaded=!1,this.image=new Image,this.image.onload=this.onload.bind(this),this.image.src=this.path+"?"+Date.now()},onload:function(e){this.loaded=!0,this.width=this.image.width,this.height=this.image.height,this.tileWidth=this.width/this.columns,this.tileHeight=this.height/this.rows,e&&e(null)},draw:function(e,t,n,r,i,s,o){this.loaded&&(s=Math.min(this.width-r,s),o=Math.min(this.height-i,o),e.drawImage(this.image,r,i,s,o,t,n,s,o))},drawTile:function(e,t,n,r){if(this.loaded){r=r||0;var i=r%this.columns*this.tileWidth,s=window.parseInt(r/this.columns)*this.tileHeight;e.drawImage(this.image,i,s,this.tileWidth,this.tileHeight,t,n,this.tileWidth,this.tileHeight)}}});return t.IMGPATH="",t}),define("lib/event",["lib/class","lib/utils"],function(e,t){var n={longTapDelay:750,swipeRightAngle:30,swipeLeftAngle:30,swipeDownAngle:30,swipeUpAngle:30,swipeMinX:30,swipeMinY:30,tapMaxX:10,tapMaxY:10,preventScrollRight:!0,preventScrollLeft:!0,preventScrollUp:!0,preventScrollDown:!0,moveDetect:!1},r=function(e,t,n,r){return Math.abs(e-n)>=Math.abs(t-r)?e-n>0?"Left":"Right":t-r>0?"Up":"Down"},i=function(e,t,r){if(e>0&&Math.abs(r)<n.swipeRightAngle)return"Right";if(e<0&&Math.abs(r)<n.swipeLeftAngle)return"Left";if(t>0&&Math.abs(r)>90-n.swipeDownAngle)return"Down";if(t<0&&Math.abs(r)>90-n.swipeUpAngle)return"Up"},s=function(e){return Math.atan(e)*180/Math.PI},o=function(){_longTapTimeout&&(clearTimeout(_longTapTimeout),_longTapTimeout=null)},u=function(e){e.x2=e.x,e.y2=e.y,e.dx=e.x2-e.x1,e.dy=e.y2-e.y1,e.angle=s(e.dy/e.dx),e.direction=i(e.dx,e.dy,e.angle),e.moveDirection=r(e._lastX,e._lastY,e.x2,e.y2),e._distanceX+=Math.abs(e.x2-e._lastX),e._distanceY+=Math.abs(e.y2-e._lastY),e._lastX=e.x2,e._lastY=e.y2},a=e.extend({info:{},init:function(e){var n=this;this.el=e,this.startMouse=this.endMouse=null,this.type=a.type.none,t.device==="mobile"?(e.addEventListener("touchstart",function(e){n.onTouchStart.apply(n,arguments)},!1),e.addEventListener("touchmove",function(e){n.onTouchMove.apply(n,arguments)},!1),e.addEventListener("touchend",function(e){n.onTouchEnd.apply(n,arguments)},!1),e.addEventListener("touchcancel",function(e){n.onTouchEnd.apply(n,arguments)},!1)):(e.addEventListener("mousedown",function(e){n.onMouseDown.apply(n,arguments)},!1),e.addEventListener("mousemove",function(e){n.onMouseMove.apply(n,arguments)},!1),e.addEventListener("mouseup",function(e){n.onMouseUp.apply(n,arguments)},!1),e.addEventListener("contextmenu",function(e){e.returnValue=!1},!1),e.onclick=function(e){n.onClick.apply(n,arguments)},e.ondblclick=function(e){n.onDoubleClick.apply(n,arguments)})},cancelLongTap:function(){this._longTapTimeout&&(clearTimeout(this._longTapTimeout),this._longTapTimeout=null)},longTap:function(){this.cancelLongTap(),this._triggerEvent.call(this,a.type.longPress),this.info={}},_triggerEvent:function(e){this.info.type=e,this.trigger(e,t.clone(this.info))},onTouchStart:function(e){var t=this;e.touches&&e.touches.length===1&&this.info.x2&&(this.info.x2=undefined,this.info.y2=undefined,this.info._lastX=undefined,this.info._lastY=undefined);var r=Date.now(),i=r-(this.info._last||r),s=e.touches[0];this.info.x1=this.info.x=this.info._lastX=s.pageX,this.info.y1=this.info.y=this.info._lastY=s.pageY,i>0&&i<=250&&(this.info.isDoubleTap=!0),this.info._last=r,this.info._distanceX=this.info._distanceY=0,this._longTapTimeout=setTimeout(function(){t.longTap.apply(t,arguments)},n.longTapDelay),this._triggerEvent.call(this,a.type.touchStart)},onTouchMove:function(e){this.cancelLongTap();var t=e.touches[0];this.info.x=t.pageX,this.info.y=t.pageY,e.touches.length>1?this.info.mutiTouch=!0:this.info.mutiTouch=!1,u(this.info),n.moveDetect&&(this._triggerEvent.call(this,a.type.move),this._triggerEvent.call(this,a.type["move"+this.info.moveDirection])),n["preventScroll"+this.info.direction]&&e.preventDefault(),this._triggerEvent.call(this,a.type.touchMove)},onTouchEnd:function(e){var t=this;this.cancelLongTap();if(e.changedTouches&&e.changedTouches.length){var r=e.changedTouches[0];this.info.x=r.pageX,this.info.y=r.pageY,u(this.info)}this._triggerEvent.call(this,a.type.touchEnd),(this.info.direction==="Left"||this.info.direction==="Right")&&Math.abs(this.info.dx)>n.swipeMinX||(this.info.direction==="Up"||this.info.direction==="Down")&&Math.abs(this.info.dy)>n.swipeMinY?this._swipeTimeout=setTimeout(function(){t._triggerEvent.call(t,a.type.swipe),t._triggerEvent.call(t,a.type["swipe"+t.info.direction]),t.info={}},0):this.info._distanceX<n.tapMaxX&&this.info._distanceY<n.tapMaxY?this._tapTimeout=setTimeout(function(){t._triggerEvent.call(t,a.type.tap),t.info.isDoubleTap&&(t._triggerEvent.call(t,a.type.doubleTap),this.info={})},0):this.info={}},onMouseDown:function(e){var t=this;this.info.x1=this.info.x=this.info._lastX=e.offsetX,this.info.y1=this.info.y=this.info._lastY=e.offsetY,this.info._distanceX=this.info._distanceY=0,this._longTapTimeout=setTimeout(function(){t.longTap.apply(t,arguments)},n.longTapDelay),this._triggerEvent.call(this,a.type.touchStart)},onMouseMove:function(e){this.cancelLongTap(),this.info.x=e.offsetX,this.info.y=e.offsetY,u(this.info),n.moveDetect&&(this._triggerEvent.call(this,a.type.move),this._triggerEvent.call(this,a.type["move"+this.info.moveDirection])),this._triggerEvent.call(this,a.type.touchMove)},onMouseUp:function(e){var t=this;this.cancelLongTap(),this.info.x=e.offsetX,this.info.y=e.offsetY,u(this.info),this._triggerEvent.call(this,a.type.touchEnd);if((this.info.direction==="Left"||this.info.direction==="Right")&&Math.abs(this.info.dx)>n.swipeMinX||(this.info.direction==="Up"||this.info.direction==="Down")&&Math.abs(this.info.dy)>n.swipeMinY)this._triggerEvent.call(this,a.type.swipe),this._triggerEvent.call(this,a.type["swipe"+this.info.direction]),this.info={}},onClick:function(e){this.info.x=e.offsetX,this.info.y=e.offsetY,u(this.info),this._triggerEvent.call(this,a.type.tap),this.info={}},onDoubleClick:function(e){this.info.x=e.offsetX,this.info.y=e.offsetY,u(this.info),this._triggerEvent.call(this,a.type.doubleTap),this.info={}}});return a.type={none:"none",touchStart:"touchStart",touchMove:"touchMove",tap:"tap",doubleTap:"doubleTap",longPress:"longPress",swipe:"swipe",swipeLeft:"swipeLeft",swipeRight:"swipeRight",swipeUp:"swipeUp",swipeDown:"swipeDown",move:"move",moveLeft:"moveLeft",moveRight:"moveRight",moveUp:"moveUp",moveDown:"moveDown",touchEnd:"touchEnd"},a}),define("lib/loader",["lib/class"],function(e){var t=e.extend({loaded:0,sum:0,addResources:function(e){return this._resources=e,this},load:function(){var e=this;for(var t in this._resources)e.sum++,resource=e._resources[t],resource.load(function(t){t?e.trigger("progressError",resource,t):(e.loaded++,e.trigger("progressUpdate",e.loaded/e.sum),e.loaded===e.sum&&e.trigger("progressComplete"))})}});return t}),define("lib/scene",["lib/class"],function(e){var t=e.extend({bgSound:null,resources:{},_entities:[],_namedEntities:{},setStageSize:function(e,t){return this._stageWidth=e,this._stageHeight=t,this},getStageSize:function(){return{width:this._stageWidth,height:this._stageHeight}},getResources:function(){return this.resources},update:function(e){var t=this;this._entities.forEach(function(t){!t.killed&&t.update&&t.update(e)}),this._entities.forEach(function(e){e.killed&&t.removeGameObject(e)})},draw:function(e){this._entities.forEach(function(t){t.draw&&(t.alpha!=1&&(e.globalAlpha=t.alpha),e.save(),t.angle&&e.rotate(t.angle),(t.scale.x!=1||t.scale.y!=1)&&e.scale(t.scale.x,t.scale.y),t.draw(e),e.restore(),t.alpha!=1&&(e.globalAlpha=1))}),this.bgSound&&this.bgSound.play()},release:function(){this.bgSound&&this.bgSound.stop(),this._entities.forEach(function(e){e.kill()})},sort:function(){this._entities.sort(function(e,t){return e.z-t.z})},addGameObject:function(e){return e.scene=this,this._entities.push(e),e.name&&e.name!="unknown"&&(this._namedEntities[e.name]=e),this.sort(),e},removeGameObject:function(e){e.name&&e.name!="unknown"&&delete this._namedEntities[e.name],this._entities.remove(e),e=null},getEntities:function(){return this._entities}});return t}),define("lib/shape/shape",["lib/class"],function(e){var t=e.extend({type:"Shape",pivot:null,relativeTo:function(){throw"Must be override by the subclass or does not have this method "},distanceTo:function(e){var t=this.pivot.x-e.pivot.x,n=this.pivot.y-e.pivot.y;return Math.sqrt(t*t+n*n)},intersectsWith:function(){throw"Must be override by the subclass or does not have this method "},contains:function(){throw"Must be override by the subclass or does not have this method "},draw:function(){throw"Must be override by the subclass or does not have this method "}});return t.Angle=function(e,t,n){var r=e.sub(t),i=n.sub(t);return Math.acos(r.dot(i)/(r.length()*i.length()))},t}),define("lib/shape/vector2",["lib/shape/shape"],function(e){var t=e.extend({x:0,y:0,pivot:{x:0,y:0},type:"Vector2",init:function(e,t){this.x=e||0,this.y=t||0,this.pivot.x=this.x,this.pivot.y=this.y},set:function(){return arguments[0]instanceof t?(this.x=arguments[0].x,this.y=arguments[0].y):arguments.length==2&&(this.x=arguments[0],this.y=arguments[1]),this},relativeTo:function(e){return this.add(e)},add:function(){return arguments[0]instanceof t?new t(this.x+arguments[0].x,this.y+arguments[0].y):arguments.length==2?new t(this.x+arguments[0],this.y+arguments[1]):this},addSelf:function(){return arguments[0]instanceof t?(this.x+=arguments[0].x,this.y+=arguments[0].y):arguments.length==2&&(this.x+=arguments[0],this.y+=arguments[1]),this},sub:function(){return arguments[0]instanceof t?new t(this.x-arguments[0].x,this.y-arguments[0].y):arguments.length==2?new t(this.x-arguments[0],this.y-arguments[1]):this},subSelf:function(){return arguments[0]instanceof t?(this.x-=arguments[0].x,this.y-=arguments[0].y):arguments.length==2&&(this.x-=arguments[0],this.y-=arguments[1]),this},multiply:function(e){return new t(this.x*e,this.y*e)},multiplySelf:function(e){return this.x*=e,this.y*=e,this},divide:function(e){return e?new t(this.x/e,this.y/e):new t(0,0)},divideSelf:function(e){return e?(this.x/=e,this.y/=e):this.set(0,0),this},dot:function(e){return this.x*e.x+this.y*e.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSq())},normalize:function(){return this.divideSelf(this.length())},setLength:function(e){return this.normalize().multiplySelf(e)},equals:function(e){return e.x===this.x&&e.y===this.y},distanceToSquared:function(e){var t=this.x-e.x,n=this.y-e.y;return t*t+n*n},distanceTo:function(e){return Math.sqrt(this.distanceToSquared(e))},intersectsWith:function(e){switch(e.type){case"Vector2":return this.equals(e);default:return e.intersectsWith(this)}},contains:function(e){switch(e.type){case"Vector2":return this.equals(e);default:return!1}}});return t}),define("lib/shape/rectangle",["lib/shape/shape"],function(e){var t=e.extend({left:0,top:0,right:0,bottom:0,width:0,height:0,type:"Rectangle",init:function(e,t,n,r){this.left=e||0,this.top=t||0,this.width=n||0,this.height=r||0,this.right=e+n,this.bottom=t+r,this.pivot={x:e+n/2,y:t+r/2}},resize:function(){this.width=this.right-this.left,this.height=this.bottom-this.top,this.pivot.set(this.left+this.width/2,this.top+this.height/2)},set:function(e,t,n,r){this.left=e,this.top=t,this.right=n,this.bottom=r,this.resize()},inflate:function(e){this.left-=e,this.top-=e,this.right+=e,this.bottom+=e,this.resize()},relativeTo:function(e){return new t(this.left+e.x,this.top+e.y,this.width,this.height)},intersectsWith:function(e){switch(e.type){case"Vector2":return e.x>=this.left&&e.x<=this.right&&e.y>=this.top&&e.y<=this.bottom;case"Rectangle":return e.right>=this.left&&e.left<=this.right&&e.top<=this.bottom&&e.bottom>=this.top;case"Polygon":return e.intersectsWith(this);case"Circle":case"Line":}},contains:function(e){switch(e.type){case"Vector2":return e.x>=this.left&&e.x<=this.right&&e.y>=this.top&&e.y<=this.bottom;case"Rectangle":return this.left<=e.left&&this.right>=e.right&&this.top<=e.top&&this.bottom>=e.bottom;case"Polygon":return e.vertexs.forEach(function(e){if(!this.contains(e))return!1}),!0;case"Circle":case"Line":}},draw:function(e){e.fillStyle="#00ff00",e.fillRect(this.left,this.top,this.width,this.height)}});return t}),define("lib/drawableobject",["lib/utils","lib/class","lib/shape/vector2","lib/shape/rectangle"],function(e,t,n,r){var i=t.extend({visiable:!0,position:new n(0,0),z:0,killed:!1,alpha:1,angle:0,scale:new n(1,1),shape:null,texture:null,init:function(t,n,i,s){this.position.set(t,n),this.z=i;if(s&&e.isObject(s))for(var o in s)this[o]=s[o];!this.shape&&this.texture&&this.setShape(new r(0,0,this.texture.tileWidth,this.texture.tileHeight))},setTexture:function(e){return this.texture=e,!this.shape&&this.texture&&this.setShape(new r(0,0,this.texture.tileWidth,this.texture.tileHeight)),this},setShape:function(e){return this.shape=e,this},kill:function(){return this.killed=!0,this}});return i}),define("lib/clock",["lib/class"],function(e){var t=e.extend({_startTime:0,_oldTime:0,_elapsedTime:0,_running:!1,init:function(e){e&&this.start()},start:function(){this._startTime=Date.now(),this._oldTime=this._startTime,this._running=!0},restart:function(){this._elapsedTime=0,this.start()},stop:function(){this._running=!1},step:function(){var e=0,t=Date.now();return this._running&&(e=t-this._oldTime,this._oldTime=t,this._elapsedTime+=e),e},getElapsedTime:function(){return this._elapsedTime}});return t}),define("lib/animation",["lib/clock","lib/class"],function(e,t){var n=t.extend({texture:null,frames:[0],delay:1e3/60,isLoop:!0,loopCount:0,curFrame:0,timer:null,tile:0,playing:!1,ended:!1,callback:null,init:function(t,n,r){this.texture=t,this.frames=n||[0],this.delay=r||1e3/60,this.timer=new e(!1),this.curFrame=0,this.tile=this.frames[0]},play:function(e,t){e?this.loopCount=e:this.loopCount=0,this.loopCount?this.isLoop=!1:this.isLoop=!0,this.playing=!0,this.ended=!1,t&&(this.callback=t),this.timer.start()},stop:function(){this.playing=!1,this.timer.stop()},resume:function(){this.playing=!0,this.timer.start()},gotoFrame:function(e){this.timer.elapsedTime+=(e-this.curFrame)*this.delay,this.update()},next:function(){this.curFrame++,this.tile=this.frames[this.curFrame],this.timer.elapsedTime+=this.delay},rewind:function(e,t){this.timer.restart(),this.curFrame=0,this.tile=this.frames[0],e?this.loopCount=e:this.loopCount=0,this.loopCount?this.isLoop=!1:this.isLoop=!0,this.playing=!0,this.ended=!1,t&&(this.callback=t)},update:function(){if(this.playing&&!this.ended){this.timer.step();var e=Math.floor(this.timer.getElapsedTime()/this.delay),t=Math.floor(e/this.frames.length);this.isLoop||t<this.loopCount?this.curFrame=e%this.frames.length:(this.curFrame=this.frames.length-1,this.playing=!1,this.ended=!0,this.callback&&this.callback()),this.tile=this.frames[this.curFrame]}},draw:function(e,t,n){this.texture.drawTile(e,t,n,this.tile)}});return n}),define("lib/sprite",["lib/drawableobject","lib/animation","lib/shape/vector2"],function(e,t,n){var r=e.extend({type:"unknown",name:"unknown",health:100,speed:new n(0,0),acceleration:new n(0,0),animations:{},currentAnimation:null,addAnimation:function(e,n,r){if(!this.texture)throw new Error("你还没有为此精灵定义纹理呢！");var i=new t(this.texture,n,r);return this.animations[e]=i,this},setCurrentAnim:function(e,t,n){if(!this.animations[e])throw new Error("不存在名字为"+e+"的动画");this.currentAnimation?(this.currentAnimation=this.animations[e],this.currentAnimation.rewind(t,n)):(this.currentAnimation=this.animations[e],this.currentAnimation.play(t,n))},hurt:function(e){this.health-=e,this.health=Math.max(this.health,0)},update:function(e){this.speed.addSelf(this.acceleration.multiply(1/e)),this.position.addSelf(this.speed.multiply(1/e)),this.currentAnimation&&this.currentAnimation.update()},draw:function(e){this.visiable&&(this.currentAnimation?this.currentAnimation.draw(e,this.position.x,this.position.y):this.texture.drawTile(e,this.position.x,this.position.y,0))},collideWith:function(e){return this.shape.relativeTo(this.position).intersectsWith(e.shape.relativeTo(e.position))}});return r}),define("lib/ui/background",["lib/sprite","lib/shape/vector2"],function(e,t){var n=e.extend({init:function(e,r,i,s,o){this.super(e,r,i),this.setTexture(s),this.speed=o&&o.speed||new t(0,0),this.repeat=!!o&&!!o.repeat,this.distance=o&&o.distance||1,this.stageWidth=o&&o.stageWidth||this.texture.tileWidth,this.stageHeight=o&&o.stageHeight||this.texture.tileHeight,this.distance!=1&&this.speed.divideSelf(this.distance),this.repeat&&(this.speed.x>0&&(this.temp=new n(-this.texture.width,0,this.z,this.texture,{speed:this.speed,stageWidth:this.stageWidth,stageHeight:this.stageHeight})),this.speed.x<0&&(this.temp=new n(this.texture.width,0,this.z,this.texture,{speed:this.speed,stageWidth:this.stageWidth,stageHeight:this.stageHeight})),this.speed.y>0&&(this.temp=new n(0,-this.texture.height,this.z,this.texture,{speed:this.speed,stageWidth:this.stageWidth,stageHeight:this.stageHeight})),this.speed.y<0&&(this.temp=new n(0,this.texture.height,this.z,this.texture,{speed:this.speed,stageWidth:this.stageWidth,stageHeight:this.stageHeight})))},update:function(e){this.super(e),this.repeat&&(this.temp.update(e),this.speed.x>0&&this.position.x>this.stageWidth&&(this.position.x=this.temp.position.x-this.texture.width),this.speed.x<0&&this.position.x<-this.texture.width&&(this.position.x=this.temp.position.x+this.temp.texture.width),this.speed.y>0&&this.position.y>this.stageHeight&&(this.position.y=this.temp.position.y-this.texture.height),this.speed.y<0&&this.position.y<-this.texture.height&&(this.position.y=this.temp.position.y+this.temp.texture.height),this.temp.speed.x>0&&this.temp.position.x>this.stageWidth&&(this.temp.position.x=this.position.x-this.temp.texture.width),this.temp.speed.x<0&&this.temp.position.x<-this.temp.texture.width&&(this.temp.position.x=this.position.x+this.texture.width),this.temp.speed.y>0&&this.temp.position.y>this.stageHeight&&(this.temp.position.y=this.position.y-this.temp.texture.height),this.temp.speed.y<0&&this.temp.position.y<-this.temp.texture.height&&(this.temp.position.y=this.position.y+this.texture.height))},draw:function(e){this.texture.drawTile(e,this.position.x,this.position.y),this.repeat&&this.temp.draw(e)}});return n}),define("lib/ui/button",["lib/sprite"],function(e){var t=e.extend({init:function(e,t,n,r){this.super(e,t,n),this.setTexture(r),this.addAnimation("mouseout",[0],100),this.addAnimation("mousein",[1],100),this.setCurrentAnim("mouseout")}});return t}),define("app/scene/menu",["lib/scene","lib/texture","lib/ui/background","lib/ui/button"],function(e,t,n,r){var i=e.extend({init:function(){var e=this;this.menuBg=this.addGameObject(new n(0,0,0,i.resources.menuBg)),this.enterButton=this.addGameObject(new r(252,153,1,i.resources.enterButton)),this.on("touchMove",function(t){t.target===e.enterButton?e.enterButton.setCurrentAnim("mousein"):e.enterButton.setCurrentAnim("mouseout")}),this.on("tap",function(t){t.target===this.enterButton&&e.trigger("switchScene","Scene_1")})}});return i.getResources=function(){return this.resources={menuBg:new t("menuBg.png"),enterButton:new t("enterButton.png",1,2)},this.resources},i}),define("lib/ui/label",["lib/drawableobject"],function(e){var t=e.extend({icon:null,init:function(e,t,n,r){this.super(e,t,n),this.icon=r},draw:function(e){this.icon.drawTile(e,this.position.x,this.position.y)}});return t}),define("lib/ui/number",["lib/utils","lib/drawableobject"],function(e,t){var n=t.extend({value:"",content:null,align:0,valign:0,offsetX:0,offsetY:0,init:function(t,r,i,s){this._opts=s,this.super(t,r,i,s);var o=this.value,u=[];for(var a=0,f=o.length;a<f;a++)o[a]=="*"?u[a]=10:u[a]=window.parseInt(o[a]);this.content=e.$new("canvas"),this.content.width=o.length*this.texture.tileWidth,this.content.height=this.texture.tileHeight;var l=this.content.getContext("2d");for(a=0,f=o.length;a<f;a++)this.texture.drawTile(l,a*this.texture.tileWidth,0,u[a]);this.align==n.ALIGN.CENTER&&(this.offsetX=this.content.width/2),this.align==n.ALIGN.RIGHT&&(this.offsetX=this.content.width),this.valign==n.VALIGN.MIDDLE&&(this.offsetY=this.content.height/2),this.valign==n.VALIGN.BOTTOM&&(this.offsetY=this.content.height)},setNum:function(e){this._opts.value=e,this.init(this.position.x,this.position.y,this.z,this._opts)},draw:function(e){this.visiable&&e.drawImage(this.content,this.position.x-this.offsetX,this.position.y-this.offsetY)}});return n.ALIGN={LEFT:0,CENTER:1,RIGHT:2},n.VALIGN={TOP:0,MIDDLE:1,BOTTOM:2},n}),define("app/sprite/tool",["lib/sprite"],function(e){var t=e.extend({count:0,cd:0,type:0});return t.TYPE={None:0,Stone:1,Bone:2,Stick:3},t}),define("app/sprite/carrot",["lib/sprite"],function(e){var t=e.extend({isBeated:!1,bear:10,init:function(e,t,n,r){this.super(e,t,n,r),this.addAnimation("run",[0,1,2],100),this.addAnimation("warm",[3,4,5,4],100),this.setCurrentAnim("run")},update:function(e){this.super(e),this.isBeated&&this.currentAnimation!=this.animations.warm&&this.setCurrentAnim("warm"),!this.isBeated&&this.currentAnimation!=this.animations.run&&this.setCurrentAnim("run")}});return t}),define("app/sprite/dog",["lib/sprite"],function(e){var t=e.extend({beat:0,score:0,bear:10,init:function(e,t,n,r){this.super(e,t,n,r),this.addAnimation("run",[0,1,2,3],100),this.addAnimation("stop",[4,5],100),this.addAnimation("sleep",[6,7],100),this.addAnimation("back",[8,9,10,11],100),this.setCurrentAnim("run")},update:function(e){this.super(e),this.currentAnimation==this.animations.run&&this.collideWith(this.scene.carrot)&&(this.beat||(this.beat=window.setInterval(this.beatTheCarrot.bind(this),1e3)),this.speed.x=0),(this.currentAnimation==this.animations.sleep||this.currentAnimation==this.animations.back)&&this.position.x>this.scene.getStageSize().width&&(this.kill(),this.scene.dogs.remove(this))},beatTheCarrot:function(){this.scene.carrot&&this.scene.carrot.health>0?this.scene.carrot.hurt(100/this.scene.carrot.bear):(clearInterval(this.beat),this.beat=0)}});return t}),define("app/sprite/dog1",["app/sprite/dog","lib/shape/vector2"],function(e,t){var n=e.extend({speed:new t(-120,0),score:20,bear:2});return n}),define("app/sprite/dog2",["app/sprite/dog","lib/shape/vector2"],function(e,t){var n=e.extend({speed:new t(-120,0),score:35,bear:3});return n}),define("app/sprite/dog3",["app/sprite/dog","lib/shape/vector2"],function(e,t){var n=e.extend({speed:new t(-120,0),score:50,bear:4});return n}),define("app/sprite/stone",["lib/sprite"],function(e){var t=e.extend({targetX:0,targetY:0,init:function(e,t,n,r){this.super(e,t,n),this.setTexture(r),this.addAnimation("throw",[0,1,2,3],100),this.setCurrentAnim("throw")},setTarget:function(e,t){this.targetX=e,this.targetY=t;var n=1,r=this.position.x+this.shape.pivot.x,i=this.position.y+this.shape.pivot.y;this.speed.x=(this.targetX-r)/n,this.speed.y=-1.5*this.speed.x,this.acceleration.y=2*(this.targetY-i-this.speed.y*n)/(n*n)},update:function(e){var t=this;this.super(e),this.scene.dogs.forEach(function(e){t.collideWith(e)&&t.z===e.z&&e.currentAnimation==e.animations.run&&(t.kill(),e.setCurrentAnim("stop",2,function(){e.setCurrentAnim("run"),e.speed.x=-120}),e.hurt(100/e.bear),e.health<=0&&(e.setCurrentAnim("sleep"),t.scene.sumScore+=e.score,t.scene.score.setNum(t.scene.sumScore.toString()),e.beat&&(clearInterval(e.beat),e.beat=0)),e.speed.set(120,0))}),this.position.y>600&&this.kill()}});return t}),define("app/sprite/bone",["lib/sprite"],function(e){var t=e.extend({targetX:0,targetY:0,init:function(e,t,n,r){this.super(e,t,n),this.setTexture(r),this.addAnimation("throw",[0,1,2,3],100),this.setCurrentAnim("throw")},setTarget:function(e,t){this.targetX=e,this.targetY=t;var n=1,r=this.position.x+this.shape.pivot.x,i=this.position.y+this.shape.pivot.y;this.speed.x=(this.targetX-r)/n,this.speed.y=-1.5*this.speed.x,this.acceleration.y=2*(this.targetY-i-this.speed.y*n)/(n*n)},update:function(e){var t=this;this.super(e),this.scene.dogs.forEach(function(e){t.collideWith(e)&&t.z===e.z&&e.currentAnimation==e.animations.run&&(t.kill(),e.setCurrentAnim("back"),e.beat&&(clearInterval(e.beat),e.beat=0),e.speed.set(240,0))}),this.position.y>600&&this.kill()}});return t}),define("app/sprite/stick",["lib/sprite"],function(e){var t=e.extend({init:function(e,t,n,r){this.super(e,t,n),this.setTexture(r),this.addAnimation("throw",[0,1,2,1,0],100),this.setCurrentAnim("throw",1)},update:function(e){this.super(e),this.currentAnimation.ended&&this.kill()}});return t}),define("app/scene/scene_1",["lib/scene","lib/shape/vector2","lib/texture","lib/ui/background","lib/ui/label","lib/ui/button","lib/ui/number","app/sprite/tool","app/sprite/carrot","app/sprite/dog","app/sprite/dog1","app/sprite/dog2","app/sprite/dog3","app/sprite/stone","app/sprite/bone","app/sprite/stick"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v){var m=e.extend({init:function(){var e=this;this.running=!0,this.bg1=this.addGameObject(new r(0,0,0,m.resources.bg1,{speed:new t(120,0),repeat:!0,distance:2,stageWidth:this.getStageSize().width,stageHeight:this.getStageSize().height})),this.bg2=this.addGameObject(new r(0,0,1,m.resources.bg2,{speed:new t(120,0),repeat:!0,distance:1,stageWidth:this.getStageSize().width,stageHeight:this.getStageSize().height})),this.headBg=this.addGameObject(new i(20,20,3,m.resources.headBg)),this.head=this.addGameObject(new i(22,10,4,m.resources.head)),this.toolBg=[];for(var n=0;n<5;n++)this.toolBg[n]=this.addGameObject(new i(120+70*n,20,3,m.resources.toolBg));this.stoneTool=this.addGameObject(new u(120,30,4,{type:u.TYPE.Stone,texture:m.resources.stone,count:100,cd:1e3})),this.stoneNum=this.addGameObject(new o(190,100,5,{value:"*"+this.stoneTool.count.toString(),texture:m.resources.smallNum,align:o.ALIGN.RIGHT,valign:o.VALIGN.BOTTOM})),this.stickTool=this.addGameObject(new u(190,30,4,{type:u.TYPE.Stick,texture:m.resources.stick,count:30,cd:1e3})),this.stickNum=this.addGameObject(new o(260,100,5,{value:"*"+this.stickTool.count.toString(),texture:m.resources.smallNum,align:o.ALIGN.RIGHT,valign:o.VALIGN.BOTTOM})),this.boneTool=this.addGameObject(new u(260,30,4,{type:u.TYPE.Bone,texture:m.resources.bone,count:30,cd:1e3})),this.boneNum=this.addGameObject(new o(330,100,5,{value:"*"+this.boneTool.count.toString(),texture:m.resources.smallNum,align:o.ALIGN.RIGHT,valign:o.VALIGN.BOTTOM})),this.bloodBg=this.addGameObject(new i(500,30,3,m.resources.bloodBg)),this.blood=this.addGameObject(new i(510,45,4,m.resources.blood)),this.menuButton=this.addGameObject(new s(0,620,3,m.resources.menuButton)),this.stopButton=this.addGameObject(new s(100,620,3,m.resources.stopButton)),this.carrot=this.addGameObject(new a(-50,400,3,{texture:m.resources.carrot})),this.dogs=[],this.currentTool=u.TYPE.Stone,this.currentLength=0,this.targetLength=8e3,this.sumScore=0,this.scoreBg=this.addGameObject(new i(900,610,3,m.resources.scoreBg)),this.score=this.addGameObject(new o(1050,620,4,{value:this.sumScore.toString(),texture:m.resources.bigNum})),this.success=null,this.fail=null,this.on("tap",function(e){switch(e.target){case this.stopButton:this.running?(this.trigger("stopScene"),this.running=!1):(this.trigger("startScene"),this.running=!0);break;case this.menuButton:this.trigger("switchScene","Menu");break;case this.success||this.fail:this.trigger("switchScene","Menu");break;case this.stoneTool:this.currentTool=u.TYPE.Stone;break;case this.stickTool:this.currentTool=u.TYPE.Stick;break;case this.boneTool:this.currentTool=u.TYPE.Bone;break;default:var t=e.target;if(t instanceof f&&t.currentAnimation==t.animations.run)switch(this.currentTool){case u.TYPE.Stone:this.throwStone(e.x,e.y,t.z);break;case u.TYPE.Stick:this.throwStick(t);break;case u.TYPE.Bone:this.throwBone(e.x,e.y,t.z);break;default:}}}),this.on("fail",function(){e.fail=e.addGameObject(new r(128,0,6,m.resources.fail))})},update:function(e){var t=this;if(this.success||this.fail){this.trigger("stopScene");return}this.carrot.isBeated=!1,this.blood.icon.tileWidth=240*this.carrot.health/100,this.carrot.health<=0&&this.trigger("fail"),this.dogs.forEach(function(e){e.beat&&(t.carrot.isBeated=!0)}),this.currentLength+=this.bg2.speed.x/e;if(this.currentLength>=this.targetLength){this.success=this.addGameObject(new r(128,0,6,m.resources.success));return}var n=Math.random(),i;n<.3/e&&(n<.1/e?i=this.addGameObject(new l(this.getStageSize().width,500,this.dogs.length+5,{texture:m.resources.dog1})):n<.2/e?i=this.addGameObject(new c(this.getStageSize().width,500,this.dogs.length+5,{texture:m.resources.dog2})):i=this.addGameObject(new h(this.getStageSize().width,450,this.dogs.length+5,{texture:m.resources.dog3})),this.dogs.push(i)),this.super(e)},throwStone:function(e,t,n){if(this.stoneTool.count){var r=new p(this.carrot.position.x+this.carrot.texture.tileWidth,this.carrot.position.y,n,m.resources.stoneSprite);r.setTarget(e,t),this.addGameObject(r),this.stoneTool.count--,this.stoneNum.setNum("*"+this.stoneTool.count.toString())}},throwStick:function(e){if(this.stickTool.count){var t=new v(this.carrot.position.x+this.carrot.texture.tileWidth,this.carrot.position.y,e.z,m.resources.stickSprite,e);e.setCurrentAnim("stop",2,function(){e.setCurrentAnim("run"),e.speed.x=-120}),e.hurt(100/e.bear),e.health<=0?(e.setCurrentAnim("sleep"),this.sumScore+=e.score,this.score.setNum(this.sumScore.toString()),e.speed.x=120):e.position.x+=150,e.beat&&(clearInterval(e.beat),e.beat=0),this.addGameObject(t),this.stickTool.count--,this.stickNum.setNum("*"+this.stickTool.count.toString())}},throwBone:function(e,t,n){if(this.boneTool.count){var r=new d(this.carrot.position.x+this.carrot.texture.tileWidth,this.carrot.position.y,n,m.resources.boneSprite);r.setTarget(e,t),this.addGameObject(r),this.boneTool.count--,this.boneNum.setNum("*"+this.boneTool.count.toString())}}});return m.getResources=function(){return this.resources={bg1:new n("map01.png"),bg2:new n("map02.png"),headBg:new n("headBg.png"),head:new n("head.png"),toolBg:new n("toolBg.png"),stone:new n("stone-tool.png"),smallNum:new n("numberSmall.png",1,11),stick:new n("stick-tool.png"),bone:new n("bone-tool.png"),bloodBg:new n("bloodBg.png"),blood:new n("blood.png"),menuButton:new n("menuButton.png"),stopButton:new n("stopButton.png"),scoreBg:new n("scoreBg.png"),bigNum:new n("numberBig.png",1,11),carrot:new n("carrot.png",1,6),success:new n("success.png"),fail:new n("fail.png"),dog1:new n("dog1.png",1,12),dog2:new n("dog2.png",1,12),dog3:new n("dog3.png",1,12),stoneSprite:new n("stone.png",1,4),stickSprite:new n("stick.png",1,3),boneSprite:new n("bone.png",1,4)},this.resources},m}),define("app/scene/index",["app/scene/menu","app/scene/scene_1"],function(e,t){return{Menu:e,Scene_1:t}}),define("lib/yi",["lib/class","lib/utils","lib/texture","lib/event","lib/loader","app/scene/index","lib/shape/vector2"],function(e,t,n,r,i,s,o){window.requestAnimationFrame||(window.requestAnimationFrame=function(){return window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){window.setTimeout(e,t)}}());var u={clearColor:"#ffffff",fps:60,autoRun:!0,stageScaleMode:"contain",autoOrientation:!0},a=e.extend({_running:!1,init:function(e){this._opts=t.clone(u);if(t.isObject(e))for(var n in e)this._opts[n]=e[n];return this},config:function(e){if(t.isObject(e))for(var n in e)this._opts[n]=e[n];return this},setCanvas:function(e){return e&&e instanceof HTMLElement&&(this._canvas=e),this},getCanvas:function(){return this._canvas},getContext:function(){return this._context},setStageSize:function(e,t){return e&&t&&(this._stageWidth=e,this._stageHeight=t),this},getStageSize:function(){return{width:this._stageWidth,height:this._stageHeight}},getWindowSize:function(){return{width:window.innerWidth,height:window.innerHeight}},_setCanvasSize:function(){var e=this.getCanvas(),n=this.getWindowSize(),r=n.width/n.height,i=this._stageWidth/this._stageHeight;switch(this._opts.stageScaleMode){case"contain":t.device==="mobile"&&this._opts.autoOrientation&&i>1&&n.width<n.height?(e.style.transform=e.style.webkitTransform="rotate(90deg)",this.canvasRotate=!0,r<1/i?(e.style.height=n.width+"px",e.style.width=n.width*i+"px",this.canvasScale={w:e.height/n.width,h:e.height/n.width}):(e.style.width=n.height+"px",e.style.height=n.height/i+"px",this.canvasScale={w:e.width/n.height,h:e.width/n.height})):(e.style.transform=e.style.webkitTransform="rotate(0deg)",this.canvasRotate=!1,r>i?(e.style.height=n.height+"px",e.style.width=n.height*i+"px",this.canvasScale={w:e.height/n.height,h:e.height/n.height}):(e.style.width=n.width+"px",e.style.height=n.width/i+"px",this.canvasScale={w:e.width/n.width,h:e.width/n.width}));break;case"cover":t.device==="mobile"&&this._opts.autoOrientation&&i>1?(e.style.transform=e.style.webkitTransform="rotate(90deg)",this.canvasRotate=!0,r<1/i?(e.style.width=n.height+"px",e.style.height=n.height/i+"px",this.canvasScale={w:e.width/n.height,h:e.width/n.height}):(e.style.height=n.width+"px",e.style.width=n.width*i+"px",this.canvasScale={w:e.height/n.width,h:e.height/n.width})):(e.style.transform=e.style.webkitTransform="rotate(0deg)",this.canvasRotate=!1,r>i?(e.style.width=n.width+"px",e.style.height=n.width/i+"px",this.canvasScale={w:e.width/n.width,h:e.width/n.width}):(e.style.height=n.height+"px",e.style.width=n.height*i+"px",this.canvasScale={w:e.height/n.height,h:e.height/n.height}));break;case"fill":t.device==="mobile"&&this._opts.autoOrientation&&i>1?(e.style.transform=e.style.webkitTransform="rotate(90deg)",this.canvasRotate=!0,e.style.width=n.height+"px",e.style.height=n.width+"px",this.canvasScale={w:e.width/n.height,h:e.height/n.width}):(e.style.transform=e.style.webkitTransform="rotate(0deg)",this.canvasRotate=!1,e.style.width=n.width+"px",e.style.height=n.height+"px",this.canvasScale={w:e.width/n.width,h:e.height/n.height});break;case"noscale":this.canvasScale={w:1,h:1};break;default:}},_setCanvasPosition:function(){var e=this.getCanvas();t.$("body")[0].style.margin=0,e.style.position="fixed",e.style.left="50%",e.style.top="50%",e.style.marginTop=-window.parseInt(e.style.height)/2+"px",e.style.marginLeft=-window.parseInt(e.style.width)/2+"px"},setTexturePath:function(e){return n.IMGPATH=e,this},launch:function(e){var n=this;if(!n.getCanvas())throw new Error("请设置游戏画板");if(!n._stageWidth||!n._stageHeight)throw new Error("请设置游戏画板大小");var i=n.getCanvas();i.width=n._stageWidth,i.height=n._stageHeight,n._context=i.getContext("2d"),n._setCanvasSize(),n._setCanvasPosition(),e&&n.load(e);var s=new r(n.getCanvas());for(var u in r.type)n.listenTo(s,u,function(e){var r=e.x,s=e.y,u=new o;if(!n.canvasRotate)t.device==="mobile"?(e.x=(r-i.offsetLeft)*n.canvasScale.w,e.y=(s-i.offsetTop)*n.canvasScale.h):(e.x=r*n.canvasScale.w,e.y=s*n.canvasScale.h),u.set(e.x,e.y);else{var a=window.parseInt(i.style.width),f=window.parseInt(i.style.height);e.x=(s-(i.offsetTop*2+f-a)/2)*n.canvasScale.w,e.y=(i.offsetLeft-r+(a+f)/2)*n.canvasScale.h,u.set(e.x,e.y)}if(n._currentScene){var l=n._currentScene.getEntities();for(var c=l.length;c;c--){var h=l[c-1];if(h.visiable&&h.shape&&h.shape.relativeTo(h.position).contains(u)){e.target=h;break}}n._currentScene.trigger(e.type,e)}});return window.onresize=function(){n._setCanvasSize(),n._setCanvasPosition()},window.addEventListener("orientationchange",function(e){n._setCanvasSize(),n._setCanvasPosition()},!1),n},loadingStep:function(e){},setLoadingStep:function(e){return t.isFunction(e)&&(this.loadingStep=e),this},_loadScene:function(e){var t=this;t._currentScene=e,t._currentScene.setStageSize(t.getStageSize().width,t.getStageSize().height),t._currentScene.on("switchScene",function(e){var n=s[e];n&&t.load(n)}),t._currentScene.on("stopScene",function(){t.stop()}),t._currentScene.on("startScene",function(){t.start()}),t._opts.autoRun&&t.start()},load:function(e){var t=this;t._currentScene&&(t._currentScene.release(),t._currentScene=null),this.loadingStep(0);var n=e.getResources();if(Object.keys(n).length){var r=new i;r.addResources(n),r.on("progressUpdate",function(e){t.loadingStep(e)}),r.on("progressComplete",function(){t._loadScene(new e)}),r.load()}else t._loadScene(new e);return this},run:function(){window.scrollTo(0,0);if(this._running&&this._currentScene){var e=Date.now();this._currentScene.update(this._opts.fps),this._context.fillStyle=this.clearColor,this._context.clearRect(0,0,this._stageWidth,this._stageHeight),this._currentScene.draw(this._context);var t=Date.now(),n=t-e;window.requestAnimationFrame(this.run.bind(this),1e3/this._opts.fps-n),this.frameCount++}else this._running=!1;return this},start:function(){return this._running||(this._running=!0,this._currentScene.getEntities().forEach(function(e){e.currentAnimation&&e.currentAnimation.resume()}),window.requestAnimationFrame(this.run.bind(this),1e3/this._opts.fps)),this},stop:function(){return this._running=!1,this._currentScene.getEntities().forEach(function(e){e.currentAnimation&&e.currentAnimation.stop()}),this}});return a}),define("app/init",["lib/yi","lib/utils","app/scene/menu"],function(e,t,n){var r=new e;r.setCanvas(t.$("#canvas")),r.setStageSize(1280,720),r.setTexturePath("./assets/img/");var i=new Image;return i.onload=function(){var e=new Image;e.onload=function(){r.setLoadingStep(function(t){console.log(t);var n=r.getContext();n.clearRect(0,0,this.getStageSize().width,this.getStageSize().height),n.drawImage(i,0,0),n.drawImage(e,0,0,e.width*t,e.height,490,562,e.width*t,e.height)}),r.launch(n)},e.src="./assets/img/schedule.png"},i.src="./assets/img/loadingBg.png",r});