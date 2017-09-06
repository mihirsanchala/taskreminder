(function () {
    function validate(type){
		if(type === 'signup' && $('#signupPswd').val() !== $('#signupRePswd').val()){
			showMessage('index', 'Password Mismatch', 'alert alert-danger');
			$('#signupPswd').val('');
			$('#signupRePswd').val('');
			return false;
		}

		ajaxData = {};
		ajaxData.type = type;
		ajaxData.email = $('#' + type + 'Email').val();
		ajaxData.pswd = $('#' + type + 'Pswd').val();
		
		$.ajax({
			type: 'POST',
			url: '/verify',
			data: ajaxData,
			success: function (data) {
				if(data.status == 1)
					window.location.href = '/dashboard';
				else if(data.status == 2){
					if(type === "login")
						showMessage('index', 'Invalid Username/Password', 'alert alert-danger');
					else
						showMessage('index', 'Email ID Already Exists', 'alert alert-danger');
				}
				else if(data.status == 3){
					if(type === "login")
						showMessage('index', 'Account Not Activated', 'alert alert-danger');
					else{
						showMessage('index', 'Activation Mail Sent', 'alert alert-success');
						$('#signupEmail').val('');
						$('#signupPswd').val('');
						$('#signupRePswd').val('');
					}
				}
			}
		});

		return false;
	}

	window.validate = validate;
})();