/**
 * ===========================================================================
 * * DIAGNOSIS DATATABLE
 * ===========================================================================
 */
// DATATABLE
var data = $('#patient_record_id_record').val();
var doc_id = localStorage.getItem('doc_id');
// console.log(data);
  let diagnosis_table = $('#diagnosis_table').DataTable({
        serverSide: true,
        processing:true,
        pageLength: 10,
        buttons: true,
        responsive: true,
        autoWidth: false,
    ajax: `/table/diagnosis_list/${ data }/${ doc_id }`,
    columns:[
      {data: 'diagnosis'},
      {data: 'description'},
      {data: 'first_name',
                    class: 'text-left',
                    render: function ( data, type, row ) {
                    return 'Dr. '+row.last_name + ', ' + row.first_name + ' ' + row.middle_name ;
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
                        onClick="editDiagnosicResultModal('${data.diagnosis_id}', 'view')">
                    <div style="width: 2rem;">
                      <i class="fas fa-file-alt mr-1"></i>
                    </div>
                    <div>View Diagnostic Result</div>
                </div>
                <div class="dropdown-divider"></div>
                <div role="button"
                     data-toggle="modal" 
                     data-target="#view_allergen_modal">
                     </div>
                     
                <div class="dropdown-item d-flex"
                        role="button"
                        onClick="editDiagnosicResultModal('${data.diagnosis_id}', 'edit')">
                    <div style="width: 2rem;">
                    <i class="fas fa-edit mr-1"></i>
                    </div>
                    <div>Edit Diagnostic Result</div>
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
      diagnosis_table.buttons().container().appendTo('#diagnosis_table_wrapper .col-md-6:eq(0)')
    }
})




/**
 * ===========================================================================
 * * DIAGNOSIS  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
    // ADD DIAGNOSTIC RESULT VALIDATION
    $('#addDiagnosticForm').validate({
      debug: false,
      rules: {
          doc_idname: {
          required: true
        },
        diagnosisname: {
          required: true
        },
        description: {
          required: true
        }
      },
      messages: {      
          doc_idname: {
          required: "Please select a doctor",
        },
        diagnosisname: {
          required: "Please provide a diagnosis"
        },
        description: {
          required: "Please provide a description"
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
      submitHandler: () => addDiagnosis()
    });


  });

// ADD DIAGNOSTIC RESULT
addDiagnosis = () => {
    
      var doc_id            = $('select#doc_id').val();
      var diagnosis         = $('#diagnosis').val();
      var description       = $('textarea#description').val();
      var patient_record_id = $('#patient_record_p').val();

      var data = {patient_record_id,doc_id,diagnosis,description,};
    console.log(data);

    $.ajax({
      url: 'http://127.0.0.1:8000/record/medicalDiagnosis',
        type: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
          console.log(result)
          toastr.success('Diagnostic Result Updated')
          // hide form modal
          $("#diagnostic_result_modal").modal('hide');
          // hide no info available block
          $("#nocontent_diagnosis").hide();
          // remove form data
          document.getElementById("addDiagnosticForm").reset();
          // reload datatable
          $('#diagnosis_table').DataTable().ajax.reload();

          
      },
        error: () => console.error('GET ajax failed')
    });

}


// EDIT DIAGNOSTIC RESULT
function  editDiagnosicResultModal(diagnosis_id, Type){
  console.log(diagnosis_id);

  $.ajax({
      url: `http://127.0.0.1:8000/record/ShowDiagnosticResult/${diagnosis_id}`,
      type: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      // data: JSON.stringify(diagnosis_id),
      success: result => {
          console.log(result)
          console.log(Type)
          if (Type == 'edit'){
              // set field value
            $("#edit_doc_id_diagnosis").val(result.doc_id);
            $("#edit_diagnosis").val(result.diagnosis);
            $("#edit_description").val(result.description);
            $('#edit_patient_record_p').val(result.diagnosis_id);
            $("#edit_diagnostic_result").modal('show');
          }
          else if (Type == 'view'){
            // set field value
            $("#d_doc_id").html('Dr. '+result.docdiagnosisFK.last_name+', '+result.docdiagnosisFK.first_name+' '+result.docdiagnosisFK.middle_name+', '+result.docdiagnosisFK.department
                                        );
            $("#d_diagnosis").html(result.diagnosis);
            $("#d_description").html(result.description);
            $("#view_diagnostic_result").modal('show');
          }
    },
      error: () => console.error('GET ajax failed')
  });


}


/**
 * ===========================================================================
 * * DIAGNOSIS  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // EDIT DIAGNOSTIC RESULT VALIDATION
  $('#editDiagnosticForm').validate({
    debug: false,
    rules: {
      edit_doc_idname: {
        required: true
      },
      edit_diagnosisname: {
        required: true
      },
      edit_descriptionname: {
        required: true
      }
    },
    messages: {      
      edit_doc_idname: {
        required: "Please select a doctor",
      },
      edit_diagnosisname: {
        required: "Please provide a diagnosis"
      },
      edit_descriptionname: {
        required: "Please provide a description"
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
    submitHandler: () => editDiagnosis()
  });


});
// EDIT DIAGNOSTIC RESULT
// $('#updateDiagnostic').click(function(e){
editDiagnosis = () => {

    var doc_id      = $('#edit_doc_id_diagnosis').val();
    var diagnosis   = $('#edit_diagnosis').val();
    var description = $('#edit_description').val();
  
  var data = {doc_id, 
              diagnosis, 
              description};
  console.log(data);
  // // e.preventDefault();
    const diagnosis_id      = $('#edit_patient_record_p').val();

  $.ajax({
    url: `http://127.0.0.1:8000/record/updateDiagnosticResult/${ diagnosis_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),

      success: result => {
        console.log(result)
        // alert
        toastr.success('Diagnostic Result Updated')
        // hide modal
        $("#edit_diagnostic_result").modal('hide');
        // remove data in form
        document.getElementById("editDiagnosticForm").reset();

        //diagnostic result
        $('#d_doc_id').html(result.doc_id);
        $('#d_diagnosis').html(result.diagnosis);
        $('#d_description').html(result.description);

                  // reload datatable
                  $('#diagnosis_table').DataTable().ajax.reload();
      },
      error: () => console.error('Get ajax failed')
  });

// });
}

