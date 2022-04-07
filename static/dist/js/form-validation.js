const submitHandlerLogs = true;

$(function () {
    $.validator.setDefaults({
      submitHandler: function () {
        alert( "Form successful submitted!" );
      }
    });
    $('#addProblemForm').validate({
      rules: {
        problem_name: {
          required: true,
        },
        date_occured: {
          required: true,
        },
        problem_note: {
          required: true,
        },
        date_resolved: {
          required: true,
        },
      messages: {
        problem_name: {
            required: "Problem name is required"
        },
        date_occured: {
            required: "Date occured is required"
        },
        problem_note: {
          required: "Problem note is required"
        },
        date_resolved: {
          required: "Date Resolved is required"
        }
      },
      // },
      // messages: {
      //   email: {
      //     required: "Please enter a email address",
      //     email: "Please enter a vaild email address"
      //   },
      //   password: {
      //     required: "Please provide a password",
      //     minlength: "Your password must be at least 5 characters long"
      //   },
      //   terms: "Please accept our terms"
      },
      errorElement: 'span',
      errorPlacement: function (error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid').removeClass('is-valid');
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass('is-valid').removeClass('is-invalid');
      },
      submitHander: () => {
        if(submitHandlerLogs) console.log("#addProblemForm is submitted");
    }
    });
  });