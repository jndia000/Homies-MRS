/**
 * ===========================================================================
 * * PATIENT DETAILS  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // EDIT DIAGNOSTIC RESULT VALIDATION
  jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be before today');
  $('#editDatailsForm').validate({
    debug: false,
    rules: {
      first_name: {
        required: true
      },
      last_name: {
        required: true
      },
      gender: {
        required: true
      },
      birthdate: {
        required: true,
        beforeToday: true
      },
      contact_number: {
        required: true
      },
      region: {
        required: true
      },
      street_name: {
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
      },
      weight: {
        required: true
      },
      height: {
        required: true
      },
      blood_type: {
        required: true
      },
      guardian: {
        required: true
      }
    },
    messages: {     
      first_name: {
        required: "Please provide your first name",
      },
      last_name: {
        required: "Please provide your last name",
      },
      gender: {
        required: "Please provide your gender",
      },
      birthdate: {
        required: "Please provide birthdate"
      },
      contact_number: {
        required: "Please provide a contact number",
      },
      house_number: {
        required: "Please provide patient's house number"
      },
      street_name: {
        required: "Please provide patient's street"
      },
      barangay: {
        required: "Please provide patient's barangay"
      },
      municipality: {
        required: "Please provide patient's municipality"
      },
      province: {
        required: "Please provide patient's province"
      },
      weight: {
        required: "Please provide patient's vitals"
      },
      height: {
        required: "Please provide patient's vitals"
      },
      blood_type: {
        required: "Please provide patient's vitals"
      },
      guardian: {
        required: "Please provide patient's vitals"
      },
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
    submitHandler: () => editDetails()
  });


});



// EDIT PATIENT DETAILS
// $('#editDatailsbtn').click(function(e){
  editDetails = () => {

    // var valid = this.form.checkValidity();

    // if(valid){
      var first_name      = $('#u_first_name').val();
      var middle_name     = $('#u_mid_name').val();
      var last_name       = $('#u_last_name').val();
      var sex             = $('#u_gender').val();
      var birthday      = $('#u_bday').val();
      var contact_number  = $('#u_contact').val();
      var region          = $('#u_house').val();
      var street          = $('#u_street').val();
      var barangay        = $('#u_barangay').val();
      var municipality    = $('#u_municipality').val();
      var province        = $('#u_province').val();
      var guardian        = $('#u_guardian').val();
      var weight          = $('#u_weight').val();
      var height          = $('#u_height').val();
      var blood_type      = $('#u_blood_type').val();
    // }
    var data = {first_name,
                middle_name,
                last_name,
                sex,
                birthday,
                contact_number,
                region,
                street,
                barangay,
                municipality,
                province,
                guardian,
                height,
                weight,
                blood_type};
    console.log(data);
    // e.preventDefault();
      const patient_id      = $('#u_patient_id').val();

    $.ajax({
      url: `http://127.0.0.1:8000/patient/updateDetails/${ patient_id }`,
        type: 'PUT',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
          console.log(result)
        //   alert
          toastr.success('Patient Details Updated')
        //   hide modal
          $("#edit_details").modal('hide');
        //   remove data in form
          document.getElementById("editDatailsForm").reset();
          
        // patient details
        $('#patient_name').html(result.last_name+', '+
                                result.first_name+' '+
                                result.middle_name);
        $('#patient_weight').html(result.weight);
        $('#patient_height').html(result.height);
        $('#patient_blood_type').html(result.blood_type);
        $('#patient_guardian').html(result.guardian);
        $('#patient_gender').html(result.sex);
        $('#patient_bday').html(moment(result.birth_date).format("MMMM D, YYYY"));
        $('#patient_type').html(result.patient_type);
        $('#patient_contact').html(result.contact_number);
        $('#patient_address').html(result.street+', '+
                                    result.barangay+', '+
                                    result.municipality+', '+
                                    result.province+', '+
                                    result.region);

        var bmi = (result.weight / ((result.height * result.height) / 10000)).toFixed(2);
        // Dividing as per the bmi conditions
        var bmi_status = ""
          if (bmi < 18.6) 
          {
              bmi_status = "Under Weight"
          }

          else if (bmi >= 18.6 && bmi < 24.9)
          {
                bmi_status = "Normal"
          }

          else 
          {
              bmi_status = "Over Weight"
          }

          $('#patient_bmi').html(bmi);
          $('#patient_bmi_status').html(bmi_status);

          
      },
        error: () => console.error('GET ajax failed')
    });

}

  