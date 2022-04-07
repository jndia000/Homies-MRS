// 
// * ===========================================================================
// * * MEDICATIONS DATATABLE
// * ===========================================================================
var data = $('#patient_record_id_record').val();
let medication_table = $('#medication_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    buttons: true,
    responsive: true,
    autoWidth: false,
    ajax: `/table/medications/${ data }`,
    columns:[
        {data: 'drug_name'},
        {data: 'dosage'},
        {data: 'frequency'},
        {data: 'quantity'},
        {data: null,
          render: data => {
          if(data.medication_status == 'Start') return `
                <div class="badge badge-primary p-2 w-100"><i class="fas fa-capsules mr-1"></i>${ data.medication_status }</div>`;
          else if(data.medication_status == 'Stop') return  `
              <div class="badge badge-danger p-2 w-100"><i class="fas fa-capsules mr-1"></i>${ data.medication_status }</div>`;
          else if(data.medication_status == 'Increase') return  `
              <div class="badge badge-success p-2 w-100"><i class="fas fa-capsules mr-1"></i>${ data.medication_status }</div>`;
          else if(data.medication_status == 'Decrease') return  `
              <div class="badge badge-warning p-2 w-100"><i class="fas fa-capsules mr-1"></i>${ data.medication_status }</div>`;
          else if(data.medication_status == 'No Change') return  `
              <div class="badge badge-info p-2 w-100"><i class="fas fa-capsules mr-1"></i>${ data.medication_status }</div>`;
        }},
        {data: null,
          render: data => {
            const start_date = moment(data.start_date).format("MMMM D, YYYY");
            const humanizedDateOccured = moment(data.start_date).fromNow();
            return `
                            <div class="d-flex align-items-baseline">
                                <div>
                                    <div>${start_date}</div>
                                    <div class="text-secondary small">Starts ${humanizedDateOccured}</div>
                                </div>
                            </div>
                        `;
          }},
          {data: null,
            render: data => {
              const end_date = moment(data.end_date).format("MMMM D, YYYY");
              const humanizedDateOccured = moment(data.end_date).fromNow();
              return `
                              <div class="d-flex align-items-baseline">
                                  <div>
                                      <div>${end_date}</div>
                                      <div class="text-secondary small">Ends ${humanizedDateOccured}</div>
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
                          onClick="editMedicationModal('${data.medication_id}', 'view')">
                      <div style="width: 2rem;">
                        <i class="fas fa-file-alt mr-1"></i>
                      </div>
                      <div>View Medication</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div role="button"
                       data-toggle="modal" 
                       data-target="#view_medication_modal">
                       </div>
                       
                  <div class="dropdown-item d-flex"
                          role="button"
                          onClick="editMedicationModal('${data.medication_id}', 'edit')">
                      <div style="width: 2rem;">
                      <i class="fas fa-edit mr-1"></i>
                      </div>
                      <div>Edit Medication</div>
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
        medication_table.buttons().container().appendTo('#medication_table_wrapper .col-md-6:eq(0)')
    }
  })

 // run on load
$(() => {

    // jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
    //   return this.optional(elem) || moment(val).isBefore(moment());
    // }, 'Date must be before today');
    // jQuery.validator.addMethod("afterToday", function(val,elem,param) {
    //   return this.optional(elem) || moment(val).isAfter(moment());
    // }, 'Date must be after today');
  // ADD MEDICATION VALIDATION
    $('#addMedicationForm').validate({
      debug: false,
      rules: {
        drug_name: {
          required: true
        },
        dosage: {
          required: true
        },
        route: {
          required: true,
        },
        frequency: {
          required: true,
        },
        quantity: {
          required: true,
        },
        medications_status: {
          required: true,
        },
        instructions: {
          required: true,
        },
        start_date: {
          required: true,
        },
        end_date: {
          required: true,
        },
      },
      messages: {      
        drug_name: {
            required: "This field is required"
          },
          dosage: {
            required: "This field is required"
          },
          route: {
            required: "This field is required",
          },
          frequency: {
            required: "This field is required",
          },
          quantity: {
            required: "This field is required",
          },
          medications_status: {
            required: "This field is required"
            ,
          },
          instructions: {
            required: "This field is required",
          },
          start_date: {
            required: "This field is required",
          },
          end_date: {
            required: "This field is required",
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
      submitHandler: () => addMedication()
      
      
    });
// end run on load
});

// ADD MEDICATION
    addMedication = () => {

    var drug_name               = $('#md_drug_name').val();
    var dosage                  = $('#md_dosage').val();
    var route                   = $('#md_route').val();
    var frequency               = $('#md_frequency').val();
    var quantity                = $('#md_quantity').val();
    var medication_status       = $('#md_medication_status').val();
    var refill                  = $('#md_refill').val();
    var instructions            = $('#md_instructions').val();
    var start_date              = $('#md_start_date').val();
    var end_date                = $('#md_end_date').val();
    var patient_record_id       = $('#patient_record_id').val();

    var data = {
        patient_record_id,
        drug_name,
        dosage,
        route,
        frequency,
        quantity,
        medication_status,
        refill,
        instructions,
        start_date,
        end_date,
    };
  console.log(data);
  // e.preventDefault();

  $.ajax({
    url: 'http://127.0.0.1:8000/record/recordMedication',
      type: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        toastr.success('Medication added')
        $("#medication_modal").modal('hide');
        document.getElementById("addMedicationForm").reset();
        
        // reload datatable
        $('#medication_table').DataTable().ajax.reload();
        
    },
      error: () => console.error('GET ajax failed')
  });

// });
}

// EDIT Medication
function editMedicationModal(medication_id,type){
  console.log(medication_id);

  $.ajax({
      url: `http://127.0.0.1:8000/record/ShowMedications/${medication_id}`,
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
          $("#edit_md_drug_name").val(result.drug_name);
          $("#edit_md_dosage").val(result.dosage);
          $("#edit_d_route").val(result.route);
          $("#edit_md_frequency").val(result.frequency);
          $("#edit_md_quantity").val(result.quantity);
          $("#edit_md_refill").val(result.refill);
          $("#edit_md_instructions").val(result.instructions);
          $("#edit_md_start_date").val(result.start_date);
          $("#edit_md_end_date").val(result.end_date);
          $("#edit_md_medication_status").val(result.medication_status);
          $("#edit_medication_id").val(result.medication_id);

          // show modal
          $("#edit_medication_modal").modal('show');
          }
          else if(type == 'view'){

          // set field value
          $("#v_drug_name").html(result.drug_name);
          $("#v_dosage").html(result.dosage);
          $("#v_route").html(result.route);
          $("#v_frequency").html(result.frequency);
          $("#v_quantity").html(result.quantity);
          if (result.refill == ""){
            $("#v_refill").html(`<div class="text-secodnary small font-italic">No data available</div>`);
            console.log()
          }
          else 
          {
            $("#v_refill").html(result.refill);
          }
          $("#v_instructions").html(result.instructions);
          var start_date = moment(result.start_date).format("MMMM D, YYYY");
          var humanizedStartDate = moment(result.start_date).fromNow();
          $("#v_start_date").html(`<div class="d-flex align-items-baseline">
                                        <div>
                                            <div>${start_date}</div>
                                            <div class="text-secondary small">Occured ${humanizedStartDate}</div>
                                        </div>
                                    </div>`);
          var end_date = moment(result.end_date).format("MMMM D, YYYY");
          var humanizedEndDate = moment(result.end_date).fromNow();
          $("#v_end_date").html(`<div class="d-flex align-items-baseline">
                                        <div>
                                            <div>${end_date}</div>
                                            <div class="text-secondary small">Occured ${humanizedEndDate}</div>
                                        </div>
                                    </div>`);
          $("#v_medication_status").html(result.medication_status);
          
         

          // show modal
          $("#view_medication_modal").modal('show');
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
// Edit Medication Validation
  $('#editMedicationForm').validate({
    debug: false,
    rules: {
      edit_md_drug_name: {
        required: true
      },
      edit_md_dosage: {
        required: true
      },
      edit_d_route: {
        required: true,
      },
      edit_md_frequency: {
        required: true,
      },
      edit_md_quantity: {
        required: true,
      },
      edit_md_medication_status: {
        required: true,
      },
      edit_md_instructions: {
        required: true,
      },
      edit_md_start_date: {
        required: true,
      },
      edit_md_end_date: {
        required: true,
      },
    },
    messages: {      
      edit_md_drug_name: {
          required: "This field is required"
        },
      edit_md_dosage: {
          required: "This field is required"
        },
      edit_d_route: {
          required: "This field is required",
        },
      edit_md_frequency: {
          required: "This field is required",
        },
      edit_md_quantity: {
          required: "This field is required",
        },
      edit_md_medications_status: {
          required: "This field is required"
          ,
        },
      edit_md_instructions: {
          required: "This field is required",
        },
      edit_md_start_date: {
          required: "This field is required",
        },
      edit_md_end_date: {
          required: "This field is required",
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
    submitHandler: () => editMedication()
    
    
  });
// end run on load
});
// EDIT MEDICATION
  editMedication = () => {

      var drug_name           = $('#edit_md_drug_name').val();
      var dosage              = $('#edit_md_dosage').val();
      var route               = $('#edit_d_route').val();
      var frequency           = $('#edit_md_frequency').val();
      var quantity            = $('#edit_md_quantity').val();
      var medication_status      = $('#edit_md_medication_status').val();
      var refill              = $('#edit_md_refill').val();
      var instructions        = $('#edit_md_instructions').val();
      var start_date          = $('#edit_md_start_date').val();
      var end_date            = $('#edit_md_end_date').val();
      var medication_id       = $('#edit_medication_id').val();
    var data = {drug_name,
      dosage,
      route,
      frequency,
      quantity,
      medication_status,
      refill,
      instructions, 
      start_date,
      end_date,
      medication_id , 
    };
     console.log(data);
  $.ajax({
    url: `http://127.0.0.1:8000/record/updateMedication/${ medication_id }`,
      type: 'PUT',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
      //   alert
        toastr.success('Medication Updated')
      //   hide modal
        $("#edit_medication_modal").modal('hide');
      //   remove data in form
        document.getElementById("editMedicationForm").reset();
        
        // reload datatable
        $('#medication_table').DataTable().ajax.reload();

        
    },
      error: () => console.error('GET ajax failed')
  });
}

