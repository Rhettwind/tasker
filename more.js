chrome.notifications.getAll(function (notifications) {
        $.each(notifications, function( id ) {
            chrome.notifications.clear( id, function (){});
        });
});


window.onload = function() {

    var n = Number(window.location.search.slice(1));
    tasks = JSON.parse(localStorage.tasks);
    $("#task").text(tasks[n]["task"]);

    $(".time div").click(function (event) {
        if ( event.currentTarget.className == "custom" ) {
            if ( event.target.id != "custom") return;
            event.currentTarget.id = $("#dd").val()*24*60 + $("#hh").val()*60 + $("#mm").val()*1;
        }
        var plus = parseInt(event.currentTarget.id)*60000;
        var now = new Date();
            if (plus > 1439*60000) {
                now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
            }
        addtime(n, now.getTime() + plus);
        window.close();
    });

    $("input").change(function (event) {

        });

    $('body').mouseenter(function() {
	    $("body").stop();
        $("body").fadeIn(400);
    });

    $('body').mouseleave(function() {
	    $( "body" ).fadeOut( 6000, function() {
            window.close();
        });
    });

    window.resizeBy(0, document.body.offsetHeight - window.innerHeight + 25);
};
