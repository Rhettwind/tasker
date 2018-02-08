chrome.alarms.create('timer', {
    delayInMinutes: 1,
    periodInMinutes: 1
});

chrome.runtime.onInstalled.addListener(function(details){
    localStorage.silent = localStorage.silent || 0;
    localStorage.tasks = localStorage.tasks || "[]";

});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == 'timer') set_badge();
});

chrome.notifications.onButtonClicked.addListener( function (id, button) {
    click(id, button);
});

chrome.notifications.onClicked.addListener( function(id) {
    click(id, -1);
});

chrome.windows.onRemoved.addListener(function (id) {
    if (id==localStorage.win) set_badge();
});

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == "sync" && "tasks" in changes) {
          chrome.storage.sync.get('tasks', function(obj) {
              localStorage.tasks = JSON.stringify(obj.tasks);
            });
    }
});
