(function () {
    $( function() {
        $( "#createDate,#editDate" ).datepicker({
            minDate: 1,
            dateFormat: "dd/mm/yy",
            changeYear: true,
            changeMonth: true
        });
        $("#createDate,#editDate").keydown(false);
    });

    function taskView(objectID){
        $('#editDate').val($('#' + objectID + ' td:first-child').text());
        $('#editDetails').val($('#' + objectID + ' td:nth-child(2)').text());

        $('#editTask form').attr('onSubmit',"return taskAction('edit', '" + objectID + "')")
    }

    function taskDeleteConfirmation(objectID){
        $('#deleteTask form').attr('onSubmit',"return taskAction('delete', '" + objectID + "')")
    }

    function taskCompleted(objectID){
        $.ajax({
			type: 'GET',
			url: '/completed/' + objectID,
			success: function (data) {
                $('#completedTasks').append(`<tr id='` + data.objectID + `'>
							<td>` + $('#' + objectID + ' td:first-child').text() + `</td>
							<td>` + $('#' + objectID + ' td:nth-child(2)').text() + `</td>
						</tr>`);
                $('#' + objectID).remove();
                showMessage('dashboard', 'Task Completed', 'alert alert-success');
            }
		});
    }

    function taskAction(type, objectID){
		ajaxData = {};
		ajaxData.type = type;
        
        if(type === "delete"){
            ajaxData.objectID = objectID;
        }
        else{
            ajaxData.date = $('#' + type + 'Date').datepicker('getDate');
		    ajaxData.details = $('#' + type + 'Details').val();
            
            var now = new Date();
            now.setHours(0,0,0,0);
            if (ajaxData.date <= now) {
                if(type === "edit")
                    var alertView = 'popup';
                else
                    var alertView = 'dashboard';
                showMessage(alertView, 'Date Error', 'alert alert-danger');
                return false;
            }
            
            if(type === "edit")
                ajaxData.objectID = objectID;
        }

		$.ajax({
			type: 'POST',
			url: '/dashboard/task/action',
			data: ajaxData,
			success: function (data) {
				if(type === "create"){
                    $('#manageTasks').append(`<tr id='` + data.objectID + `'>
							<td>` + $('#' + type + 'Date').val() + `</td>
							<td>` + ajaxData.details + `</td>
							<td>
								<div class="btn-group btn-group-sm" role="group" >
									<button type="button" class="btn btn-sm btn-default" data-toggle="modal" title='Edit' data-target="#editTask" onClick="taskView('` + data.objectID + `')">
										<span class="glyphicon glyphicon-edit" aria-hidden="true"></span>
									</button>
									<button type="button" class="btn btn-sm btn-default" data-toggle="modal" title='Remove' data-target="#deleteTask" onClick="taskDeleteConfirmation('` + data.objectID + `')"">
										<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
									</button>
								</div>
							</td>
						</tr>`);
                        $('#' + type + 'Date').val('');
                        $('#' + type + 'Details').val('');
                        showMessage('dashboard', 'Task Created', 'alert alert-success');
                }
                else if(type === "edit"){
                    $('#' + objectID + ' td:first-child').text($('#' + type + 'Date').val());
                    $('#' + objectID + ' td:nth-child(2)').text(ajaxData.details);
                    $("#editTask").modal("hide");
                    showMessage('dashboard', 'Task Updated', 'alert alert-success');
                }
                else if(type === "delete"){
                    $('#' + objectID).remove();
                    $("#deleteTask").modal("hide");
                    showMessage('dashboard', 'Task Deleted', 'alert alert-success');
                }
			}
		});

		return false;
	}

	window.taskAction = taskAction;
    window.taskCompleted = taskCompleted;
    window.taskView = taskView;
    window.taskDeleteConfirmation = taskDeleteConfirmation;
})();