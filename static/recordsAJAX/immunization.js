// 
// * ===========================================================================
// * * IMMUNIZATION DATATABLE
// * ===========================================================================
var data = $('#patient_record_id_record').val();
let immunization_table = $('#immunization_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    buttons: true,
    responsive: true,
    autoWidth: false,
    ajax: `/table/immunization/${ data }`,
    columns:[
        {data: 'vaccine'},
        {data: 'type'},
        {data: null,
          render: data => {
            const date_given = moment(data.date_given).format("MMMM D, YYYY");
            const humanizedDateOccured = moment(data.date_given).fromNow();
            return `
                            <div class="d-flex align-items-baseline">
                                <div>
                                    <div>${date_given}</div>
                                    <div class="text-secondary small">Administered ${humanizedDateOccured}</div>
                                </div>
                            </div>
                        `;
          }},
        // {data: 'administered_by'},
        {data: null,
          render: data => {
            const recommendation = data.administered_by;
            if(data.administered_by == "") return `
                              <div class="d-flex align-items-baseline">
                                  <div>
                                      <div class="text-secodnary small font-italic">No data available</div>
                                  </div>
                              </div>`;
            else return `
                           ${data.administered_by}`;
          }},
    // {data: null,
    //   class: 'text-center',
    //   render: data => {
    //       return `
    //       <div class="text-center dropdown">
    //           <!-- Dropdown toggler -->
    //           <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">
    //               <i class="fas fa-ellipsis-v"></i>
    //           </div>

    //           <!-- dropdown menu -->
    //           <div class="dropdown-menu dropdown-menu-right">
    //               <div class="dropdown-item d-flex" 
    //                       role="button"
    //                       onClick="editImmunizationModal('${data.immunization_id}', 'view')">
    //                   <div style="width: 2rem;">
    //                     <i class="fas fa-file-alt mr-1"></i>
    //                   </div>
    //                   <div>View Immunization</div>
    //               </div>
    //               <div class="dropdown-divider"></div>
    //               <div role="button"
    //                    data-toggle="modal" 
    //                    data-target="#">
    //                    </div>
                       
    //               <div class="dropdown-item d-flex"
    //                       role="button"
    //                       onClick="">
    //                   <div style="width: 2rem;">
    //                   <i class="fas fa-edit mr-1"></i>
    //                   </div>
    //                   <div>Edit Allergy</div>
    //               </div>
    //               <div role="button"
    //                    data-toggle="modal" 
    //                    data-target="#view_diagnostic_result">
    //           </div>
    //       </div>
    //       `
    //   }}
  ],
    initComplete: function(){
        immunization_table.buttons().container().appendTo('#immunization_table_wrapper .col-md-6:eq(0)')
    }
  })




 // run on load
 $(() => {

    // ADD IMMUNIZATION VALIDATION
      $('#addImmunizationForm').validate({
        debug: false,
        rules: {
          vaccine: {
            required: true
          },
          date_given: {
            required: true
          },
          type: {
            required: true,
          }
        },
        messages: {      
            vaccine: {
              required: "This field is required"
            },
            date_given: {
              required: "This field is required"
            },
            type: {
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
        submitHandler: () => addImmunization()
        
        
      });
  // end run on load
  });
  
  // ADD IMMUNIZATION
      addImmunization = () => {
  
      var vaccine               = $('#vaccine').val();
      var date_given            = $('#date_given').val();
      var type                  = $('#type').val();
      var administered_by       = $('#administered').val();
      var patient_record_id     = $('#patient_record_id').val();
  
      var data = {
          patient_record_id,
          vaccine,
          date_given,
          type,
          administered_by
      };
    console.log(data);
    // e.preventDefault();
  
    $.ajax({
      url: 'http://127.0.0.1:8000/record/recordImmunization',
        type: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: result => {
          console.log(result)
          toastr.success('Immunization Added')
          $("#immunization_modal").modal('hide');
          document.getElementById("addImmunizationForm").reset();
          
          // reload datatable
          $('#immunization_table').DataTable().ajax.reload();
          
      },
        error: () => console.error('GET ajax failed')
    });
  
  // });
  }
  
//   // EDIT Immunization
// function editImmunizationModal(immunization_id,type){
//   console.log(immunization_id);

//   $.ajax({
//       url: `http://127.0.0.1:8000/record/ShowImmunization/${immunization_id}`,
//       type: 'GET',
//       mode: 'cors',
//       headers: {'Content-Type': 'Application/json'},
//       dataType: 'json',
//       contentType: 'application/json; charset=utf-8',
//       // data: JSON.stringify(prescription_id),
//       success: result => {
//           console.log(result)
//           if(type == 'edit'){

//           // set field value
//           $("#edit_result").val(result.result);
//           $("#edit_detailed_result").val(result.detailed_result);
//           $("#edit_specimen").val(result.specimen);
//           $("#edit_unit").val(result.unit);
//           $("#edit_reference").val(result.reference);
//           $("#edit_status").val(result.status);
//           $("#u_edit_lab_result").val(result.lab_result_id);

//           // show modal
//           $("#edit_lab_result").modal('show');
//           }
//           else if(type == 'view'){

//           // set field value
//           $("#v_vaccine").html(result.vaccine);
//           $("#v_type").html(result.type);
//           $("#v_date_given").html(result.date_given);
//           $("#v_administered_by").html(result.administered_by);
         

//           // show modal
//           $("#view_immunization_modal").modal('show');
//           }
//     },
//       error: () => console.error('GET ajax failed')
//   });

// }