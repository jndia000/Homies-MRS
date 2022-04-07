// DATATABLE
var data = $('#patient_id_record').val();
// console.log(data);
let discharge_table = $('#discharge_table').DataTable({
    serverSide: true,
    processing: true,
    pageLength: 10,
    buttons: true,
    responsive: true,
    autoWidth: false,
    ajax: `/table/discharge_list/${ data }`,
    columns: [
        { data: 'reason_of_admittance' },
        { data: 'diagnosis_at_admittance' },
        { data: 'treatment_summary' },
        {
            data: null,
            render: data => {
                const ending_date = moment(data.ending_date).format("MMMM D, YYYY");
                const humanizedDateResolved = moment(data.ending_date).fromNow();
                if (data.ending_date == null) return `
                                        <div class="d-flex align-items-baseline">
                                            <div>
                                                <div class="text-secodnary small font-italic">No date available</div>
                                            </div>
                                        </div>`;
                else return `
                                        <div class="d-flex align-items-baseline">
                                            <div>
                                                <div>${ending_date}</div>
                                                <div class="text-secodnary small">${humanizedDateResolved}</div>
                                            </div>
                                        </div>`;
            }
        },
        {data: null,
            render: data => {
            if(data.active_status == 'Discharged') return `
                  <div class="badge badge-primary p-2 w-100" >${ data.active_status }</div>
                  `;
            else if (data.active_status == 'Still Patient') return  `
                <div class="badge badge-warning p-2 w-100">${ data.active_status }</div>`;
            else if (data.active_status == 'Expected to Return') return  `
                <div class="badge badge-danger p-2 w-100">${ data.active_status }</div>`;
            else if (data.active_status == 'Expired') return  `
                <div class="badge badge-dark p-2 w-100">${ data.active_status }</div>`;
            else return  `
                <div class="badge badge-warning p-2 w-100">${ data.active_status }</div>`;
          }},
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
                                onClick="editPatientDischargeModal('${data.discharge_id}','view')"
                        >
                            <div style="width: 2rem;">
                                <i class="fas fa-file-alt mr-1"></i>
                            </div>
                            <div>View Discharge Record</div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item d-flex" 
                                role="button"
                                onClick="editPatientDischargeModal('${data.discharge_id}','edit')"
                                >
                            <div style="width: 2rem;">
                                <i class="fas fa-edit mr-1"></i>
                            </div>
                            <div>Edit Discharge Record</div>
                        </div>
                    </div>
                </div>
                `
            }
        }


    ],
    initComplete: function () {
        discharge_table.buttons().container().appendTo('#discharge_table_wrapper .col-md-6:eq(0)')
    }
})


/**
 * ===========================================================================
 * * DISCHARGE  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // ADD DISCHARGE RESULT VALIDATION
  jQuery.validator.addMethod("afterToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isAfter(moment());
  }, 'Date must be after today');
  jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be before today');
  $('#addDischargeForm').validate({
    debug: false,
    rules: {
      reason_of_admittance: {
        required: true
      },
      diagnosis_at_admittance: {
        required: true
      },
      date_admitted: {
        required: true,
        beforeToday: true
      },
      treatment_summary: {
        required: true
      },
      discharge_date: {
        required: true, 
        afterToday: true
      },
      doc_id: {
        required: true
      },
      discharge_diagnosis: {
        required: true
      },
      status: {
        required: true
      },
      further_treatment_plan: {
        required: true
      },
      next_check_up_date: {
        required: true,
        afterToday: true
      },
      client_consent_approval: {
        required: true
      },
      ending_date: {
        required: true,
        afterToday: true
      }
    },
    messages: {      
      reason_of_admittance: {
        required: "Please provide a reason of admittance"
      },
      diagnosis_at_admittance: {
        required: "Please provide a reason of diagnosis admittance"
      },
      date_admitted: {
        required: "Please provide a date admitted"
      },
      treatment_summary: {
        required: "Please provide a treatment summary"
      },
      discharge_date: {
        required: "Please provide a discharge date"
      },
      doc_id: {
        required: "Please provide a physician"
      },
      discharge_diagnosis: {
        required: "Please provide a discharge diagnosis"
      },
      status: {
        required: "Please provide a status"
      },
      further_treatment_plan: {
        required: "Please provide a further treatment plan"
      },
      next_check_up_date: {
        required: "Please provide a next check up date"
      },
      client_consent_approval: {
        required: "Please provide a client consent approval"
      },
      ending_date: {
        required: "Please provide the ending date"
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
    submitHandler: () => addPatientDischarge()
  });


});

// ADD PATIENT DISCHARGE
// $('#AddPatientDischarge').click(function(e){
  addPatientDischarge = () => {

    // var valid = this.form.checkValidity();

    // if(valid){
      var reason_of_admittance     = $('#reason_of_admittance').val();
      var diagnosis_at_admittance  = $('#diagnosis_at_admittance').val();
      var date_admitted            = $('#date_admitted').val();
      var treatment_summary        = $('#treatment_summary').val();
      var discharge_date           = $('#discharge_date').val();
      var physician_approved       = $('#doc_id_discharge').val();
      var discharge_diagnosis      = $('#discharge_diagnosis').val();
      var further_treatment_plan   = $('#further_treatment_plan').val();
      var next_check_up_update     = $('#next_check_up_date').val();
      var client_consent_approval  = $('#client_consent_approval').val();
      var ending_date              = $('#ending_date').val();
      var active_status            = $('#active_status').val();
      var patient_id               = $('#patient_discharge_id').val();

    // }
    var data = { reason_of_admittance,
                 diagnosis_at_admittance,
                 date_admitted,
                 treatment_summary,
                 discharge_date,
                 physician_approved,
                 discharge_diagnosis,
                 further_treatment_plan,
                 next_check_up_update,
                 client_consent_approval,
                 ending_date,
                 active_status,
                 patient_id
                };
    

    console.log(data);
    // e.preventDefault();

    $.ajax({
        url: 'http://127.0.0.1:8000/discharge/AddPatientDischarge',
        type: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
            console.log(result)
            toastr.success('Patient Discharge Added')
            $("#patient_discharge").modal('hide');
            // hide no info available block
            $("#nocontent_discharge").hide();
            document.getElementById("addDischargeForm").reset();    
            
            // reload datatable
            $('#discharge_table').DataTable().ajax.reload(); 
      },
        error: () => console.error('GET ajax failed')
    });

}

// VIEW DISCHARGE
function editPatientDischargeModal(discharge_id, Type) {
    console.log(discharge_id);

    $.ajax({
        url: `http://127.0.0.1:8000/discharge/dischargepatient/${discharge_id}`,
        type: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'Application/json' },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(diagnosis_id),
        success: result => {
            console.log(result)
            console.log(Type)
            if (Type == 'edit') {
                // set field value
                $("#edit_reason_of_admittance").val(result.reason_of_admittance);
                $("#edit_diagnosis_at_admittance").val(result.diagnosis_at_admittance);
                $("#edit_date_admitted").val(result.date_admitted);
                $('#edit_treatment_summary').val(result.treatment_summary);
                $('#edit_discharge_date').val(result.discharge_date);
                $('#edit_doc_id_discharge').val(result.physician_approved);
                $('#edit_discharge_diagnosis').val(result.discharge_diagnosis);
                $('#edit_further_treatment_plan').val(result.further_treatment_plan);
                $('#edit_next_check_up_date').val(result.next_check_up_date);
                $('#edit_client_consent_approval').val(result.client_consent_approval);
                $('#edit_discharge_medication_name').val(result.medication);
                $('#edit_discharge_dosage').val(result.dosage);
                $('#edit_discharge_frequency').val(result.frequency);
                $('#edit_ending_date').val(result.ending_date);
                $('#discharge_edit_active_status').val(result.active_status);
                $('#edit_patient_discharge_id').val(result.discharge_id);

                $("#edit_patient_discharge").modal('show');
            } 
            else if (Type == 'view') {
                // set field value
                $("#dp_reason_of_admittance").html(result.reason_of_admittance);
                $("#dp_diagnosis_at_admittance").html(result.diagnosis_at_admittance);
                var date_admitted = moment(result.date_admitted).format("MMMM D, YYYY");
                var humanizedDateAdmitted = moment(result.date_admitted).fromNow();
                $("#dp_date_admitted").html(`<div class="d-flex align-items-baseline">
                                                <div>
                                                  <div>${date_admitted}</div>
                                                  <div class="text-secondary small">Occured ${humanizedDateAdmitted}</div>
                                                </div>
                                              </div>`);
                if(result.discharged_date == null){
                  $("#dp_discharge_date").html(`<div class="text-secondary small font-italic">No Date Discharge</div>`)
                }else{
                  var discharge_date = moment(result.discharge_date).format("MMMM D, YYYY");
                  var humanizedDischargeDate = moment(result.discharge_date).fromNow();
                $('#dp_discharge_date').html(`<div class="d-flex align-items-baseline">
                                                <div>
                                                    <div>${discharge_date}</div>
                                                    <div class="text-secondary small">Occured ${humanizedDateResolved}</div>
                                                </div>
                                            </div>`);
                }
                $('#dp_treatment_summary').html(result.treatment_summary);

                $('#dp_doc_id_discharge').html('Dr. '+ result.dischargeFK.last_name+ ', ' + result.dischargeFK.first_name + ' ' + result.dischargeFK.middle_name);
                $('#dp_discharge_diagnosis').html(result.discharge_diagnosis);
                $('#dp_further_treatment_plan').html(result.further_treatment_plan);
                var next_check_up_date
                
                $('#dp_next_check_up_date').html(moment(result.next_check_up_date).format("MMMM D, YYYY"));
                $('#dp_client_consent_approval').html(result.client_consent_approval);
                // $('#dp_medication').html(result.medication);
                // $('#dp_dosage').html(result.dosage);
                // $('#dp_frequency').html(result.frequency);
                $('#dp_ending_date').html(moment(result.ending_date).format("MMMM D, YYYY"));
                $('#dp_active_status').html(result.active_status);
               
               
               
               
               
                //show modal
                $("#view_patient_discharge").modal('show');
            }
        },
        error: () => console.error('GET ajax failed')
    });


}
/**
 * ===========================================================================
 * * DISCHARGE  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // EDIT DISCHARGE VALIDATION
  jQuery.validator.addMethod("afterToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isAfter(moment());
  }, 'Date must be after today');
  jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be before today');
  $('#editDischargeForm').validate({
    debug: false,
    rules: {
      edit_reason_of_admittance: {
        required: true
      },
      edit_diagnosis_at_admittance: {
        required: true
      },
      edit_date_admitted: {
        required: true,
        beforeToday: true
      },
      edit_treatment_summary: {
        required: true
      },
      edit_discharge_date: {
        required: true,
        afterToday: true
      },
      edit_doc_id: {
        required: true
      },
      edit_discharge_diagnosis: {
        required: true
      },
      edit_status: {
        required: true
      },
      edit_further_treatment_plan: {
        required: true
      },
      edit_next_check_up_date: {
        required: true,
        afterToday: true
      },
      edit_client_consent_approval: {
        required: true
      },
      edit_discharge_medication_name: {
        required: true
      },
      edit_discharge_dosage: {
        required: true
      },
      edit_discharge_frequency: {
        required: true
      },
      edit_ending_date: {
        required: true,
        afterToday: true
      }
    },
    messages: {      
      edit_reason_of_admittance: {
        required: "Please provide a reason of admittance"
      },
      edit_diagnosis_at_admittance: {
        required: "Please provide a reason of diagnosis admittance"
      },
      edit_date_admitted: {
        required: "Please provide a date admitted"
      },
      edit_treatment_summary: {
        required: "Please provide a treatment summary"
      },
      edit_discharge_date: {
        required: "Please provide a discharge date"
      },
      edit_doc_id: {
        required: "Please provide a physician"
      },
      edit_discharge_diagnosis: {
        required: "Please provide a discharge diagnosis"
      },
      edit_status: {
        required: "Please provide a status"
      },
      edit_further_treatment_plan: {
        required: "Please provide a further treatment plan"
      },
      edit_next_check_up_date: {
        required: "Please provide a next check up date"
      },
      edit_client_consent_approval: {
        required: "Please provide a client consent approval"
      },
      edit_discharge_medication_name: {
        required: "Please provide a medication"
      },
      edit_discharge_dosage: {
        required: "Please provide a discharge dosage"
      },
      edit_discharge_frequency: {
        required: "Please provide a frequency"
      },
      edit_ending_date: {
        required: "Please provide a ending date"
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
    submitHandler: () => updateDischarge()
  });


});

// UPDATE DISCHARGE
// $('#updateDischarge').click(function (e) {
  updateDischarge = () => {

    // var valid = this.form.checkValidity();

    // if (valid) {
        var reason_of_admittance = $('#edit_reason_of_admittance').val();
        var diagnosis_at_admittance = $('#edit_diagnosis_at_admittance').val();
        var date_admitted = $('#edit_date_admitted').val();
        var treatment_summary = $('#edit_treatment_summary').val();
        var discharge_date = $('#edit_discharge_date').val();
        var physician_approved = $('#edit_doc_id_discharge').val();
        var discharge_diagnosis = $('#edit_discharge_diagnosis').val();
        var further_treatment_plan = $('#edit_further_treatment_plan').val();
        var next_check_up_date = $('#edit_next_check_up_date').val();
        var client_consent_approval = $('#edit_client_consent_approval').val();
        var ending_date = $('#edit_ending_date').val();
        var active_status = $('#discharge_edit_active_status').val();
    // }
    var data = {
        reason_of_admittance,
        diagnosis_at_admittance,
        date_admitted,
        treatment_summary,
        discharge_date,
        physician_approved,
        discharge_diagnosis,
        further_treatment_plan,
        next_check_up_date,
        client_consent_approval,
        ending_date,
        active_status
    };
    console.log(data);
    // e.preventDefault();
    const discharge_id = $('#edit_patient_discharge_id').val();

    $.ajax({
        url: `http://127.0.0.1:8000/discharge/updateDischarge/${discharge_id}`,
        type: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'Application/json' },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),

        success: result => {
            console.log(result)
            // alert
            toastr.success('Patient Discharge Updated')
            // hide modal
            $("#edit_patient_discharge").modal('hide');
            // remove data in form
            document.getElementById("editDischargeForm").reset();

            //diagnostic result
            $('#dp_reason_of_admittance').html(result.reason_of_admittance);
            $('#dp_diagnosis_at_admittance').html(result.diagnosis_at_admittance);
            $('#dp_date_admitted').html(result.date_admitted);
            $('#dp_treatment_summary').html(result.treatment_summary);
            $('#dp_discharge_date').html(result.discharge_date);
            $('#dp_doc_id_discharge').html(result.physician_approved);
            $('#dp_discharge_diagnosis').html(result.physician_approved);
            $('#dp_further_treatment_plan').html(result.further_treatment_plan);
            $('#dp_next_check_up_date').html(result.next_check_up_date);
            $('#dp_client_consent_approval').html(result.client_consent_approval);
            $('#dp_ending_date').html(result.ending_date);
            $('#dp_active_status').html(result.active_status);

            // reload datatable
            $('#discharge_table').DataTable().ajax.reload();
        },
        error: () => console.error('Get ajax failed')
    });

}


// $(function () {
//     // ADD DISCHARGE VALIDATION
//       $('#addDischargeForm').validate({
//         debug: true,
//         rules: {
//             reason_of_admittance: {
//             required: true,
//             minlength: 5
//           },
//           diagnosis_at_admittance: {
//             required: true,
//             minlength: 5
//           },
//           date_admitted: {
//             required: true,
//           },
//           treatment_summary: {
//             required: true,
//             minlength: 5
//           },
//           discharge_date: {
//             required: true,
//           },
//           doc_id: {
//             required: true,
//           },
//           discharge_diagnosis: {
//             required: true,
//             minlength: 5
//           },
//           status: {
//             required: true,
//           },
//           further_treatment_plan: {
//             required: true,
//             minlength: 5
//           },
//           next_check_up_date: {
//             required: true,
//           },
//           client_consent_approval: {
//             required: true,
//             minlength: 5
//           },
//           discharge_medication: {
//             required: true,
//           },
//           discharge_dosage: {
//             required: true,
//           },
//           discharge_frequency: {
//             required: true,
//           },
//           ending_date: {
//             required: true,
//           }
//         },
//         messages: {      
//           reason_of_admittance: {
//             required: "Please provide a Reason of Admittance",
//             minlength: "Must be at least 5 characters long"
//           },
//           diagnosis_at_admittance: {
//             required: "Please provide a Diagnosis at Admittance",
//             minlength: "Must be at least 5 characters long"
//           },
//           date_admitted: {
//             required: "Please provide the date of admission"
//           },
//           treatment_summary: {
//             required: "Please provide a treatment summary",
//             minlength: "Must be at least 5 characters long"
//           },
//           discharge_date: {
//             required: "Please provide the discharge date"
//           },
//           doc_id: {
//             required: "Please provide a Physician"
//           },
//           discharge_diagnosis: {
//             required: "Please provide a discharge diagnosis",
//             minlength: "Must be at least 5 characters long"
//           },
//           status: {
//             required: "Please provide a status"
//           },
//           further_treatment_plan: {
//             required: "Please provide a treatment plan",
//             minlength: "Must be at least 5 characters long"
//           },
//           next_check_up_date: {
//             required: "Please provide a next checkup date"
//           },
//           client_consent_approval: {
//             required: "Please provide a client consent approval",
//             minlength: "Must be at least 5 characters long"
//           },
//           discharge_medication: {
//             required: "Please provide a medication",
//           },
//           discharge_dosage: {
//             required: "Please provide the dosage",
//           },
//           discharge_frequency: {
//             required: "Please provide the frequency"
//           },
//           ending_date: {
//             required: "Please provide the ending date"
//           }
//         },
//         errorElement: 'div',
//         errorPlacement: function (error, element) {
//           error.addClass('invalid-feedback');
//           element.closest('.form-group').append(error);
//         },
//         highlight: function (element, errorClass, validClass) {
//           $(element).addClass('is-invalid');
//         },
//         unhighlight: function (element, errorClass, validClass) {
//           $(element).removeClass('is-invalid');
//         },
//         form: '#addDischargeForm',
//         submitHandler: function(form) { // <- pass 'form' argument in
//           $(".submit").attr("disabled", true);
//           $(form).submit(); // <- use 'form' argument here.
//       }
//       });
//     });

    // $(function () {
    //   // EDIT DISCHARGE VALIDATION
    //     $('#editDischargeForm').validate({
    //       debug: true,
    //       rules: {
    //         edit_reason_of_admittance: {
    //           required: true,
    //           minlength: 5
    //         },
    //         edit_diagnosis_at_admittance: {
    //           required: true,
    //           minlength: 5
    //         },
    //         edit_date_admitted: {
    //           required: true,
    //         },
    //         edit_treatment_summary: {
    //           required: true,
    //           minlength: 5
    //         },
    //         edit_discharge_date: {
    //           required: true,
    //         },
    //         edit_doc_id_discharge: {
    //           required: true,
    //         },
    //         edit_discharge_diagnosis: {
    //           required: true,
    //           minlength: 5
    //         },
    //         edit_active_status: {
    //           required: true,
    //         },
    //         edit_further_treatment_plan: {
    //           required: true,
    //           minlength: 5
    //         },
    //         edit_next_check_up_date: {
    //           required: true,
    //         },
    //         edit_client_consent_approval: {
    //           required: true,
    //           minlength: 5
    //         },
    //         edit_discharge_medication_name: {
    //           required: true,
    //         },
    //         edit_discharge_dosage: {
    //           required: true,
    //         },
    //         edit_discharge_frequency: {
    //           required: true,
    //         },
    //         edit_ending_date: {
    //           required: true,
    //         }
    //       },
    //       messages: {      
    //         edit_reason_of_admittance: {
    //           required: "Please provide a Reason of Admittance",
    //           minlength: "Must be at least 5 characters long"
    //         },
    //         edit_diagnosis_at_admittance: {
    //           required: "Please provide a Diagnosis at Admittance",
    //           minlength: "Must be at least 5 characters long"
    //         },
    //         edit_date_admitted: {
    //           required: "Please provide the date of admission"
    //         },
    //         edit_treatment_summary: {
    //           required: "Please provide a treatment summary",
    //           minlength: "Must be at least 5 characters long"
    //         },
    //         edit_discharge_date: {
    //           required: "Please provide the discharge date"
    //         },
    //         edit_doc_id_discharge: {
    //           required: "Please provide a Physician"
    //         },
    //         edit_discharge_diagnosis: {
    //           required: "Please provide a discharge diagnosis",
    //           minlength: "Must be at least 5 characters long"
    //         },
    //         edit_active_status: {
    //           required: "Please provide a status"
    //         },
    //         edit_further_treatment_plan: {
    //           required: "Please provide a treatment plan",
    //           minlength: "Must be at least 5 characters long"
    //         },
    //         edit_next_check_up_date: {
    //           required: "Please provide a next checkup date"
    //         },
    //         edit_client_consent_approval: {
    //           required: "Please provide a client consent approval",
    //           minlength: "Must be at least 5 characters long"
    //         },
    //         edit_discharge_medication_name: {
    //           required: "Please provide a medication",
    //         },
    //         edit_discharge_dosage: {
    //           required: "Please provide the dosage",
    //         },
    //         edit_discharge_frequency: {
    //           required: "Please provide the frequency"
    //         },
    //         edit_ending_date: {
    //           required: "Please provide the ending date"
    //         }
    //       },
    //       errorElement: 'div',
    //       errorPlacement: function (error, element) {
    //         error.addClass('invalid-feedback');
    //         element.closest('.form-group').append(error);
    //       },
    //       highlight: function (element, errorClass, validClass) {
    //         $(element).addClass('is-invalid');
    //       },
    //       unhighlight: function (element, errorClass, validClass) {
    //         $(element).removeClass('is-invalid');
    //       },
    //       form: '#editDischargeForm',
    //       submitHandler: function(form) { // <- pass 'form' argument in
    //         $(".submit").attr("disabled", true);
    //         $(form).submit(); // <- use 'form' argument here.
    //     }
    //     });
      // });