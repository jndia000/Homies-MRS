/**
 * ===========================================================================
 * * PRESCRIPTION FORM 
 * ===========================================================================
 */$('#hide_supply').hide();
$('#med_type').change(function () {
  if ($(this).val() == "drug") {
    $('#hide_med').show();
    $('#hide_supply').hide();
    $('#hide1').show();
    $('#hide2').show();
  } else {
    $('#hide_med').hide();
    $('#hide_supply').show();
    $('#hide1').hide();
    $('#hide2').hide();
  }
});

/**
 * ===========================================================================
 * * PRESCRIPTION DATATABLE 
 * ===========================================================================
 */
// DATATABLE - DRUG
var data = $('#patient_record_id_record').val();
// console.log(data);
let d_prescription_table = $('#d_prescription_table').DataTable({
    serverSide: true,
    processing: true,
    pageLength: 10,
    buttons: true,
    responsive: true,
    autoWidth: false,
    ajax: `/table/d_prescription_list/${data}`,
    columns: [
        {
            data: 'med_product_name',
            class: 'text-left',
            render: function ( data, type, row ) {
                return `
                                <div class="d-flex align-items-baseline">
                                    <div>
                                        <div>${row.med_product_name}</div>
                                        <div class="text-secodnary small">${row.dosage}</div>
                                        <div class="text-secodnary small">${row.frequency}</div>
                                    </div>
                                </div>`;
            }
        },
        { data: 'quantity', },
        { data: 'route' },
        // { data: 'prescription_notes' },
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
                            onclick= "DrugPrescriptionModal('${data.prescription_id}','view')"
                    >
                        <div style="width: 2rem;">
                            <i class="fas fa-file-alt mr-1"></i>
                        </div>
                        <div>View Prescription</div>
                    </div>

                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item d-flex" 
                            role="button"
                            onclick= "DrugPrescriptionModal('${data.prescription_id}','medication')" 
                    >
                    <div style="width: 2rem;">
                            <i class="fas fa-prescription-bottle-medical mr-1"></i>
                        </div>
                        <div>Add to Medication</div>
                    </div>
                    
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item d-flex" 
                            role="button"
                            onclick= "DrugPrescriptionModal('${data.prescription_id}','edit')" 
                    >
                    <div style="width: 2rem;">
                            <i class="fas fa-edit mr-1"></i>
                        </div>
                        <div>Edit Prescription</div>
                    </div>

                   
                </div>
            </div>
            `
            }
        }
    ],
    initComplete: function () {
        d_prescription_table.buttons().container().appendTo('#d_prescription_table_wrapper .col-md-6:eq(0)')
    }
})

// DATATABLE - SUPPLY
var data = $('#patient_record_id_record').val();
// console.log(data);
let s_prescription_table = $('#s_prescription_table').DataTable({
    serverSide: true,
    processing: true,
    pageLength: 10,
    buttons: true,
    responsive: true,
    autoWidth: false,
    ajax: `/table/s_prescription_list/${data}`,
    columns: [
        { data: 'ms_product_name' },
        { data: 'quantity' },
        // { data: 'prescription_notes' },
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
                                onclick= "editPrescriptionModal('${data.prescription_id}','view')"
                        >
                            <div style="width: 2rem;">
                                <i class="fas fa-file-alt mr-1"></i>
                            </div>
                            <div>View Prescription</div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item d-flex" 
                                role="button"
                                onclick= "editPrescriptionModal('${data.prescription_id}','edit')"
                        >
                        <div style="width: 2rem;">
                                <i class="fas fa-edit mr-1 "></i>
                            </div>
                            <div>Edit Prescription</div>
                        </div>
                    </div>
                </div>
                `
            }
        }

    ],
    initComplete: function () {
        s_prescription_table.buttons().container().appendTo('#s_prescription_table_wrapper .col-md-6:eq(0)')
    }
})




/**
 * ===========================================================================
 * * PRESCRIPTION DRUG  = ADD
 * ===========================================================================
 */
// VALIDATION
$(() => {
  jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be today or before today');
    // ADD PRESCRIPTION DRUG VALIDATION
    $('#addPrescriptionForm').validate({
      debug: false,
      rules: {
        date_prescription: {
          required: true,
          beforeToday: true
        },
        med_id_prescription: {
          required: true
        },
        dosage: {
          required: true
        },
        quantity: {
          required: true
        },
        frequency: {
          required: true
        },
        medicationTakenfor: {
          required: true
        },
        doc_id_prescription: {
          required: true
        }
      },
      messages: {      
        med_id_prescription: {
          required: "Please select a medication name",
        },
        dosage: {
          required: "Please provide a dosage"
        },
        quantity: {
          required: "Please provide a quantity"
        },
        frequency: {
          required: "Please select frequency",
        },
        medicationTakenfor: {
          required: "Please provide a intake"
        },
        doc_id_prescription: {
          required: "Please select a doctor"
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
      submitHandler: () => addDrugPrescription()
    });
  
  
  });

// ADD PRESCRIPTION - DRUG
addDrugPrescription = () => {

        var date_prescribed     = $('#date_prescription').val();
        var medication_type     = $('#med_type').val();
        var med_id              = $('#med_id_prescription').val();
        var supply_id           = $('#supply_id_prescription').val();
        var dosage              = $('#dosage').val();
        var quantity            = $('#quantity').val();
        var frequency           = $('#frequency').val();
        var route               = $('#med_taken_for').val();
        var doc_id              = $('#doc_id_prescription').val();
        var prescription_notes  = $('textarea#prescription_notes').val();
        var patient_record_id   = $('#patient_record_id_prescription').val();

    
    if (medication_type == "drug"){
        var data = { date_prescribed, med_id, medication_type, dosage, quantity, frequency, route, doc_id, prescription_notes, patient_record_id };


        console.log(data);
        $.ajax({
          url: 'http://127.0.0.1:8000/record/medicalPrescription',
          type: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'Application/json' },
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(data),
          success: result => {
              console.log(result)
              toastr.success('Prescription Added')
              $("#prescription_modal").modal('hide');
              // hide no info available block
              $("#nocontent_prescription").hide();
              document.getElementById("addPrescriptionForm").reset();

              // reload datatable
              $('#d_prescription_table').DataTable().ajax.reload();
          },
          error: () => console.error('GET ajax failed')
      });
    }else if (medication_type == "supply"){

      var data = { date_prescribed, supply_id, medication_type, quantity, doc_id, prescription_notes, patient_record_id };


      console.log(data);
  
      $.ajax({
          url: 'http://127.0.0.1:8000/record/medicalPrescriptionSupply',
          type: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'Application/json' },
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(data),
          success: result => {
              console.log(result)
              toastr.success('Prescription Added')
              $("#prescription_modal").modal('hide');
              // hide no info available block
              $("#nocontent_prescription").hide();
              document.getElementById("addPrescriptionForm").reset();
  
              // reload datatable
              $('#s_prescription_table').DataTable().ajax.reload();
          },
          error: () => console.error('GET ajax failed')
      });
  
    }
    

}



/**
 * ===========================================================================
 * * PRESCRIPTION SUPPLY  = ADD
 * ===========================================================================
 */
// VALIDATION
// $(() => {
//     // ADD PRESCRIPTION SUUPLY VALIDATION
//     $('#addPrescriptionFormSupply').validate({
//       debug: false,
//       rules: {
//         medication_supply: {
//           required: true
//         },
//         quantity_s: {
//           required: true
//         },
//         doc_id_prescription_s: {
//           required: true
//         }
//       },
//       messages: {      
//         medication_supply: {
//           required: "Please provide a medication supply",
//         },
//         quantity_s: {
//           required: "Please provide a quantity"
//         },
//         doc_id_prescription_s: {
//           required: "Please select a doctor"
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
//       submitHandler: () => addSupplyPrescription()
//     });
  
  
//   });

// ADD PRESCRIPTION - SUPPLY
// addSupplyPrescription = () => {

//         var medication_supply = $('#medication_supply').val();
//         var quantity = $('#quantity_s').val();
//         var doc_id = $('#doc_id_prescription_s').val();
//         var prescription_notes = $('textarea#prescription_notes_s').val();
//         var patient_record_id = $('#patient_record_id_prescription_s').val();

//     var data = { medication_supply, quantity, doc_id, prescription_notes, patient_record_id };


//     console.log(data);

//     $.ajax({
//         url: 'http://127.0.0.1:8000/record/medicalPrescriptionSupply',
//         type: 'POST',
//         mode: 'cors',
//         headers: { 'Content-Type': 'Application/json' },
//         dataType: 'json',
//         contentType: 'application/json; charset=utf-8',
//         data: JSON.stringify(data),
//         success: result => {
//             console.log(result)
//             toastr.success('Prescription Added')
//             $("#prescription_supply").modal('hide');
//             // hide no info available block
//             $("#nocontent_prescription").hide();
//             document.getElementById("addPrescriptionFormSupply").reset();

//             // reload datatable
//             $('#s_prescription_table').DataTable().ajax.reload();
//         },
//         error: () => console.error('GET ajax failed')
//     });

// }





// EDIT PRESCRIPTION = SUPPLY
function editPrescriptionModal(prescription_id, type) {
    console.log(prescription_id);

    $.ajax({
        url: `http://127.0.0.1:8000/record/ShowPrescriptionSupply/${prescription_id}`,
        type: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'Application/json' },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(prescription_id),
        success: result => {
            console.log(result)
            if (type == 'edit') {
                // set field value
                $("#edit_medication_supply").val(result.supplyFK.id);
                $("#edit_quantity_s").val(result.quantity);
                $("#date_prescription_s").val(result.date_prescribed);
                $("#edit_doc_id_prescription_s").val(result.doc_id);
                $("#edit_prescription_notes_s").val(result.prescription_notes);
                $("#patient_record_id_prescription_s").val(result.prescription_id);
               
                
                // show modal
                $("#edit_prescription_supply").modal('show');
            }
            else if (type == 'view') {
                // set field value
                $("#v_medication_supply").html(result.supplyFK.ms_product_name);
                $("#v_date_prescribed_s").html(moment(result.date_prescribed).format("MMMM D, YYYY"));
                $("#v_quantity_s").html(result.quantity);
                $("#v_doc_id_prescription_s").html('Dr. '+result.docprescriptionFK.last_name + ', ' + result.docprescriptionFK.first_name + ' ' + result.docprescriptionFK.middle_name + ', ' + result.docprescriptionFK.department);
                if (result.prescription_notes == ""){
                  $("#v_prescription_notes_s").html(`<div class="text-secodnary small font-italic">No data available</div>`);
                }
                else 
                {
                  $("#v_prescription_notes_s").html(result.prescription_notes);
                }
                // show modal
                $("#view_prescription_supply").modal('show');
            }

        },
        error: () => console.error('GET ajax failed')
    });
}

// EDIT PRESCRIPTION = Drug
function DrugPrescriptionModal(prescription_id, type) {
    console.log(prescription_id);

    $.ajax({
        url: `http://127.0.0.1:8000/record/ShowPrescriptionDrug/${prescription_id}`,
        type: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'Application/json' },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(prescription_id),
        success: result => {
            console.log(result)
            if (type == 'edit') {
                // set field value
                $("#edit_medication_name").val(result.medicineFK.id);
                $("#date_prescription_d").val(result.date_prescribed);
                $("#edit_dosage").val(result.dosage);
                $("#edit_quantity").val(result.quantity);
                $("#edit_frequency").val(result.frequency);
                $("#edit_med_taken_for").val(result.route);
                $("#edit_doc_id_prescription").val(result.doc_id);
                $("#edit_prescription_notes").val(result.prescription_notes);
                $("#u_patient_record_id_prescription").val(result.prescription_id);
                // show modal
                $("#edit_prescription_drug").modal('show');
            }
            else if (type == 'view') {
                // set field value
                $("#v_medication_name").html(result.medicineFK.med_product_name);
                $("#v_date_prescribed").html(moment(result.date_prescribed).format("MMMM D, YYYY"));
                $("#view_dosage").html(result.dosage);
                $("#view_quantity").html(result.quantity);
                $("#view_frequency").html(result.frequency);
                $("#v_med_taken_for").html(result.route);
                $("#v_doc_id_prescription").html('Dr. '+result.docprescriptionFK.last_name + ', ' + result.docprescriptionFK.first_name + ' ' + result.docprescriptionFK.middle_name + ', ' + result.docprescriptionFK.department);
                if (result.prescription_notes == ""){
                  $("#v_prescription_notes").html(`<div class="text-secodnary small font-italic">No data available</div>`);
                }
                else 
                {
                  $("#v_prescription_notes").html(result.prescription_notes);
                }
                // show modal
                $("#view_prescription_drug").modal('show');
            }
            else if (type == 'medication'){
                 // set field value
                 $("#pr_drug_name").val(result.medicineFK.med_product_name);
                 $("#pr_dosage").val(result.dosage);
                 $("#pr_route").val(result.route);
                 $("#pr_frequency").val(result.frequency);
                 $("#pr_quantity").val(result.quantity);
                 // show modal
                 $("#add_medication_pr").modal('show');
            }


        },
        error: () => console.error('GET ajax failed')
    });

}


/**
 * ===========================================================================
 * * PRESCRIPTION DRUG  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
  jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be today or before today');
    // EDIT PRESCRIPTION DRUG VALIDATION
    $('#editPrescriptionFormDrug').validate({
      debug: false,
      rules: {
        date_prescription_d: {
          required: true,
          beforeToday: true
        },
        edit_drug_medicationName: {
          required: true
        },
        edit_drug_dosage: {
          required: true
        },
        edit_drug_quantity: {
          required: true
        },
        edit_drug_frequency: {
          required: true
        },
        edit_drug_medicationTakenfor: {
          required: true
        },
        edit_drug_doc_id_prescription: {
          required: true
        }
      },
      messages: {      
        date_prescription_d: {
          required: "Please provide a prescription date",
        },
        edit_drug_medicationName: {
          required: "Please provide a medication name",
        },
        edit_drug_dosage: {
          required: "Please provide a dosage"
        },
        edit_drug_quantity: {
          required: "Please provide a quantity"
        },
        edit_drug_frequency: {
          required: "Please select frequency",
        },
        edit_drug_medicationTakenfor: {
          required: "Please provide a intake"
        },
        edit_drug_doc_id_prescription: {
          required: "Please select a doctor"
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
      submitHandler: () => editDrugPrescription()
    });
  
  
  });


// EDIT PRESCRIPTION - DRUG
editDrugPrescription = () => {

        var date_prescribed = $('#date_prescription_d').val();
        var med_id = $('#edit_medication_name').val();
        var dosage = $('#edit_dosage').val();
        var quantity = $('#edit_quantity').val();
        var frequency = $('#edit_frequency').val();
        var route = $('#edit_med_taken_for').val();
        var doc_id = $('#edit_doc_id_prescription').val();
        var prescription_notes = $('#edit_prescription_notes').val();
        var prescription_id = $('#u_patient_record_id_prescription').val();

    var data = {
        med_id,
        dosage,
        quantity,
        frequency,
        route,
        doc_id,
        prescription_notes,
        date_prescribed
    };
    console.log(data);

    $.ajax({
        url: `http://127.0.0.1:8000/record/updatePrescriptionDrug/${prescription_id}`,
        type: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'Application/json' },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
            console.log(result)
            // alert
            toastr.success('Prescription Drug Updated')
            // hide modal
            $("#edit_prescription_drug").modal('hide');
            // remove data in form
            document.getElementById("editMedicalHistoryForm").reset();

            //view prescription drug
            $("#v_medication_name").html(result.medicineFK.med_product_name);
            $("#v_date_prescribed").html(moment(result.date_prescribed).format("MMMM D, YYYY"));
            $("#v_dosage").html(result.dosage);
            $("#v_quantity").html(result.quantity);
            $("#v_frequency").html(result.frequency);
            $("#v_med_taken_for").html(result.route);
            $("#v_doc_id_prescription").html(result.doc_id);
            $("#v_prescription_notes").html(result.prescription_notes);
            // reload datatable
            $('#d_prescription_table').DataTable().ajax.reload();
        },
        error: () => console.error('GET ajax failed')
    });

}


/**
 * ===========================================================================
 * * PRESCRIPTION SUUPLY  = EDIT
 * ===========================================================================
 */
// VALIDATION
$(() => {
  jQuery.validator.addMethod("beforeToday", function(val,elem,params) {
    return this.optional(elem) || moment(val).isBefore(moment());
  }, 'Date must be today or before today');
    // EDIT PRESCRIPTION SUUPLY VALIDATION
    $('#editPrescriptionFormSupply').validate({
      debug: false,
      rules: {
        date_prescription_s: {
          required: true,
          beforeToday: true

        },
        edit_supply_medicationName: {
            required: true
          },
          edit_quantity_s: {
            required: true
          },
          edit_doc_id_prescription_s: {
            required: true
          }
        },
        messages: { 
          date_prescription_s: {
            required: "Please provide prescription date"
          },
          edit_supply_medicationName: {
            required: "Please provide a medication supply",
          },
          edit_quantity_s: {
            required: "Please provide a quantity"
          },
          edit_doc_id_prescription_s: {
            required: "Please select a doctor"
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
      submitHandler: () => editSupplyPrescription()
    });
  
  
  });


// EDIT PRESCRIPTION - SUPPLY
editSupplyPrescription = () => {

        var date_prescribed = $('#date_prescription_s').val();
        var supply_id = $('#edit_medication_supply').val();
        var quantity = $('#edit_quantity_s').val();
        var doc_id = $('#edit_doc_id_prescription_s').val();
        var prescription_notes = $('#edit_prescription_notes_s').val();
        var prescription_id = $('#patient_record_id_prescription_s').val();

    var data = {
        date_prescribed,
        supply_id,
        quantity,
        doc_id,
        prescription_notes
    };
    console.log(data);

    $.ajax({
        url: `http://127.0.0.1:8000/record/updatePrescriptionSupply/${prescription_id}`,
        type: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'Application/json' },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
            console.log(result)
            // alert
            toastr.success('Prescription Drug Updated')
            // hide modal
            $("#edit_prescription_supply").modal('hide');
            // remove data in form
            document.getElementById("editMedicalHistoryForm").reset();
            // reload datatable
            $('#s_prescription_table').DataTable().ajax.reload();
        },
        error: () => console.error('GET ajax failed')
    });

}

// Medication PR

 // run on load
 $(() => {

  // jQuery.validator.addMethod("beforeToday", function(val,elem,param) {
  //   return this.optional(elem) || moment(val).isBefore(moment());
  // }, 'Date must be before today');
  // jQuery.validator.addMethod("afterToday", function(val,elem,param) {
  //   return this.optional(elem) || moment(val).isAfter(moment());
  // }, 'Date must be after today');
// ADD MEDICATION VALIDATION
  $('#addMedicationPRForm').validate({
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
    submitHandler: () => addMedicationPR()
    
    
  });
// end run on load
});

// ADD MEDICATION PR
  addMedicationPR = () => {

  var drug_name               = $('#pr_drug_name').val();
  var dosage                  = $('#pr_dosage').val();
  var route                   = $('#pr_route').val();
  var frequency               = $('#pr_frequency').val();
  var quantity                = $('#pr_quantity').val();
  var medication_status       = $('#pr_medication_status').val();
  var refill                  = $('#pr_refill').val();
  var instructions            = $('#pr_instructions').val();
  var start_date              = $('#pr_start_date').val();
  var end_date                = $('#pr_end_date').val();
  var patient_record_id       = $('#pr_patient_record_id').val();

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
      $("#add_medication_pr").modal('hide');
      document.getElementById("addMedicationPRForm").reset();
      
      // reload datatable
      $('#medication_table').DataTable().ajax.reload();
      
  },
    error: () => console.error('GET ajax failed')
});

// });
}
