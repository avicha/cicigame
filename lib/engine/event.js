/**
 * @author lbc
 */
YI.package('engine').module('event').import('engine.shape.vector2', 'engine.scene').define(function () {
    //根据不同设备绑定不同事件，主要分别手机设备和PC设备
    Event = {};
    //起始坐标
    Event.startMouse = null;
    //结束坐标
    Event.endMouse = null;
    //上一次触摸屏幕或者鼠标按下
    Event.lastTouchStart = 0;
//上一次离开屏幕或者鼠标按起
    Event.lastTouchEnd = 0;
    Event.mouseNum = 0;
    //事件类型
    Event.type = {

        none:0,

        touchStart:1,

        touchMove:2,

        tap:3,
        //双击事件可能检测不到或者错误，所以尽量避免双击事件
        doubleTap:4,
        //长按很少用到，暂时不作处理。
        longPress:5,
        //滑动事件可以调整参数，例如滑动范围
        leftSwipe:6,

        rightSwipe:7,

        upSwipe:8,

        downSwipe:9,

        touchEnd:10

    }

    Event.initEvent = function () {
        //当前事件类型
        Event.currentEvent = Event.type.none;
//当前鼠标位置
        Event.Mouses = [];
        //是否按下了鼠标
        Event.isMouseDown = false;
//当前按下按键
        Event.Key = 0;
//当前选择画面上的东西

        Event.chooseObject = null;
        if (YI.ua == 'windows nt') {
            //鼠标按下事件
            $('#canvas').addEventListener('mousedown', onMouseDown, false);
//鼠标移动事件
            $('#canvas').addEventListener('mousemove', onMouseMove, false);
            //鼠标松开事件
            $('#canvas').addEventListener('mouseup', onMouseUp, false);
            //取消右键默认事件
            $("#canvas").addEventListener('contextmenu', function () {
                self.event.returnValue = false;
            }, false);
            //单击事件
            $('#canvas').onclick = onClick;
            //双击事件
            $('#canvas').ondblclick = onDoubleClick;
        } else {
            $('#canvas').addEventListener('touchstart', onTouchStart, false);
            $('#canvas').addEventListener('touchmove', onTouchMove, false);
            $('#canvas').addEventListener('touchend', onTouchEnd, false);
            window.addEventListener('orientationchange', onOrientationChange, false);
        }
        //调整窗口大小
        window.addEventListener('resize', onResize, false);
        onResize();
    }

    function onMouseDown(event) {
        Event.isMouseDown = true;
        Event.currentEvent = Event.type.touchStart;
        Event.Mouses.push(new Vector2(event.offsetX / YI.scale, event.offsetY / YI.scale));
        Event.mouseNum++;
        Event.startMouse = {x:event.offsetX, y:event.offsetY};
        setTimeout(function () {
            if (Event.currentEvent == Event.type.touchStart && Date.now() - Event.lastTouchStart > 900) {
                Event.currentEvent = Event.type.longPress;
                if (YI.curScene) {
                    YI.curScene.handleEvent();
                }
            }
        }, 1000);
        Event.lastTouchStart = Date.now();
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
    }

    function onMouseMove(event) {
        Event.currentEvent = Event.type.touchMove;
        Event.Mouses.push(new Vector2(event.offsetX / YI.scale, event.offsetY / YI.scale));
        Event.mouseNum++;
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
    }

    function onMouseUp(event) {
        Event.isMouseDown = false;
        Event.currentEvent = Event.type.touchEnd;
        Event.Mouses.push(new Vector2(event.offsetX / YI.scale, event.offsetY / YI.scale));
        Event.mouseNum++;
        Event.endMouse = {x:event.offsetX, y:event.offsetY};
        if (Event.endMouse.x - Event.startMouse.x >= 70 && Math.abs(Event.endMouse.y - Event.startMouse.y) <= 30) {
            Event.currentEvent = Event.type.rightSwipe;
        }
        if (Event.startMouse.x - Event.endMouse.x >= 70 && Math.abs(Event.endMouse.y - Event.startMouse.y) <= 30) {
            Event.currentEvent = Event.type.leftSwipe;
        }
        if (Math.abs(Event.endMouse.x - Event.startMouse.x) <= 30 && Event.endMouse.y - Event.startMouse.y >= 70) {
            Event.currentEvent = Event.type.downSwipe;
        }
        if (Math.abs(Event.endMouse.x - Event.startMouse.x) <= 30 && Event.startMouse.y - Event.endMouse.y >= 70) {
            Event.currentEvent = Event.type.upSwipe;
        }
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
        Event.Mouses = [];
        Event.mouseNum = 0;
    }

    function onDoubleClick(event) {
        Event.currentEvent = Event.type.doubleTap;
        Event.Mouses.push(new Vector2(event.offsetX / YI.scale, event.offsetY / YI.scale));
        Event.mouseNum++;
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
        Event.Mouses = [];
        Event.mouseNum = 0;
    }

    function onClick(event) {
        Event.currentEvent = Event.type.tap;
        Event.Mouses.push(new Vector2(event.offsetX / YI.scale, event.offsetY / YI.scale));
        Event.mouseNum++;
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
        Event.Mouses = [];
        Event.mouseNum = 0;
    }

    function onTouchStart(event) {
        event.preventDefault();
        Event.isMouseDown = true;
        Event.currentEvent = Event.type.touchStart;
        Event.Mouses.push(new Vector2((event.touches[0].clientX - YI.offsetX) / YI.scale, (event.touches[0].clientY - YI.offsetY) / YI.scale));
        Event.mouseNum++;
        Event.startMouse = {x:event.touches[0].clientX, y:event.touches[0].clientY};
        setTimeout(function () {
            if (Event.currentEvent == Event.type.touchStart && Date.now() - Event.lastTouchStart > 900) {
                Event.currentEvent = Event.type.longPress;
                if (YI.curScene) {
                    YI.curScene.handleEvent();
                }
            }
        }, 1000);
        Event.lastTouchStart = Date.now();
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
    }

    function onTouchMove(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
        Event.currentEvent = Event.type.touchMove;
        Event.Mouses.push(new Vector2((event.touches[0].clientX - YI.offsetX) / YI.scale, (event.touches[0].clientY - YI.offsetY) / YI.scale));
        Event.mouseNum++;
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
    }

    function onTouchEnd(event) {
        event.preventDefault();
        Event.isMouseDown = false;
        Event.Mouses.push(new Vector2((event.changedTouches[0].clientX - YI.offsetX) / YI.scale, (event.changedTouches[0].clientY - YI.offsetY) / YI.scale));
        Event.mouseNum++;
        Event.endMouse = {x:event.changedTouches[0].clientX, y:event.changedTouches[0].clientY};
        if (Event.mouseNum < 3) {
            if (Date.now() - Event.lastTouchStart < 300) {
                Event.currentEvent = Event.type.tap;
            }
            if (Date.now() - Event.lastTouchEnd < 500) {
                Event.currentEvent = Event.type.doubleTap;
            }
        }
        else {
            Event.currentEvent = Event.type.touchEnd;
            if (Event.endMouse.x - Event.startMouse.x >= 50 && Math.abs(Event.endMouse.y - Event.startMouse.y) <= 20) {
                Event.currentEvent = Event.type.rightSwipe;
            }
            if (Event.startMouse.x - Event.endMouse.x >= 50 && Math.abs(Event.endMouse.y - Event.startMouse.y) <= 20) {
                Event.currentEvent = Event.type.leftSwipe;
            }
            if (Math.abs(Event.endMouse.x - Event.startMouse.x) <= 20 && Event.endMouse.y - Event.startMouse.y >= 50) {
                Event.currentEvent = Event.type.downSwipe;
            }
            if (Math.abs(Event.endMouse.x - Event.startMouse.x) <= 20 && Event.startMouse.y - Event.endMouse.y >= 50) {
                Event.currentEvent = Event.type.upSwipe;
            }
        }
        if (YI.curScene) {
            YI.curScene.handleEvent();
        }
        Event.Mouses = [];
        Event.mouseNum = 0;
        Event.lastTouchEnd = Date.now();
    }

    function onOrientationChange() {


    }

    function onResize() {
        YI.screenSize = {
            width:window.screen.availWidth,
            height:window.screen.availHeight
        };
        YI.viewport = {
            width:window.innerWidth,
            height:window.innerHeight
        };
        YI.scale = Math.min(YI.viewport.width / YI.width, YI.viewport.height / YI.height).toFixed(2);
        if (YI.isCenter) {
            YI.centerScreen();
        }
    }

    Event.getChooseObject = function () {
        if (YI.curScene && (Event.currentEvent !== Event.type.none)) {
            if (Event.mouseNum) {
                return YI.curScene.getEntitiesByPoint(Event.Mouses[Event.mouseNum - 1])[0];
            }
        }
        return null;
    }
});