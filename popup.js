$(function(){
    localStorage.Edit = -1;
    var picker = new Pikaday({ field: $('.datepicker')[0], firstDay: 1 });
    if (localStorage.silent == 0) {  $("#silent>i").attr("class", "icon-toggle-on"); }
    else { $("#silent>i").attr("class", "icon-toggle-off"); }
    $("#date").val((new Date(Date.now())).toDateString());
    $("#time").val((new Date(Date.now())).toTimeString().substr(0,5));
    showtasks();

    $("#save").click( function() {
        if ($("#newtask").val()=="") { $("#newtask").attr("placeholder", "enter new task"); return;}
        tasks = JSON.parse(localStorage.tasks);
        if (localStorage.Edit >= 0) tasks.splice(localStorage.Edit, 1);
        var stamp = Date.parse($("#date").val() + " " + $("#time").val());
        tasks.push({
                    "id": Date.now().toString(),
                    "task":$("#newtask").val(),
                    "date": $("#date").val(),
                    "time": $("#time").val(),
                    "stamp": stamp
                    });
        localStorage.tasks = JSON.stringify(tasks);
        chrome.storage.sync.set({'tasks': tasks}, function() {});
        $("#newtask").val("");
        $(".overlay").fadeOut();
        $("#form").fadeOut();
        showtasks();
    });

    $('input').bind('keypress', function(e) {
        if(e.keyCode == 13) $("#save").trigger("click");
    });

    $(".overlay").click( function() {
        $(".overlay").fadeOut();
        $("#form").fadeOut();
    });

    $("#add").click( function() {
        $(".overlay").fadeIn();
        $("#form").fadeIn();
    });

    $("#tasks").on("click", ".icon-trash-empty", function() {
        var n, id = $(event.target).closest("div").attr("id");
        $.each(tasks, function(i) { if (tasks[i]["id"]==id) n = i; });
        tasks = JSON.parse(localStorage.tasks);
        tasks.splice(n,1);
        localStorage.tasks = JSON.stringify(tasks);
        chrome.storage.sync.set({'tasks': tasks}, function() {});
        $("#"+id).fadeOut("slow", function() { showtasks(); } );
    });

    $("#tasks").on("click", ".ed", function() {
        $(".overlay").fadeIn();
        $("#form").fadeIn();
        var n, id = $(event.target).closest("div").attr("id");
        $.each(tasks, function(i) { if (tasks[i]["id"]==id) n = i; });
        tasks = JSON.parse(localStorage.tasks);
        $("#newtask").val(tasks[n]["task"]);
        $("#time").val(tasks[n]["time"]);
        $("#date").val(tasks[n]["date"]);
        localStorage.Edit = n;
    });

    $("#silent").click( function() {
        if (localStorage.silent == 0) {
            localStorage.silent = 1;
            $("#silent>i").attr("class", "icon-toggle-off");
            chrome.browserAction.setIcon( { path: {"19": "19x19mute.png", "38": "38x38mute.png"}});
        }
        else  {
            localStorage.silent = 0;
            $("#silent>i").attr("class", "icon-toggle-on");
            chrome.browserAction.setIcon({ path: {"19": "19x19.png", "38": "38x38.png"}});
        }
    });

});

function showtasks() {

    if ( localStorage.tasks.length < 1 ) return;
    var tasks = [], rems = "Reminders:\n\n";
    $("#tasks").empty();
    tasks = JSON.parse(localStorage.tasks);
    tasks.sort(function(obj1, obj2) {return obj1.stamp - obj2.stamp;});
    $.each( tasks, function( key, value ) {
        var moment = new Date(tasks[key]["stamp"]);
        var color = "";
        if (moment.toDateString() == new Date(Date.now()).toDateString()) color = "green";
        if (moment < Date.now()) color = "red";
        var dom = '<i class="icon-trash-empty"></i><span class="date ed"></span><span class="time ed"></span><span class="task ed"></span>';
        console.log(dom);
        $("#tasks").append('<div id="' + tasks[key]["id"] + '">' + dom + '</div>');
        $("#" + tasks[key]["id"] + " .date").text(tasks[key]["date"]);
        rems+=tasks[key]["date"]+"\t";
        $("#" + tasks[key]["id"] + " .time").text(tasks[key]["time"]);
        rems+=tasks[key]["time"]+"\t\n";
        $("#" + tasks[key]["id"] + " .task").css("color", color).text(tasks[key]["task"]);
        rems+=tasks[key]["task"]+"\n\n";
    });
    localStorage.Edit = -1;
    localStorage.tasks = JSON.stringify(tasks);
    chrome.browserAction.setTitle({title: rems });
    set_badge();
}
