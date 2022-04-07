/**
 * ===========================================================================
 * * REQUEST FORM LOADS
 * ===========================================================================
 */
// show form content for review
function showformcontent(){
    // patient details
    $('#v_record_id').html($('#patient_record_id').val());
    $('#v_patient_name').html($('#patient_first_name').val()+' '+$('#patient_last_name').val());
    $('#v_patient_dob').html($('#patient_birth_date').val());
    $('#v_patient_gender').html($('#patient_gender').val());
    $('#v_patient_email').html($('#patient_email').val());
    $('#v_patient_phone').html($('#patient_phone').val());

    // request details
    var request_info     = $('input:checkbox:checked.request_info').map(function(){return this.value; }).get().join(",");
    var info = request_info.split(',');
    var info_r = '';
    for(i=0;i<info.length;i++){
        info_r += info[i]+'<br>';
    }
    $('#v_request_info').html(info_r);
    $('#v_reason').html($("input[name='reason']:checked").val());
    $('#v_delivery').html($('#delivery').val());

    // attachments
    var patient_valid_id = $("#patient_valid_id")[0].files[0]; 
    $('#v_patient_id').html(patient_valid_id.name);
    
    if($("#requester_valid_id")[0].files[0]){
        var requester_valid_id = $("#requester_valid_id")[0].files[0]; 
        $('#v_requester_id').html(requester_valid_id.name);
    }
    if($("#requester_letter")[0].files[0]){
        var requester_letter = $("#requester_letter")[0].files[0]; 
        $('#v_requester_letter').html(requester_letter.name);
    }
    // requester
    $('#v_name').html($('#requester_first_name').val()+' '+$('#requester_last_name').val());
    $('#v_relationship').html($('#requester_relationship').val());
    $('#v_dob').html($('#requester_birth_date').val());
    $('#v_gender').html($('#requester_gender').val());
    $('#v_email').html($('#requester_email').val());
    $('#v_phone').html($('#requester_phone').val());
    $('#v_address').html($('#request_house_number').val()+' '+
                        $('#request_street').val()+', '+
                        $('#request_barangay').val()+','+
                        $('#request_municipality').val()+', '+
                        $('#request_province').val());
}


// same as previous checkbox
$('#getDetails').click(function(e){
    $('#requester_first_name').val($('#patient_first_name').val());
    $('#requester_last_name').val($('#patient_last_name').val());
    $('#requester_birth_date').val($('#patient_birth_date').val());
    $('#requester_relationship').val('Patient');
    $('#requester_gender').val($('#patient_gender').val());
    $('#requester_email').val($('#patient_email').val());
    $('#requester_phone').val($('#patient_phone').val());
});
// toggle upload field
$('#getDetails').change(function(){
    $('#r_valid_id').toggle();
    $('#r_letter').toggle();
  });


/**
 * ===========================================================================
 * * PENDING REQUEST DATATABLE
 * ===========================================================================
 */
// pending request datatable
let pending_request_table = $('#pending_request_table').DataTable({
    // language: {
    //     paginate: {
    //       next: '<i class="fa fa-caret-right"/>', 
    //       previous: '<i class="fa fa-caret-left"/>'
    //     }
    //   },
    serverSide: true,
    processing:true,
    // lengthChange: false,
    pageLength: 10,
    // scrollY: 400,
    responsive: true,
    // buttons:[
    //     {extend: 'excel', text: 'Save to Excel File',exportOptions: {
    //         columns: [0, 1, 2, 3]
    //     }}
    // ],
    ajax: '/request/allRequest/pending',
    columns:[
        {data: 'requester_first_name',
                class: 'text-left',
                render: function ( data, type, row ) {
                return `<div class="d-flex align-items-baseline">
                            <div>
                                <div>`+row.requester_first_name + ` ` + row.requester_last_name+`</div>
                                <div class="text-secondary small">`+row.requester_relationship+`</div>
                                </div>
                            </div>` ;
                }},
        {data: 'disclosure_reason'},
        {data: null,
            render: data => {
            if(data.active_status == 'Pending') return `
                  <div class="badge badge-warning p-2 w-100" role="button" 
                        onClick="viewRequest('${data.request_id}','view')">
                        <i class="fas fa-redo mr-1"></i>${ data.active_status }</div>`;
            else  if(data.active_status == 'Approved') return  `
                <div class="badge badge-primary p-2 w-100"><i class="fas fa-check mr-1"></i>${ data.active_status }</div>`;
            else return  `
                <div class="badge badge-danger p-2 w-100"><i class="fas fa-times mr-1"></i>${ data.active_status }</div>`;
          }},
        {data: null,
            render: data => {
              const date_occured = moment(data.created_at).format("MMMM D, YYYY");
              const humanizedDateOccured = moment(data.created_at).fromNow();
              return `
                              <div class="d-flex align-items-baseline">
                                  <div>
                                      <div>${date_occured}</div>
                                      <div class="text-secondary small">Requested ${humanizedDateOccured}</div>
                                  </div>
                              </div>
                          `;
            }},
        {data: null,
                class: 'text-center',
                render: data => {
                    return `
                    <div class="text-center dropdown">
                        <!-- Dropdown toggler -->
                        <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">
                            <i class="fas fa-ellipsis-v"></i>
                        </div>
  
                        <!-- dropdown menu -->
                        <div class="dropdown-menu dropdown-menu-right">
                            <div class="dropdown-item d-flex" 
                                    role="button" 
                                    onClick="viewRequest('${data.request_id}','view')">
                                <div style="width: 2rem;">
                                    <i class="fas fa-eye mr-1"></i>
                                </div>
                                <div>View Request</div>
                            </div>
                           
                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item d-flex" 
                                    role="button"
                                    onClick="viewRequest('${data.request_id}','delete')">
                                <div style="width: 2rem;">
                                    <i class="fas fa-trash-alt mr-1"></i>
                                </div>
                                <div>Delete Request</div>
                            </div>
                        </div>
                    </div>
                    `
                }}
    ],
    initComplete: function(){
        pending_request_table.buttons().container().appendTo('#pending_request_table_wrapper .col-md-6:eq(0)')
    }
  })


/**
 * ===========================================================================
 * * VIEW REQUEST FUNCTION
 * ===========================================================================
 */
function viewRequest(request_id,type){

    $.ajax({
        url: `http://127.0.0.1:8000/request/GetOneRequest/${request_id}`,
        type: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(diagnosis_id),
        success: result => {
            console.log(result)
            console.log(type)
            if (type == 'view'){
                // patient details
                $('#view_record_id').html(result.patient_record_id);
                $('#view_patient_name').html(result.patient_first_name+' '+result.patient_last_name);
                $('#view_patient_dob').html(result.patient_birth_date);
                $('#view_patient_gender').html(result.patient_gender);
                $('#view_patient_email').html(result.patient_email);
                $('#view_patient_phone').html(result.patient_phone);

                // request details
                var info = result.request_information.split(',');
                var info_r = '';
                for(i=0;i<info.length;i++){
                    info_r += info[i]+'<br>';
                }
                $('#view_request_info').html(info_r);
                $('#view_reason').html(result.disclosure_reason);
                $('#view_delivery').html(result.delivery);

                // attachments
                $("#view_patient_id").attr("src","/static/app/files/"+result.patient_valid_id);
                if(result.requester_valid_id){
                    $("#view_requester_id").attr("src","/static/app/files/"+result.requester_valid_id);
                }
                if(result.requester_letter){
                    extension = result.requester_letter.split('.').pop();
                    console.log(extension);
                    if(extension == "pdf"){
                        $("#requester_letter_pdf").attr("href","/static/app/files/"+result.requester_letter);
                        $("#requester_letter_pdf").html(result.requester_letter);
                    }else{
                    $("#view_requester_letter").attr("src","/static/app/files/"+result.requester_letter);

                    }
                }
                
                // requester
                $('#view_name').html(result.requester_first_name+' '+result.requester_last_name);
                $('#view_relationship').html(result.requester_relationship);
                $('#view_dob').html(result.requester_birth_date);
                $('#view_gender').html(result.requester_gender);
                $('#view_email').html(result.requester_email);
                $('#view_phone').html(result.requester_phone);
                $('#view_address').html(result.house_number+' '+
                                    result.street+', '+
                                    result.barangay+','+
                                    result.municipality+', '+
                                    result.province);
                // set value for hidden input
                $('#requestID').val(result.request_id);
                $('#recordID').val(result.patient_record_id);
                $('#request_fname').val(result.patient_first_name);
                $('#request_lname').val(result.patient_last_name);
                $('#request_info').val(result.request_information);
                $('#request_delivery').val(result.delivery);
                $('#request_email').val(result.requester_email);

                // set value for hidden input - reject modal
                $('#r_request_id').val(result.request_id);
                $('#r_request_email').val(result.requester_email);
                if(result.active_status != "Pending"){
                    var date = moment(result.updated_at).format("MMMM D, YYYY")
                    $('#request_action_btn').hide();
                    if(result.active_status == "Rejected"){
                        $('#ShowStat').html(`
                                        <label>Status:</label> ${result.active_status}<br>
                                        <label>Date reviewed:</label> ${date}<br>
                                        <label>Reason for Rejection:</label> ${result.reason}<br><hr> `);
                    }
                    
                }

              $("#medical_request").modal('show');
            } else if (type == 'delete'){
                // set value for hidden input - delete request modal
                $('#del_request_id').val(result.request_id);
                $("#request_del_modal").modal('show');

                
            }
      },
        error: () => console.error('GET ajax failed')
    });
  
}

/**
 * ===========================================================================
 * * APPROVE REQUEST AJAX
 * ===========================================================================
 */
$('#approveBtn').click(function(e){

    var valid = this.form.checkValidity();

    if(valid){
      var request_id          = $('#requestID').val();
      var patient_record_id   = $('#recordID').val();
      var patient_first_name  = $('#request_fname').val();
      var patient_last_name   = $('#request_lname').val();
      var request_information = $('#request_info').val();
      var delivery            = $('#request_delivery').val();
      var requester_email     = $('#request_email').val();
    }
    var data = {patient_record_id,
                patient_first_name,
                patient_last_name,
                request_information,
                delivery,
                requester_email};
    e.preventDefault();
     
  $.ajax({
    url: `http://127.0.0.1:8000/request/approveRequest/${ request_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        //   hide modal
        $("#medical_request").modal('hide');
        if(result == 404 || result == 403){
            toastr.warning('Requested information not existing')
            toastr.success('Request Status Updated')

        }
        if(result == 202){
            toastr.success('Request Status Updated')
        }
            // reload datatable
            $('#request_table').DataTable().ajax.reload();
            $('#pending_request_table').DataTable().ajax.reload();
    },
      error: () => console.error('GET ajax failed')
  });

});

/**
 * ===========================================================================
 * * REJCT REQUEST AJAX
 * ===========================================================================
 */
$('#rejectBtn').click(function(e){

    var valid = this.form.checkValidity();

    if(valid){
      var request_id          = $('#r_request_id').val();
      var requester_email     = $('#r_request_email').val();
      var reason              = $('#r_reason').val();
    }
    var data = {reason,requester_email};
    e.preventDefault();
     
  $.ajax({
    url: `http://127.0.0.1:8000/request/rejectRequest/${ request_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        //   hide modal
        $("#r_medical_request").modal('hide');
        
        if(result == 202){
            toastr.success('Request Status Updated')
        }
        document.getElementById("rejectRequestForm").reset();
            // reload datatable
            $('#request_table').DataTable().ajax.reload();
            $('#pending_request_table').DataTable().ajax.reload();
    },
      error: () => console.error('GET ajax failed')
  });

});

/**
 * ===========================================================================
 * * DELETE REQUEST AJAX
 * ===========================================================================
 */
$('#reqDeletetbtn').click(function(e){

    var valid = this.form.checkValidity();

    if(valid){
      var request_id          = $('#del_request_id').val();
    }
    var reason   = "Request Deleted."
    var data = {reason};
    e.preventDefault();
     
  $.ajax({
    url: `http://127.0.0.1:8000/request/rejectRequest/${ request_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        //   hide modal
        $("#request_del_modal").modal('hide');
        
        if(result == 202){
            toastr.success('Request Deleted')
        }
        document.getElementById("requestDeleteForm").reset();
            // reload datatable
            $('#request_table').DataTable().ajax.reload();
            $('#pending_request_table').DataTable().ajax.reload();
    },
      error: () => console.error('GET ajax failed')
  });

});

/**
 * ===========================================================================
 * * SUBMIT REQUEST AJAX
 * ===========================================================================
 */


/**
 * ===========================================================================
 * * REQUEST  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
    jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
        return this.optional(elem) || moment(val).isBefore(moment());
      }, 'Date must be before today');
    // ADD REQUEST VALIDATION
    $('#requestForm').validate({
      debug: false,
      rules: {
        r_patient_first_name: {
          required: true
        },
        r_patient_last_name: {
          required: true
        },
        r_patient_dob: {
          required: true,
          beforeToday: true
        },
        r_patient_gender: {
          required: true
        },
        r_patient_valid_id: {
          required: true,
          extension: "png|jpe?g|gif"
        },
        r_patient_record_id: {
          required: true,
          minlength:8,
          maxlength:8
        },
        r_patient_email: {
          required: true,
          email: true
        },
        r_patient_phone: {
          required: true
        },
        r_requester_first_name: {
          required: true
        },
        r_requester_last_name: {
          required: true
        },
        r_requester_birth_date: {
            required: true,
            beforeToday: true
        },
        r_requester_gender: {
            required: true
        },
        r_requester_valid_id: {
            required: true,
            extension: "png|jpe?g|gif"
        },
        r_requester_letter: {
            required: true,
            extension: "png|jpe?g|gif|pdf"
        },
          r_requester_relationship: {
            required: true
          },
          r_requester_email: {
            required: true,
            email: true
          },
          r_requester_phone: {
            required: true
          },
          r_request_house_number: {
            required: true
          },
          r_request_street: {
            required: true
          },
          r_request_barangay: {
            required: true
          },
          r_request_municipality: {
            required: true
          },
          r_request_province: {
            required: true
          },
          "request_info[]": {
            required: true, 
            minlength: 1 
          },
          reason: {
            required: true,
          },
          r_delivery: {
            required: true,
          },

      },
      messages: {      
        r_patient_first_name: {
          required: "Please provide patient first name",
        },
        r_patient_last_name: {
          required: "Please provide patient last name"
        },
        r_patient_dob: {
          required: "Please provide patient date of birth"
        },
        r_patient_gender: {
          required: "Please provide patient gender"
        },
        r_patient_valid_id: {
          required: "Please provide patient valid id",
          extension: "File must be an image"
        },
        r_patient_record_id: {
          required: "Please provide patient record ID",
          minlength: "Patient record ID must be 8 characters",
          maxlength: "Patient record ID must be 8 characters"
        },
        r_patient_email: {
            required: "Please provide an email",
            email: "Please provide a valid email"
          },
          r_patient_phone: {
            required: "Please provide a contact number"
          },
          r_requester_first_name: {
            required: "Please provide a first name"
          },
          r_requester_last_name: {
            required: "Please provide a last name"
          },
          r_requester_birth_date: {
              required: "Please provide a birth date"
          },
          r_requester_gender: {
              required: "Please provide a gender"
          },
          r_requester_valid_id: {
              required: "Please provide an ID",
              extension: "File must be an image"
          },
          r_requester_letter: {
              required: "Please provide an authorization letter",
              extension: "File must be an image or in pdf format"
          },
            r_requester_relationship: {
              required: "Please select patient relationship"
            },
            r_requester_email: {
              required: "Please provide an email",
              email: "Please provide a valid email"
            },
            r_requester_phone: {
              required: "Please provide a contact number"
            },
            r_request_house_number: {
              required: "Please provide a house number"
            },
            r_request_street: {
              required: "Please provide a street"
            },
            r_request_barangay: {
              required: "Please provide a barangay"
            },
            r_request_municipality: {
              required: "Please provide a municipality"
            },
            r_request_province: {
              required: "Please provide a province"
            },
            "request_info[]": {
              required: "Please select request information", 
              minlength: "Please select atleast one"
            },
            reason: {
              required: "Please select a reason",
            },
            r_delivery: {
              required: "Please select prefered delivery",
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
      submitHandler: () => addRequest()
    });


  });
//   request form process
addRequest = () => {
// $('#requestForm').submit(function(e){


    // var formData = new FormData($('#requestForm')[0]);
    var requester_relationship  = $('#requester_relationship').val();


    var patient_valid_id = $('#patient_valid_id')[0].files[0];
    var fd = new FormData();
    fd.append('file', patient_valid_id);
        
    // console.log(formData);
    // e.preventDefault();

// AJAX FOR PATIENT VALID ID
    $.ajax({
    url: `http://127.0.0.1:8000/request/uploadfile/patientValidID`,
        type: 'POST',
        processData: false,
        contentType: false,
        data: fd,
        success: result => {

        console.log(result.request_id)
        var request_id    = result.request_id;
        

        
        // var formData = new FormData($('#requestForm')[0]);
        var requester_valid_id = $('#requester_valid_id')[0].files[0];
        var fd1 = new FormData();
        fd1.append('file', requester_valid_id);
        
        if ($('#requester_relationship').val() == 'Patient'){
            var patient_first_name      = $('#patient_first_name').val();
                        var patient_last_name       = $('#patient_last_name').val();
                        var patient_record_id       = $('#patient_record_id').val();
                        var patient_email           = $('#patient_email').val();
                        var patient_phone           = $('#patient_phone').val();
                        var patient_birth_date      = $('#patient_birth_date').val();
                        var patient_gender          = $('#patient_gender').val();
                        var requester_first_name    = $('#requester_first_name').val();
                        var requester_last_name     = $('#requester_last_name').val();
                        var requester_relationship  = $('#requester_relationship').val();
                        var requester_birth_date    = $('#requester_birth_date').val();
                        var requester_gender        = $('#requester_gender').val();
                        var requester_email         = $('#requester_email').val();
                        var requester_phone         = $('#requester_phone').val();
                        var house_number            = $('#request_house_number').val();
                        var street                  = $('#request_street').val();
                        var barangay                = $('#request_barangay').val();
                        var municipality            = $('#request_municipality').val();
                        var province                = $('#request_province').val();
                        var request_information     = $('input:checkbox:checked.request_info').map(function(){return this.value; }).get().join(",");
                        var disclosure_reason       = $("input[name='reason']:checked").val();
                        var delivery                = $('#delivery').val();
                        
                        var data = {
                                patient_first_name,
                                patient_last_name,
                                patient_record_id,
                                patient_email,
                                patient_phone,
                                patient_birth_date,
                                patient_gender,
                                requester_first_name,
                                requester_last_name,
                                requester_relationship,
                                requester_birth_date,
                                requester_gender,
                                requester_email,
                                requester_phone,
                                house_number,
                                street,
                                barangay,
                                municipality,
                                province,
                                request_information,
                                disclosure_reason,
                                delivery
                        };
                        
                        // AJAX FOR REQUEST FIELDS       
                        $.ajax({
                            url: `http://127.0.0.1:8000/request/updateRequest/${ request_id }`,
                            type: 'PUT',
                            mode: 'cors',
                            headers: {'Content-Type': 'Application/json'},
                            dataType: 'json',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(data),
                            success: result => {
                                console.log(result)
                                // alert
                                toastr.success('Request Sent')

                                // reload datatable
                                $('#request_table').DataTable().ajax.reload();
                                $('#pending_request_table').DataTable().ajax.reload();
                                window.location.replace(`http://127.0.0.1:8000/requestRecord`);
                                
                            },
                            error: () => console.error('GET ajax failed')
                        });
                                            
                    
        } else {
            // AJAX FOR REQUESTER VALID ID
            $.ajax({
                url: `http://127.0.0.1:8000/request/uploadfile/requesterValidID/${ request_id }`,
                type: 'PUT',
                processData: false,
                contentType: false,
                data: fd1,
                success: result => {
                    
                    
                    console.log(result.request_id)
                    var request_id    = result.request_id;
                    
                
                    var requester_letter = $('#requester_letter')[0].files[0];
                    var fd2 = new FormData();
                    fd2.append('file', requester_letter);
                    // AJAX FOR REQUESTER LETTER        
                    $.ajax({
                        url: `http://127.0.0.1:8000/request/uploadfile/requesterLetter/${ request_id }`,
                        type: 'PUT',
                        processData: false,
                        contentType: false,
                        data: fd2,
                        success: result => {
                            
                            console.log(result.request_id)
                            var request_id    = result.request_id;
                            
                            var patient_first_name      = $('#patient_first_name').val();
                            var patient_last_name       = $('#patient_last_name').val();
                            var patient_record_id       = $('#patient_record_id').val();
                            var patient_email           = $('#patient_email').val();
                            var patient_phone           = $('#patient_phone').val();
                            var patient_birth_date      = $('#patient_birth_date').val();
                            var patient_gender          = $('#patient_gender').val();
                            var requester_first_name    = $('#requester_first_name').val();
                            var requester_last_name     = $('#requester_last_name').val();
                            var requester_relationship  = $('#requester_relationship').val();
                            var requester_birth_date    = $('#requester_birth_date').val();
                            var requester_gender        = $('#requester_gender').val();
                            var requester_email         = $('#requester_email').val();
                            var requester_phone         = $('#requester_phone').val();
                            var house_number            = $('#request_house_number').val();
                            var street                  = $('#request_street').val();
                            var barangay                = $('#request_barangay').val();
                            var municipality            = $('#request_municipality').val();
                            var province                = $('#request_province').val();
                            var request_information     = $('input:checkbox:checked.request_info').map(function(){return this.value; }).get().join(",");
                            var disclosure_reason       = $("input[name='reason']:checked").val();
                            var delivery                = $('#delivery').val();
                            
                            var data = {
                                    patient_first_name,
                                    patient_last_name,
                                    patient_record_id,
                                    patient_email,
                                    patient_phone,
                                    patient_birth_date,
                                    patient_gender,
                                    requester_first_name,
                                    requester_last_name,
                                    requester_relationship,
                                    requester_birth_date,
                                    requester_gender,
                                    requester_email,
                                    requester_phone,
                                    house_number,
                                    street,
                                    barangay,
                                    municipality,
                                    province,
                                    request_information,
                                    disclosure_reason,
                                    delivery
                            };
                            
                            // AJAX FOR REQUEST FIELDS       
                            $.ajax({
                                url: `http://127.0.0.1:8000/request/updateRequest/${ request_id }`,
                                type: 'PUT',
                                mode: 'cors',
                                headers: {'Content-Type': 'Application/json'},
                                dataType: 'json',
                                contentType: 'application/json; charset=utf-8',
                                data: JSON.stringify(data),
                                success: result => {
                                    console.log(result)
                                    // alert
                                    toastr.success('Request Sent')  

                                    // reload datatable
                                    $('#request_table').DataTable().ajax.reload();
                                    $('#pending_request_table').DataTable().ajax.reload();
                                    window.location.replace(`http://127.0.0.1:8000/requestRecord`);
                                    
                                },
                                error: () => console.error('GET ajax failed')
                            });
                            

                        
                        },
                        error: () => console.error('GET ajax failed')
                    });
                                    

                
                },
                error: () => console.error('GET ajax failed')
            });
        
        }
    },
        error: () => console.error('GET ajax failed')
    });

}