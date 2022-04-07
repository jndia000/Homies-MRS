//  CALL LOG DATA TABLE 

var data = $('#patient_call_log_id_log').val();
$(() => {
  viewPatientCallLog = () => {
  $.ajax({
    url: `http://127.0.0.1:8000/record/PatientCallLog/${data}`,
    type: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'Application/json' },
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: result => {
        console.log(result)
        
        
        if(result.length === 0){
            $('#call_log_no_data').html(`<div class="card-body"><br>
                                                        <p class="text-center text-muted history">
                                                            <i class="fas fa-history"></i>&nbsp;&nbsp;No information available
                                                        </p>
                                                    </div>`)
        }else{
          var patient_name = result[0].call_logsFK.call_logFK.patientrecordFK.first_name + ' ' + result[0].call_logsFK.call_logFK.patientrecordFK.last_name
          var current_date, prev_date;
          for(var i=0; i<result.length; i++){
            current_date = result[i].call_log_date;
            if(prev_date != current_date){
              $('#call_log_timeline').append(`
            <div class="time-label">
              <span class="bg-red">${result[i].call_log_date}</span>
            </div>
            <div>
              <i class="fas fa-phone bg-blue"></i>
              <div class="timeline-item">
                <span class="time"><i class="fas fa-clock"></i>${moment(result[i].call_log_date).fromNow()}</span>
                <h3 class="timeline-header"><a href="#">${patient_name}</a> contacted ${result[i].contact_first_name} ${result[i].contact_last_name}</h3>

                <div class="timeline-body">
                ${result[i].call_details}<br><br>
                Contact Number: ${result[i].contact_phone}<br>
                
                Follow up date: ${(result[i].follow_up_date == null)? `<p class="text-secodnary small font-italic">No data available</p>` : moment(result[i].follow_up_date).format("MMMM D, YYYY")}<br>


                </div>
                <div class="timeline-footer">
                    <a  class="btn btn-info btn-sm" 
                        onClick="editCallLogModal('${result[i].call_log_detail_id}','edit')">Edit Call log <i class="fa fa-pen-to-square ml-1"></i></a>
                  </div>
              </div>
            </div>
            `);
            }else{
                $('#call_log_timeline').append(`
              <div>
                <i class="fas fa-phone bg-blue"></i>
                <div class="timeline-item">
                  <span class="time"><i class="fas fa-clock"></i>${moment(result[i].call_log_date).fromNow()}</span>
                  <h3 class="timeline-header"><a href="#">${patient_name}</a> contacted ${result[i].contact_first_name} ${result[i].contact_last_name}</h3>
  
                  <div class="timeline-body">
                  ${result[i].call_details} <br><br>
                  Contact Number: ${result[i].contact_phone}<br>
                  Follow up date: ${moment(result[i].follow_up_date).format("MMMM D, YYYY")}<br>

                  </div>
                  <div class="timeline-footer">
                    <a  class="btn btn-info btn-sm" 
                        onClick="editCallLogModal('${result[i].call_log_detail_id}','edit')">Edit Call log <i class="fa fa-pen-to-square ml-1"></i></a>
                  </div>
                </div>
              </div>
              `);
            }
            
            prev_date =result[i].call_log_date;

            } 
        }
      
      

      
                   
    },
    error: () => console.error('GET ajax failed')
  });
  }
  viewPatientCallLog();

});


console.log(data);
  let call_log_table = $('#call_log_table').DataTable({
    // language: {
    //   paginate: {
    //     next: '<i class="fa fa-caret-right"/>', 
    //     previous: '<i class="fa fa-caret-left"/>'
    //   }
    // },
        serverSide: true,
        processing:true,
        // lengthChange: false,
        pageLength: 10,
        responsive: true,
        autoWidth: false,
    // buttons:[
    //     {extend: 'excel', text: 'Save to Excel File'}
    // ],
    ajax: `/table/allLogs/${ data }`,
    columns:[
        // {data: 'call_log_date'},
        {data: 'call_log_date',
                class: 'text-left',
                render: function ( data, type, row ) {
                  const call_log_date = moment(row.call_log_date).format("MMMM D, YYYY");
                  const humanizedDateResolved = moment(row.call_log_date).fromNow();
                  if(row.call_log_date == null) return `
                                    <div class="d-flex align-items-baseline">
                                        <div>
                                            <div class="text-secodnary small font-italic">No date available</div>
                                        </div>
                                    </div>`;
                  else return `
                                    <div class="d-flex align-items-baseline">
                                        <div>
                                            <div>${call_log_date}</div>
                                            <div class="text-secodnary small">${humanizedDateResolved}</div>
                                        </div>
                                    </div>`;
                }},
    {
      data: 'contact_first_name',
      class: 'text-left',
      render: function (data, type, row) {
        return row.contact_first_name + ' ' + row.contact_last_name;
      }
    },
    { data: 'contact_phone' },
    { data: 'call_details' },
    {
      data: null,
      render: data => {
        const follow_up_date = moment(data.follow_up_date).format("MMMM D, YYYY");
        const humanizedfollowup = moment(data.follow_up_date).fromNow();
        if (data.follow_up_date == null) return `
                                  <div class="d-flex align-items-baseline">
                                      <div>
                                          <div class="text-secodnary small font-italic">No date available</div>
                                      </div>
                                  </div>`;
        else return `
                            <div class="d-flex align-items-baseline">
                                <div>
                                    <div>${follow_up_date}</div>
                                    <div class="text-secodnary small">${humanizedfollowup}</div>
                                </div>
                            </div>
                        `;
      }
    },
    {
      data: null,
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
                                onClick="editCallLogModal('${data.call_log_detail_id}','edit')">
                            <div style="width: 2rem;">
                              <i class="fas fa-edit mr-1"></i>
                            </div>
                            <div>Edit Call Log</div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div role="button"
                             data-toggle="modal" 
                             data-target="#view_call_logs">
                             
                        <div class="dropdown-item d-flex"
                                role="button"
                                onClick="editCallLogModal('${data.call_log_detail_id}','view')">
                            <div style="width: 2rem;">
                            <i class="fas fa-file-alt mr-1"></i>
                            </div>
                            <div>View Call Log</div>
                        </div>
                        <div role="button"
                             data-toggle="modal" 
                             data-target="#view_call_logs">
                    </div>
                </div>
                `
      }
    }

  ],
  initComplete: function () {
    call_log_table.buttons().container().appendTo('#log_table_wrapper .col-md-6:eq(0)')
  }
})

// VIEW CALL LOGS
function editCallLogModal(call_log_detail_id, type) {
  console.log(call_log_detail_id);

  $.ajax({
    url: `http://127.0.0.1:8000/record/ShowCallLog/${call_log_detail_id}`,
    type: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'Application/json' },
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    // data: JSON.stringify(diagnosis_id),
    success: result => {
      console.log(result)
      if (type == 'edit') {
        // set field value
        $("#edit_call_log_date").val(result.call_log_date);
        $("#edit_contact_first_name").val(result.contact_first_name);
        $("#edit_contact_last_name").val(result.contact_last_name);
        $("#edit_contact_phone").val(result.contact_phone);
        $('#edit_call_details').val(result.call_details);
        $("#edit_follow_up_date").val(result.follow_up_date);
        $('#edit_call_logs_p').val(result.call_log_detail_id);
        $("#edit_call_logs").modal('show');
      }
      else if (type == 'view') {
        // set field value
        $('#v_date').html(moment(result.call_log_date).format("MMMM D, YYYY"));
        $('#v_name').html(result.contact_first_name + ', ' +
          result.contact_last_name);
        $('#v_phone_number').html(result.contact_phone);
        $('#v_call_details').html(result.call_details);
        if(result.follow_up_date){
          $('#v_follow-up-date').html(moment(result.follow_up_date).format("MMMM D, YYYY"));
        } else{
          $('#v_follow-up-date').html(`
                                              <span class="text-secodnary small font-italic">No date available</span>
                                          `);
        }
        $("#view_call_logs").modal('show');
      }
    },
    error: () => console.error('GET ajax failed')
  });
}

/**
 * ===========================================================================
 * * CALL LOG  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
  $(function () {
    jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
      return this.optional(elem) || moment(val).isBefore(moment());
    }, 'Date must be before today');
    // ADD CALL LOGS VALIDATION
    $('#addPatientCallLogForm').validate({
      debug: false,
      rules: {
        date: {
          required: true,
          beforeToday: true
        },
        first_name: {
          required: true,
        },
        last_name: {
          required: true,
        },
        phone_number: {
          required: true,
          // maxlength: 11,
          // minlength: 11
        },
        call_details: {
          required: true,
          minlength: 5
        }
      },
      messages: {
        date: {
          required: "Please provide a Date",
        },
        first_name: {
          required: "Please provide a First Name",
        },
        last_name: {
          required: "Please provide a Last Name",
        },
        phone_number: {
          required: "Please provide a Phone Number",
          // maxlength: "Must be at least 11 characters long",
          // minlength: "Must be at least 11 characters long"
        },
        call_details: {
          required: "Please provide a Call detail",
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
      submitHandler: () => addPatientCallLog()
      });
    });


// ADD PATIENT CALL LOG
addPatientCallLog = () => {

    var call_log_date        = $('#call_log_date').val();
    var contact_first_name   = $('#contact_first_name').val();
    var contact_last_name    = $('#contact_last_name').val();
    var contact_phone        = $('#contact_phone').val();
    var call_details         = $('textarea#call_details').val();
    var follow_up_date       = $('#follow_up_date').val();
    var patient_call_log_id  = $('#patient_call_log_id').val();


  var data = { call_log_date, contact_first_name, contact_last_name, contact_phone, call_details, follow_up_date, patient_call_log_id };
  console.log(data);
  // e.preventDefault();

  $.ajax({
    url: 'http://127.0.0.1:8000/record/logDetail',
    type: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'Application/json' },
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    success: result => {
      console.log(result)
      toastr.success('Call Log Added')
      // hide form modal
      $("#patient_call_log").modal('hide');
      // hide no info available block
      // $("#nocontent_patient_call_log").hide();
      // remove form data
      document.getElementById("addPatientCallLogForm").reset();
      // reload datatable
      $('#call_log_table').DataTable().ajax.reload();
      // reload timeline
      viewPatientCallLog();
      location.reload();
    },
    error: () => console.error('GET ajax failed')
  });
}
});



/**
 * ===========================================================================
 * * CALL LOG  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
    $(function () {
      jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
        return this.optional(elem) || moment(val).isBefore(moment());
      }, 'Date must be before today');
      // ADD CALL LOGS VALIDATION
      $('#editCallLogForm').validate({
        debug: false,
        rules: {  
          edit_date: {
            required: true,
            beforeToday: true
          },
          edit_first_name: {
            required: true,
          },
          edit_last_name: {
            required: true,
          },
          edit_phone_number: {
            required: true,
            // maxlength: 11,
            // minlength: 11
          },
          edit_call_details: {
            required: true,
            minlength: 5
          }
        },
        messages: {
          edit_date: {
            required: "Please provide a Date",
          },
          edit_first_name: {
            required: "Please provide a First Name",
          },
          edit_last_name: {
            required: "Please provide a Last Name",
          },
          edit_phone_number: {
            required: "Please provide a Phone Number",
            // maxlength: "Must be at least 11 characters long",
            // minlength: "Must be at least 11 characters long"
          },
          edit_call_details: {
            required: "Please provide a Call detail",
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
        submitHandler: () => editPatientCallLog()
        });
      });
  



// UPDATE CALL LOG
editPatientCallLog = () => {
    var call_log_date      = $('#edit_call_log_date').val();
    var contact_first_name = $('#edit_contact_first_name').val();
    var contact_last_name  = $('#edit_contact_last_name').val();
    var contact_phone      = $('#edit_contact_phone').val();
    var call_details       = $('#edit_call_details').val();
    var follow_up_date     = $('#edit_follow_up_date').val();
  
  var data = {
    call_log_date,
    contact_first_name,
    contact_last_name,
    contact_phone,
    call_details,
    follow_up_date
  };
  console.log(data);
  // e.preventDefault();
  const call_log_detail_id = $('#edit_call_logs_p').val();
  console.log(call_log_detail_id)
  $.ajax({
    url: `http://127.0.0.1:8000/record/updateCallLog/${call_log_detail_id}`,
    type: 'PUT',
    mode: 'cors',
    headers: { 'Content-Type': 'Application/json' },
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),

    success: result => {
      console.log(result)
      // alert
      toastr.success('Patient Call Log Updated')
      // hide modal
      $("#edit_call_logs").modal('hide');
      // remove data in form
      document.getElementById("editCallLogForm").reset();
        
      // reload datatable
      $('#call_log_table').DataTable().ajax.reload();
      // reload timeline
      viewPatientCallLog();
      location.reload();
    },
    error: () => console.error('Get ajax failed')
  });
}
});