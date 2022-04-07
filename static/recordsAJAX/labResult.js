/**
 * ===========================================================================
 * * LABORATORU  = DATATABLE
 * ===========================================================================
 */
// DATATABLE
var data = $('#patient_record_id_record').val();
// console.log(data);
  let laboratory_table = $('#laboratory_table').DataTable({
        serverSide: true,
        processing:true,
        pageLength: 10,
        buttons: true,
        responsive: true,
        autoWidth: false,
    ajax: `/table/laboratory_list/${ data }`,
    columns:[
      {data: 'result'},
      // {data: 'detailed_result'}, 
      {data: 'specimen'},
      {data: 'unit'},
      {data: 'reference'},
      {data: null,
        render: data => {
        if(data.status == 'Unclaimed') return `
              <div class="badge badge-danger p-2 w-100" ><i class="fas fa-times mr-1"></i>${ data.status }</div>
              `;
        else if (data.status == 'Claimed') return  `
            <div class="badge badge-primary p-2 w-100"><i class="fas fa-check mr-1"></i>${ data.status }</div>`;
        else return  `
            <div class="badge badge-warning p-2 w-100"><i class="fas fa-redo-alt mr-1"></i> ${ data.status }</div>`;
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
                            onClick="editLabResultModal('${data.lab_result_id}','view')"
                    >
                        <div style="width: 2rem;">
                            <i class="fas fa-file-alt mr-1"></i>
                        </div>
                        <div>View Laboratory Record</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item d-flex" 
                            role="button"
                            onClick="editLabResultModal('${data.lab_result_id}','edit')"
                            >
                        <div style="width: 2rem;">
                            <i class=" fas fa-edit mr-1"></i>
                        </div>
                        <div>Edit Laboratory Record</div>
                    </div>
                </div>
            </div>
            `
        }}


    ],
    initComplete: function(){
      laboratory_table.buttons().container().appendTo('#laboratory_table_wrapper .col-md-6:eq(0)')
    }
})
/**
 * ===========================================================================
 * * LABORATORY  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
  // ADD LABORATORY RESULT VALIDATION
  $('#addLabForm').validate({
    debug: false,
    rules: {
      specimen: {
        required: true
      },
      result: {
        required: true
      },
      reference: {
        required: true
      },
      status: {
        required: true
      },
      unit: {
        required: true
      },
      detailed_result: {
        required: true
      }
    },
    messages: {      
      specimen: {
        required: "Please select a specimen",
      },
      result: {
        required: "Please provide a result"
      },
      reference: {
        required: "Please provide a reference"
      },
      status: {
        required: "Please select a status",
      },
      unit: {
        required: "Please provide a unit"
      },
      detailed_result: {
        required: "Please provide a detailed result"
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
    submitHandler: () => addLaboratory()
  });


});

// ADD LAB RESULT
addLaboratory = () => {

      var specimen          = $('#specimen').val();
      var result            = $('#result').val();
      var reference         = $('#reference').val();
      var unit              = $('#unit').val();
      var status            = $('#status').val();
      var detailed_result   = $('#detailed_result').val();
      var patient_record_id = $('#patient_record_lab').val()
    
    
    var data = {patient_record_id,specimen,result,reference,unit,status,detailed_result};

    console.log(data);


    $.ajax({
      url: 'http://127.0.0.1:8000/record/medicalLabResult',
        type: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
          console.log(result)
          toastr.success('Lab Result Updated')
          $("#lab_result").modal('hide');
          // hide no info available block
          $("#nocontent_lab").hide();
          document.getElementById("addLabForm").reset();

          // reload datatable
          $('#laboratory_table').DataTable().ajax.reload();
          
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
  $('#editLabForm').validate({
    debug: false,
    rules: {
      edit_specimen: {
        required: true
      },
      edit_result: {
        required: true
      },
      edit_reference: {
        required: true
      },
      edit_status: {
        required: true
      },
      edit_unit: {
        required: true
      },
      edit_detailed_result: {
        required: true
      }
    },
    messages: {      
      edit_specimen: {
        required: "Please select a specimen",
      },
      edit_result: {
        required: "Please provide a result"
      },
      edit_reference: {
        required: "Please provide a reference"
      },
      edit_status: {
        required: "Please select a status",
      },
      edit_unit: {
        required: "Please provide a unit"
      },
      edit_detailed_result: {
        required: "Please provide a detailed result"
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
    submitHandler: () => editLaboratory()
  });


});

// EDIT lab result
function editLabResultModal(lab_result_id,type){
  console.log(lab_result_id);

  $.ajax({
      url: `http://127.0.0.1:8000/record/ShowLabResult/${lab_result_id}`,
      type: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      // data: JSON.stringify(prescription_id),
      success: result => {
          console.log(result)
          if(type == 'edit'){

          // set field value
          $("#edit_result").val(result.result);
          $("#edit_detailed_result").val(result.detailed_result);
          $("#edit_specimen").val(result.specimen);
          $("#edit_unit").val(result.unit);
          $("#edit_reference").val(result.reference);
          $("#edit_status").val(result.status);
          $("#u_edit_lab_result").val(result.lab_result_id);

          // show modal
          $("#edit_lab_result").modal('show');
          }
          else if(type == 'view'){

          // set field value
          $("#v_result").html(result.result);
          $("#v_description").html(result.detailed_result);
          $("#v_specimen").html(result.specimen);
          $("#v_unit").html(result.unit);
          $("#v_reference").html(result.reference);
          $("#v_lab_status").html(result.status);
         

          // show modal
          $("#view_lab_result").modal('show');
          }
    },
      error: () => console.error('GET ajax failed')
  });

}


// UPDATE lab result
editLaboratory = () => {

    var result             = $('#edit_result').val();
    var detailed_result    = $('#edit_detailed_result').val();
    var specimen           = $('#edit_specimen').val();
    var unit               = $('#edit_unit').val();
    var reference          = $('#edit_reference').val();
    var status             = $('#edit_status').val();
    var lab_result_id      = $('#u_edit_lab_result').val();

  
  var data = {result, 
              detailed_result, 
              specimen, 
              unit, 
              reference,
              status};
              
  console.log(data);

  $.ajax({
    url: `http://127.0.0.1:8000/record/updateLabResult/${ lab_result_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        // alert
        toastr.success('Laboratory Result Updated')
        // hide modal
        $("#edit_lab_result").modal('hide');
        // remove data in form
        document.getElementById("editLabForm").reset();

        //lab result         
       // reload datatable
        $('#laboratory_table').DataTable().ajax.reload();
    },
      error: () => console.error('GET ajax failed')
  });
}
