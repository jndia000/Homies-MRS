/**
 * ===========================================================================
 * * NOTE ENTRY  = DATATABLE
 * ===========================================================================
 */ 
// DATATABLE
var data = $('#patient_record_id_record').val();
var doc_id = localStorage.getItem('doc_id');
  let note_table = $('#note_table').DataTable({
        serverSide: true,
        processing:true,
        pageLength: 10,
        buttons: true,
        responsive: true,
        autoWidth: false,
    ajax: `/table/note_list/${ data }/${ doc_id }`,
    columns:[
      {data: 'consultation_date',
                class: 'text-left',
                render: function ( data, type, row ) {
                  const consultation_date = moment(row.consultation_date).format("MMMM D, YYYY");
                  const humanizedDateResolved = moment(row.consultation_date).fromNow();
                  if(row.consultation_date == null) return `
                                    <div class="d-flex align-items-baseline">
                                        <div>
                                            <div class="text-secodnary small font-italic">No date available</div>
                                        </div>
                                    </div>`;
                  else return `
                                    <div class="d-flex align-items-baseline">
                                        <div>
                                            <div>${consultation_date}</div>
                                            <div class="text-secodnary small">${humanizedDateResolved}</div>
                                        </div>
                                    </div>`;
                }},
      {data: 'reason_for_consultation'},
      {data: 'physical_examination'},
      {data: 'impression'},
      {data: null,
        render: data => {
          const recommendation = data.recommendation;
          if(data.recommendation == "") return `
                            <div class="d-flex align-items-baseline">
                                <div>
                                    <div class="text-secodnary small font-italic">No data available</div>
                                </div>
                            </div>`;
          else return `
                         ${recommendation}`;
        }},
      {data: null,
        render: data => {
          const next_appointment = moment(data.next_appointment).format("MMMM D, YYYY");
          const humanizedDateResolved = moment(data.next_appointment).fromNow();
          if(data.next_appointment == null) return `
                            <div class="d-flex align-items-baseline">
                                <div>
                                    <div class="text-secodnary small font-italic">No date available</div>
                                </div>
                            </div>`;
          else return `
                            <div class="d-flex align-items-baseline">
                                <div>
                                    <div>${next_appointment}</div>
                                    <div class="text-secodnary small">${humanizedDateResolved}</div>
                                </div>
                            </div>`;
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
                          onClick="editProgressNoteModal('${data.progress_note_id}', 'view')">
                      <div style="width: 2rem;">
                        <i class="fas fa-file-alt mr-1"></i>
                      </div>
                      <div>View Progress Note</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div role="button"
                       data-toggle="modal" 
                       data-target="#view_allergen_modal">
                       </div>
                       
                  <div class="dropdown-item d-flex"
                          role="button"
                          onClick="editProgressNoteModal('${data.progress_note_id}', 'edit')">
                      <div style="width: 2rem;">
                      <i class="fas fa-edit mr-1"></i>
                      </div>
                      <div>Edit Progress Note</div>
                  </div>
                  <div role="button"
                       data-toggle="modal" 
                       data-target="#view_diagnostic_result">
              </div>
          </div>
          `
        }}
       
    ],
    initComplete: function(){
      note_table.buttons().container().appendTo('#note_table_wrapper .col-md-6:eq(0)')
    }
})



/**
 * ===========================================================================
 * * PROGRESS NOTES  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
  $(function () {
    // ADD CLINICAL NOTES VALIDATION
    jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
      return this.optional(elem) || moment(val).isBefore(moment());
    }, 'Date must be today or before today');
      $('#addEntryForm').validate({
        debug: false,
        rules: {
          clinical_doc_ic: {
            required: true,
          },
          reason_for_consultation: {
            required: true,
            minlength: 5
          },
          physical_examination: {
            required: true,
            minlength: 5
          },
          consultation_date: {
            required: true,
            beforeToday: true,
          },
          impression: {
            required: true,
            minlength: 5
          }
        },
        messages: {      
          clinical_doc_ic: {
            required: "Please provide a Physician"
          },
          reason_for_consultation: {
            required: "Please provide a Reason for Consultation",
            minlength: "Must be at least 5 characters long"
          },
          physical_examination: {
            required: "Please provide a Physical Examination",
            minlength: "Must be at least 5 characters long"
          },
          consultation_date: {
            required: "Please provide a Consultation Date",
          },
          impression: {
            required: "Please provide an Impression"
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
        submitHandler: () => addProgressNotes()
    });
  });
// ADD CLINICAL NOTES
addProgressNotes = () => {

                  var reason_for_consultation = $('textarea#reason_for_consultation').val();
                  var doc_id                  = $('#clinical_doc_id').val();
                  var patient_record_id       = $('#clinical_notes_id').val();
                  var physical_examination    = $('textarea#physical_examination').val();
                  var impression              = $('textarea#impression').val();
                  var recommendation          = $('textarea#recommendation').val();
                  var next_appointment        = $('#next_appointment').val();
                  var consultation_date       = $('#consultation_date').val();
                
                var data = { doc_id, patient_record_id, reason_for_consultation, physical_examination, impression, recommendation, next_appointment, consultation_date };

                console.log(data);
                // e.preventDefault();

                $.ajax({
                  url: 'http://127.0.0.1:8000/record/medicalProgressNote',
                    type: 'POST',
                    mode: 'cors',
                    headers: {'Content-Type': 'Application/json'},
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    success: result => {
                      console.log(result)
                      toastr.success('Clinical Notes Updated')
                      $("#clinical_notes").modal('hide');
                      // hide no info available block
                      $("#nocontent_entry").hide(); 
                      document.getElementById("addEntryForm").reset();
                      
                      // reload datatable
                      $('#note_table').DataTable().ajax.reload(); 
                  },
                    error: () => console.error('GET ajax failed')
                });
              }
            });
         
                
// VIEW CLINICAL NOTES
function editProgressNoteModal(progress_note_id, type){
  console.log(progress_note_id);

  $.ajax({
      url: `http://127.0.0.1:8000/record/ShowProgressNote/${progress_note_id}`,
      type: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      // data: JSON.stringify(prescription_id),
      success: result => {
          console.log(result)
          if (type == 'edit'){
          // set field value
          $("#edit_reason_for_consultation_s").val(result.reason_for_consultation);
          $("#edit_physical_examination_s").val(result.physical_examination);
          $("#edit_impression_s").val(result.impression);
          $("#edit_recommendation_s").val(result.recommendation);
          $("#edit_next_appointment_s").val(result.next_appointment);
          $("#edit_consultation_date_s").val(result.consultation_date);
          $("#u_progress_note_id").val(result.progress_note_id);
          // show modal
          $("#edit_progress_note").modal('show');
          }
          else if(type == 'view'){

            // set field value
            $("#v_reason_for_consultation").html(result.reason_for_consultation);
            $("#v_physical_examination").html(result.physical_examination);
            $("#v_impression").html(result.impression);
            if (result.recommendation == ""){
              $("#v_recommendation").html(`<div class="text-secodnary small font-italic">No data available</div>`);
            }
            else 
            {
              $("#v_recommendation").html(moment(result.recommendation).format("MMMM D, YYYY"));
            }
            $("#v_consultation_date").html(moment(result.consultation_date).format("MMMM D, YYYY"));
            if (result.next_appointment == null){
              $("#v_next_appointment").html(`<div class="text-secodnary small font-italic">No data available</div>`);
            }
            else 
            {
              $("#v_next_appointment").html(moment(result.next_appointment).format("MMMM D, YYYY"));
            }
           
  
            // show modal
            $("#view_progress_note_modal").modal('show');
            }

    },
      error: () => console.error('GET ajax failed')
  });

}

/**
 * ===========================================================================
 * * PROGRESS NOTES  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // EDIT CLINICAL NOTES VALIDATION
  jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be today or before today');
    $('#editProgressNoteForm').validate({
      debug: false,
      rules: {
        edit_reason_for_consultation_s: {
          required: true,
          minlength: 5
        },
        edit_physical_examination_s: {
          required: true,
          minlength: 5
        },
        edit_consultation_date_s: {
          required: true,
          beforeToday: true
        }
      },
      messages: {      
        edit_reason_for_consultation_s: {
          required: "Please provide a reason for consultation",
          minlength: "Must be at least 5 characters long"
        },
        edit_physical_examination_s: {
          required: "Please provide a physical examination",
          minlength: "Must be at least 5 characters long"
        },
        edit_next_appointment: {
          required: "Please provide the date of next appointment",
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
      submitHandler: () => editProgressNotes()
  });
});
// UPDATE PROGRESS NOTE
editProgressNotes = () => {

    var reason_for_consultation = $('#edit_reason_for_consultation_s').val();
    var physical_examination    = $('#edit_physical_examination_s').val();
    var impression              = $('#edit_impression_s').val();
    var recommendation          = $('#edit_recommendation_s').val();
    var next_appointment        = $('#edit_next_appointment_s').val();
    var consultation_date        = $('#edit_consultation_date_s').val();

 
  var data = {reason_for_consultation, 
              physical_examination, 
              impression, 
              recommendation, 
              next_appointment,
              consultation_date};
  console.log(data);
  // e.preventDefault();
  const progress_note_id      = $('#u_progress_note_id').val();

  $.ajax({
    url: `http://127.0.0.1:8000/record/updateProgressNote/${ progress_note_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        // alert
        toastr.success('Progress Note Updated')
        // hide modal
        $("#edit_progress_note").modal('hide');
        // remove data in form
        document.getElementById("editMedicalHistoryForm").reset();

        //medical history          
       // reload datatable
        $('#note_table').DataTable().ajax.reload();
    },
      error: () => console.error('GET ajax failed')
  });

}





 