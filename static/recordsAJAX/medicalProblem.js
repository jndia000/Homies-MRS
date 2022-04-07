 
 
var data = $('#patient_record_id_record').val();
console.log(data);
  let problem_table = $('#problem_table').DataTable({
        serverSide: true,
        processing:true,
        pageLength: 10,
        buttons: true,
        responsive: true,
        autoWidth: false,
    ajax: `/table/problem_list/${ data }`,
    columns:[
        
        {data: 'problem_name'},
        {data: 'problem_note'},
        {data: null,
              render: data => {
              if(data.active_status == 'Active') return `
                    <div class="badge badge-danger p-2 w-100" role="button" data-toggle="modal" 
                    data-target="#problemmodalupdate"><i class="fas fa-exclamation-triangle mr-1"></i>${ data.active_status }</div>
                    <input type="hidden" name="problem_id" class="form-control" id="problem_id" value="${ data.problem_id }">
                    `;
              else return  `
                  <div class="badge badge-primary p-2 w-100"><i class="fas fa-check-square mr-1"></i>${ data.active_status }</div>`;
            }},
        {data: null,
              render: data => {
                const date_occured = moment(data.date_occured).format("MMMM D, YYYY");
                const humanizedDateOccured = moment(data.date_occured).fromNow();
                return `
                                <div class="d-flex align-items-baseline">
                                    <div>
                                        <div>${date_occured}</div>
                                        <div class="text-secondary small">Occured ${humanizedDateOccured}</div>
                                    </div>
                                </div>
                            `;
              }},
        {data: null,
              render: data => {
                const date_resolved = moment(data.date_resolved).format("MMMM D, YYYY");
                const humanizedDateResolved = moment(data.date_resolved).fromNow();
                if(data.date_resolved == null) return `
                                  <div class="d-flex align-items-baseline">
                                      <div>
                                          <div class="text-secodnary small font-italic">No date available</div>
                                      </div>
                                  </div>`;
                else return `
                                  <div class="d-flex align-items-baseline">
                                      <div>
                                          <div>${date_resolved}</div>
                                          <div class="text-secodnary small">Resolved ${humanizedDateResolved}</div>
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
                                    onClick="editProblemModal('${data.problem_id}', 'view')">
                                <div style="width: 2rem;">
                                  <i class="fas fa-file-alt mr-1"></i>
                                </div>
                                <div>View Problem</div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <div role="button"
                                 data-toggle="modal" 
                                 data-target="#">
                                 </div>
                                 
                            <div class="dropdown-item d-flex"
                                    role="button"
                                    onClick="editProblemModal('${data.problem_id}', 'edit')">
                                <div style="width: 2rem;">
                                <i class="fas fa-edit mr-1"></i>
                                </div>
                                <div>Edit Problem</div>
                            </div>
                            <div role="button"
                                 data-toggle="modal" 
                                 data-target="#">
                        </div>
                    </div>
                    `
                }}
        
    ],
    initComplete: function(){
        problem_table.buttons().container().appendTo('#problem_table_wrapper .col-md-6:eq(0)')
    }
})


// run on load
$(() => {

    jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
      return this.optional(elem) || moment(val).isBefore(moment());
    }, 'Date must be before today');
    jQuery.validator.addMethod("afterToday", function(val,elem,param) {
      return this.optional(elem) || moment(val).isAfter(moment());
    }, 'Date must be after today');
  // ADD MEDICAL PROBLEM VALIDATION
    $('#addProblemForm').validate({
      debug: false,
      rules: {
        problem_name: {
          required: true,
          minlength: 5
        },
        date_occured: {
          required: true,
          beforeToday: true
        },
        date_resolved: {
          afterToday: true,
        }
      },
      messages: {      
        problem_name: {
          required: "Please provide a Problem"
        },
        date_occured: {
          required: "Please provide a Date Occured",
        },
        date_resolved: {
          required: "Please provide a Date Resolved"
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
      submitHandler: () => addProblem()
      
      
    });
// end run on load
});

// ADD MEDICAL PROBLEM
// $('#addProblembtn').click(function(e){
  addProblem = () => {
  // var valid = this.form.checkValidity();

  // if(valid){
    var problem_name      = $('#problem_name').val();
    var date_occured      = $('#date_occured').val();
    var problem_note      = $('textarea#problem_note').val();
    var date_resolved     = $('#date_resolved').val();
    var patient_record_id = $('#patient_record_id').val();
    var active_status     = (date_resolved) ? "Resolved" : "Active";
  // }
  var data = {patient_record_id,problem_name,problem_note,date_occured,date_resolved,active_status};
  console.log(data);
  // e.preventDefault();

  $.ajax({
    url: 'http://127.0.0.1:8000/record/medicalProblem',
      type: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        toastr.success('Medical Problem Updated')
        $("#problemmodal").modal('hide');
        document.getElementById("addProblemForm").reset();
        
        // reload datatable
        $('#problem_table').DataTable().ajax.reload();
        
    },
      error: () => console.error('GET ajax failed')
  });

// });
}



// run on load
$(() => {
  jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be before today');
// ADD MEDICAL PROBLEM VALIDATION
  $('#editProblemForm').validate({
    debug: false,
    rules: {
      date_resolved: {
        required: true,
        beforeToday: true
      }
    },
    messages: {      
      date_resolved: {
        required: "Please provide a date"
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
    submitHandler: () => editProblembtn()
    
    
  });
// end run on load
});
// EDIT PATIENT PROBLEM
// $('#editProblembtn').click(function(e){
  editProblembtn = () => {
    // var valid = this.form.checkValidity();

    // if(valid){
      var date_resolved      = $('#date_resolved_edit').val();
      var problem_id         = $('#problem_id').val();
    // }
    var data = {date_resolved};
    // console.log(data);
    // e.preventDefault();
     
  $.ajax({
    url: `http://127.0.0.1:8000/record/updateProblem/${ problem_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
      //   alert
        toastr.success('Medical Problem Updated')
      //   hide modal
        $("#problemmodalupdate").modal('hide');
      //   remove data in form
        document.getElementById("editProblemForm").reset();
        
        // reload datatable
        $('#problem_table').DataTable().ajax.reload();

        
    },
      error: () => console.error('GET ajax failed')
  });
}

// EDIT Medical Problem
function editProblemModal(problem_id,type){
  console.log(problem_id);

  $.ajax({
      url: `http://127.0.0.1:8000/record/ShowProblem/${problem_id}`,
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
          $("#edit_problem_name").val(result.problem_name);
          $("#edit_problem_note").val(result.problem_note);
          $("#edit_date_occured").val(result.date_occured);
          $("#edit_date_resolved").val(result.date_resolved);
          $("#edit_active_status").val(result.active_status);
          $("#edit_problem_id").val(result.problem_id);

          // show modal
          $("#problem_modal_update").modal('show');
          }
          else if(type == 'view'){

          // set field value
          $("#v_problem_name").html(result.problem_name);
          $("#v_problem_note").html(result.problem_note);
          var date_occured = moment(result.date_occured).format("MMMM D, YYYY");
          var humanizedDateOccured = moment(result.date_occured).fromNow();
          $("#v_date_occured").html(`<div class="d-flex align-items-baseline">
                                        <div>
                                            <div>${date_occured}</div>
                                            <div class="text-secondary small">Occured ${humanizedDateOccured}</div>
                                        </div>
                                    </div>`);
          if(result.date_resolved == null){
            $("#v_date_resolved").html(`<div class="text-secondary small font-italic">No data available</div>`)
          }else{
            var date_resolved = moment(result.date_resolved).format("MMMM D, YYYY");
          var humanizedDateResolved = moment(result.date_resolved).fromNow();
          $("#v_date_resolved").html(`<div class="d-flex align-items-baseline">
                                        <div>
                                            <div>${date_resolved}</div>
                                            <div class="text-secondary small">Occured ${humanizedDateResolved}</div>
                                        </div>
                                    </div>`);
          }
          
          $("#v_status").html(result.active_status);
         

          // show modal
          $("#view_modal_update").modal('show');
          }
    },
      error: () => console.error('GET ajax failed')
  });

}


// run on load
$(() => {
  jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be before today');

  jQuery.validator.addMethod(
    "status_check",
    function(value,element){
      if($('#edit_active_status').val() == 'Resolved') {
        if(element.value == ''){
          return false;
        }else return true
      }
      else return true;
    },
    "Date Resolved is required"
    );
// Edit Allergy Validation
  $('#updateProblemForm').validate({
    debug: false,
    rules: {
      edit_problem_name: {
        required: true,
        minlength: 5
      },
      edit_date_occured: {
        required: true,
        beforeToday: true
      },
      edit_date_resolved: {
        status_check: true,
      },
    },
    messages: {      
      edit_problem_name: {
        required: "Please provide a Problem"
      },
      edit_date_occured: {
        required: "Please provide a Date Occured",
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
    submitHandler: () => editMedicalProblem()
    
    
  });
// end run on load
});
// EDIT ALLERGY
  editMedicalProblem = () => {

      var problem_name             = $('#edit_problem_name').val();
      var problem_note             = $('#edit_problem_note').val();
      var date_occured             = $('#edit_date_occured').val();
      var date_resolved            = $('#edit_date_resolved').val();
      var active_status            = $('#edit_active_status').val();
      var problem_id               = $('#edit_problem_id ').val();

      if (date_resolved == ""){
        date_resolved = null;
      }

    var data = {problem_name,
      problem_note,
      date_occured,
      date_resolved,
      active_status,
      problem_id,
    };
     console.log(data);
  $.ajax({
    url: `http://127.0.0.1:8000/record/updateMedicalProblem/${ problem_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
      //   alert
        toastr.success('Medical Problem Updated')
      //   hide modal
        $("#problem_modal_update").modal('hide');
      //   remove data in form
        document.getElementById("updateProblemForm").reset();
        
        // reload datatable
        $('#problem_table').DataTable().ajax.reload();

        
    },
      error: () => console.error('GET ajax failed')
  });
}
