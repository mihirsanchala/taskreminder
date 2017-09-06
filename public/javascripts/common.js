(function () {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var page = getParameterByName('pg');
    var code = getParameterByName('code');
    var info = getParameterByName('info');

    if(page && code && info){
        if(code == 1)
            message = "Task Completed";
        else if(code == 2)
            message = "Task Snoozed";

        if(info == 1)
            classes = "alert alert-success";
        else
            classes = "alert alert-danger";

        showMessage(page, message, classes)
    }

    function showMessage(view, message, classes){
		$('#' + view + '-alert').attr('class', classes);
        $('#' + view + '-alert').text(message);
        $('#' + view + '-alert').show();
        setTimeout(function() {
            $('#' + view + '-alert').slideUp("slow");
        }, 2000);
	}

	window.showMessage = showMessage;
})();