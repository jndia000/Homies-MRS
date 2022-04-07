/**
 * ===========================================================================
 * * DISCHARGE  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // ADD DISCHARGE RESULT VALIDATION
  $('#addUserForm').validate({
    debug: false,
    rules: {
      user_fname: {
        required: true
      },
      user_lname: {
        required: true
      },
      role: {
        required: true
      },
      email: {
        required: true
      },
      password: {
        required: true
      },
      birth_date: {
        required: true
      },
      house_number: {
        required: true
      },
      street: {
        required: true
      },
      barangay: {
        required: true
      },
      municipality: {
        required: true
      },
      province: {
        required: true
      }
    },
    messages: {      
      user_fname: {
        required: "Please provide your first name"
      },
      user_lname: {
        required: "Please provide your last name"
      },
      role: {
        required: "Please provide a role"
      },
      email: {
        required: "Please provide a email"
      },
      password: {
        required: "Please provide a password"
      },
      birth_date: {
        required: "Please provide a birthdate"
      },
      house_number: {
        required: "Please provide a house number"
      },
      street: {
        required: "Please provide a street"
      },
      barangay: {
        required: "Please provide a barangay"
      },
      municipality: {
        required: "Please provide a municipality"
      },
      province: {
        required: "Please provide a province"
      }
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
    },
    submitHandler: () => addUserbtn()
  });


});

/**
 * ===========================================================================
 * * ADD USER AJAX
 * ===========================================================================
 */
// ADD USER
// $('#addUserbtn').click(function(e){
  addUserbtn = () => {

    // var valid = this.form.checkValidity();
  
    // if(valid){
      var first_name    = $('#user_fname').val();
      var middle_name   = $('#user_mname').val();
      var last_name     = $('#user_lname').val();
      var suffix_name   = $('#user_suffix').val();
      var user_type_id  = $('#role').val();
      var email         = $('#user_email').val();
      var password      = $('#user_password').val();
      var birth_date    = $('#user_birth_date').val();
      var region        = $('#user_house_number').val();
      var street        = $('#user_street').val();
      var barangay      = $('#user_barangay').val();
      var municipality  = $('#user_municipality').val();
      var province      = $('#user_province').val();
    // }
    var data = {user_type_id,
                email,
                password,
                first_name,
                middle_name,
                last_name,
                suffix_name,
                birth_date,
                region,
                street,
                barangay,
                municipality,
                province};
    console.log(data);
    // e.preventDefault();
  
    $.ajax({
      url: 'http://127.0.0.1:8000/user/newUser',
        type: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
          console.log(result)
          toastr.success('New User Added')
          $("#users").modal('hide');
          document.getElementById("addUserForm").reset();
          
          // reload datatable
          $('#user_table').DataTable().ajax.reload();
          
      },
        error: () => console.error('GET ajax failed')
    });
}



/**
 * ===========================================================================
 * * EDIT USER STATUS AJAX
 * ===========================================================================
 */
// EDIT USER STATUS
$('#statusbtn').click(function(e){
    var valid = this.form.checkValidity();
    if(valid){
        var active_status       = $('#statusvalue').val();    
        var user_id       = $('#user_idvalue').val();  
    }

    var data = {active_status};
    console.log(user_id);
    console.log(data);
    e.preventDefault();
     
  $.ajax({
    url: `http://127.0.0.1:8000/user/updateUserStatus/${ user_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
      //   alert
        toastr.success('User Status Updated')
      //   hide modal
        $("#updatestatusmodal").modal('hide');
        //   remove data in form
        document.getElementById("userStatusForm").reset();
        // reload datatable
        $('#user_table').DataTable().ajax.reload();

        
    },
      error: () => console.error('GET ajax failed')
  });
});


/**
 * ===========================================================================
 * * USER  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // EDIT USER VALIDATION
  $('#editUserForm').validate({
    debug: false,
    rules: {
      edit_user_fname: {
        required: true
      },
      edit_user_lname: {
        required: true
      },
      edit_user_birthdate: {
        required: true
      },
      edit_user_house_number: {
        required: true
      },
      edit_user_street: {
        required: true
      },
      edit_user_barangay: {
        required: true
      },
      edit_user_municipality: {
        required: true
      }
    },
    messages: {      
      edit_user_fname: {
        required: "Please provide your first name"
      },
      edit_user_lname: {
        required: "Please provide your last name"
      },
      edit_user_birthdate: {
        required: "Please provide a birthdate"
      },
      edit_user_house_number: {
        required: "Please provide a house number"
      },
      edit_user_street: {
        required: "Please provide a street"
      },
      edit_user_barangay: {
        required: "Please provide a barangay"
      },
      edit_user_municipality: {
        required: "Please provide a municipality"
      }
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
    },
    submitHandler: () => editUserbtn()
  });


});
/**
 * ===========================================================================
 * * UPDATE USERS PROFILE
 * ===========================================================================
 */
// UPDATE User profile
// $('#editUserbtn').click(function(e){
  editUserbtn = () => {

    // var valid = this.form.checkValidity();
  
    // if(valid){
      var first_name          = $('#edit_user_fname').val();
      var middle_name         = $('#edit_user_mname').val();
      var last_name           = $('#edit_user_lname').val();
      var suffix_name         = $('#edit_user_suffix').val();
      var birth_date          = $('#edit_user_birthdate').val();
      var region              = $('#edit_user_house_number').val();
      var street              = $('#edit_user_street').val();
      var barangay            = $('#edit_user_barangay').val();
      var municipality        = $('#edit_user_municipality').val();
      var province            = $('#edit_user_province').val();
      var user_profile_id     = $('#e_user_profile_id').val();
  
  
    // }
    var data = {first_name, 
                middle_name, 
                last_name, 
                suffix_name, 
                birth_date,
                region,
                street,
                barangay,
                municipality,
                province};
    console.log(data);
    // e.preventDefault();
    // const patient_record_id_h      = $('#u_patient_record_mh').val();
  
    $.ajax({
      url: `http://127.0.0.1:8000/user/UpdateUserProfile/${ user_profile_id }`,
        type: 'PUT',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
          console.log(result)
          // alert
          toastr.success('User Updated')
          // hide modal
          $("#edit_users").modal('hide');
          // remove data in form
          document.getElementById("editUserForm").reset();     
         // reload datatable
          $('#user_table').DataTable().ajax.reload();
      },
        error: () => console.error('GET ajax failed')
    });
  
  }

/**
 * ===========================================================================
 * * UPDATE USERS
 * ===========================================================================
 */
// UPDATE User
$('#userCredentialBtn').click(function(e){

    var valid = this.form.checkValidity();
  
    if(valid){
      var user_type_id          = $('#edit_role').val();
      var email         = $('#edit_user_email').val();
      var user_id     = $('#user_id_value').val();
  
  
    }
    var data = {user_type_id,email};
    console.log(data);
    e.preventDefault();
  
    $.ajax({
      url: `http://127.0.0.1:8000/user/User/UpdateUser/${ user_id }`,
        type: 'PUT',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
          console.log(result)
          // alert
          toastr.success('User Updated')
          // hide modal
          $("#userCredentialModal").modal('hide');
          // remove data in form
          document.getElementById("userCredentialForm").reset();     
         // reload datatable
          $('#user_table').DataTable().ajax.reload();
      },
        error: () => console.error('GET ajax failed')
    });
  
  });
  
  
  