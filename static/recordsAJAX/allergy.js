// 
// * ===========================================================================
// * * ALLERGY DATATABLE
// * ===========================================================================
var data = $('#patient_record_id_record').val();
let allergy_table = $('#allergy_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    buttons: true,
    responsive: true,
    autoWidth: false,
    ajax: `/table/allergy/${ data }`,
    columns:[
        {data: 'allergen'},
        {data: 'reaction'},
        {data: 'severity'},
        // {data: 'comment'},
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
                          onClick="editAllergenModal('${data.allergy_id}', 'view')">
                      <div style="width: 2rem;">
                        <i class="fas fa-file-alt mr-1"></i>
                      </div>
                      <div>View Allergy</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div role="button"
                       data-toggle="modal" 
                       data-target="#view_allergen_modal">
                       </div>
                       
                  <div class="dropdown-item d-flex"
                          role="button"
                          onClick="editAllergenModal('${data.allergy_id}', 'edit')">
                      <div style="width: 2rem;">
                      <i class="fas fa-edit mr-1"></i>
                      </div>
                      <div>Edit Allergy</div>
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
        allergy_table.buttons().container().appendTo('#allergy_table_wrapper .col-md-6:eq(0)')
    }
  })


 // run on load
 $(() => {

  // ADD ALLERGY VALIDATION
    $('#addAllergyForm').validate({
      debug: false,
      rules: {
        allergen: {
          required: true
        },
        reaction: {
          required: true
        },
        severity: {
          required: true,
        }
      },
      messages: {      
          allergen: {
            required: "This field is required"
          },
          reaction: {
            required: "This field is required"
          },
          severity: {
            required: "This field is required",
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
      submitHandler: () => addAllergy()
      
      
    });
// end run on load
});

// ADD ALLERGY
    addAllergy = () => {

    var allergen              = $('#allergen').val();
    var reaction              = $('#reaction').val();
    var severity              = $('#severity').val();
    var comment               = $('#comment').val();
    var patient_record_id     = $('#patient_record_id').val();

    var data = {
        patient_record_id,
        allergen,
        reaction,
        severity,
        comment
    };
  console.log(data);
  // e.preventDefault();

  $.ajax({
    url: 'http://127.0.0.1:8000/record/recordAllergy',
      type: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        toastr.success('Allergy Added')
        $("#allergy_modal").modal('hide');
        document.getElementById("addAllergyForm").reset();
        
        // reload datatable
        $('#allergy_table').DataTable().ajax.reload();
        
    },
      error: () => console.error('GET ajax failed')
  });

// });
}

// EDIT Allergen
function editAllergenModal(allergy_id,type){
  console.log(allergy_id);

  $.ajax({
      url: `http://127.0.0.1:8000/record/ShowAllergy/${allergy_id}`,
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
          $("#edit_allergen").val(result.allergen);
          $("#edit_reaction").val(result.reaction);
          $("#edit_severity").val(result.severity);
          $("#edit_comment").val(result.comment);
          $("#edit_allergy_id").val(result.allergy_id);

          // show modal
          $("#edit_allergy_modal").modal('show');
          }
          else if(type == 'view'){

          // set field value
          $("#v_allergen").html(result.allergen);
          $("#v_reaction").html(result.reaction);
          $("#v_severity").html(result.severity);
          if (result.comment == ""){
            $("#v_comment").html(`<div class="text-secodnary small font-italic">No data available</div>`);
            console.log()
          }
          else 
          {
            $("#v_comment").html(result.comment);
          }
         

          // show modal
          $("#view_allergen_modal").modal('show');
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
// Edit Allergy Validation
  $('#editAllergyForm').validate({
    debug: false,
    rules: {
      edit_allergen: {
        required: true
      },
      edit_reaction: {
        required: true
      },
      edit_severity: {
        required: true,
      }
    },
    messages: {      
      edit_allergen: {
          required: "This field is required"
        },
      edit_reaction: {
          required: "This field is required"
        },
      edit_severity: {
          required: "This field is required",
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
    submitHandler: () => editAllergy()
    
    
  });
// end run on load
});
// EDIT ALLERGY
  editAllergy = () => {

      var allergen           = $('#edit_allergen').val();
      var reaction             = $('#edit_reaction').val();
      var severity              = $('#edit_severity').val();
      var comment           = $('#edit_comment').val();
      var allergy_id            = $('#edit_allergy_id ').val();

    var data = {allergen,
      reaction ,
      severity,
      comment,
      allergy_id,
    };
     console.log(data);
  $.ajax({
    url: `http://127.0.0.1:8000/record/updateAllergy/${ allergy_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
      //   alert
        toastr.success('Allergy Updated')
      //   hide modal
        $("#edit_allergy_modal").modal('hide');
      //   remove data in form
        document.getElementById("editAllergyForm").reset();
        
        // reload datatable
        $('#allergy_table').DataTable().ajax.reload();

        
    },
      error: () => console.error('GET ajax failed')
  });
}



