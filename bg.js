function set_badge() {

    chrome.browserAction.setBadgeBackgroundColor({color: "#3A6E1B"});
    var count=0;
    if ( localStorage.tasks.length > 0 ) {
        tasks = JSON.parse(localStorage.tasks);
        $.each( tasks, function( key, value ) {
            var moment = new Date(tasks[key]["stamp"]);
            if ( moment < Date.now() || moment.toDateString() == new Date(Date.now()).toDateString() ) {
                count++;
                if ( moment < Date.now() ) {
                    chrome.browserAction.setBadgeBackgroundColor({color: "#DF0000"});
                    notify(tasks[key]["id"], tasks[key]["task"]);
                }
            }
        });
        chrome.browserAction.setBadgeText({text: (count === 0) ? "" : count.toString()});
    }
}

function notify (id, message) {

    if (chrome.extension.getViews({ type: "tab" }).length > 0 ||
        chrome.extension.getViews({ type: "popup" }).length > 0 ||
        localStorage.silent == 1) return;

    var options = {
    type: "basic",
    title: message,
    message: "",
    iconUrl: "5min.png",
    buttons: [{"title":"snooze...", "iconUrl": "snooze.png"}, {"title": "done", "iconUrl": "done.png"}],
    priority: 0
    };
    chrome.notifications.clear(id, function (){});
    chrome.notifications.create(id, options, function (){});
}

function click (id, button) {

    tasks = JSON.parse(localStorage.tasks);
    var n;
    $.each(tasks, function(i) { if (tasks[i]["id"]==id) n = i; });
    switch (button) {
        case 0:
            openMore(n, tasks[n]["task"]);
            break;
        case 1:
            tasks.splice(n, 1);
            localStorage.tasks = JSON.stringify(tasks);
            chrome.storage.sync.set({'tasks': tasks}, function() {});
            set_badge();
            break;
        case -1:
            addtime(n, Date.now() + 300000);
            set_badge();
    }
    chrome.notifications.clear(id, function (){});
}


var openMore = function(n, task) {
    var width = 360;
    var height = 355;
    var top;
    if (navigator.platform.indexOf('Mac') >= 0) {
        top = 33;
    } else {
        top = window.screen.availHeight - height - 10;
    }
    var left = window.screen.availWidth - width - 10;

    var spec = {
        'type': 'popup',
        'focused': true,
        'url': 'more.html?' + n ,
        'width': width,
        'height': height,
        'top': top,
        'left': left
    };

    chrome.windows.create(spec, function(window) {
        localStorage.win = window.id;
    });
};

function addtime(n, newtime) {
    tasks = JSON.parse(localStorage.tasks);
    tasks[n]["stamp"] = newtime;
    tasks[n]["date"] = new Date(newtime).toDateString();
    tasks[n]["time"] = new Date(newtime).toTimeString().substr(0,5);
    localStorage.tasks = JSON.stringify(tasks);
    chrome.storage.sync.set({'tasks': tasks}, function() {});
}
