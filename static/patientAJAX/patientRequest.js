var data = localStorage.getItem('patient_id');
console.log(data);
  let patient_pending_request_table = $('#patient_pending_request_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    responsive: true,
    autoWidth: false,
    ajax: `/recordRequest/patientPendingRequest/${ data }`,
    columns:[
        
        {data: 'created_at',
            render: data => {
              var humanizedCreatedAt = moment(data).format("MMMM D, YYYY");
              var humanizedDateOccured = moment(data).fromNow();
              return `
                              <div class="d-flex align-items-baseline">
                                  <div>
                                      <div>${humanizedCreatedAt}</div>
                                      <div class="text-secondary small">Requested ${humanizedDateOccured}</div>
                                  </div>
                              </div>
                          `;
            }},
        {data: null,
              render: data => {
              if(data.active_status == 'Pending') {return `
                    <div class="badge badge-info p-2 w-100"><i class="fas fa-redo mr-1"></i>${ data.active_status }</div>
                    `;}
                    else if (data.active_status == 'Approved')
                    {
                        return`
                        <div class="badge badge-primary p-2 w-100"><i class="fas fa-check mr-1"></i>${ data.active_status }</div>`;
                    }
                    else if (data.active_status == 'Cancelled')
                    {
                        return`
                        <div class="badge badge-warning p-2 w-100"><i class="fas fa-ban mr-1"></i>${ data.active_status }</div>`;
                    }
              else {return `
                  <div class="badge badge-danger p-2 w-100"><i class="fas fa-times mr-1"></i>${ data.active_status }</div>`;
                }
            }},
        {data: 'request_information',
            class: 'text-left',
            render: function ( data, type, row ) {
                var info = row.request_information.split(',');
                var request_info = '';
                for(i=0;i<info.length;i++){
                    request_info += info[i]+'<br>';
                }
                return request_info;
            }},
        {data: 'disclosure_reason'}, 

              {data: null,
                class: 'text-center',
                render: data => {
                    var cancel_btn = (data.active_status != 'Pending') ? 'display: none' : 'display: block';
                    var download_btn = (data.active_status != 'Approved') ? 'display: none' : 'display: block';
                
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
                                    onClick="editPatientRequest('${data.request_id}','view')">
                                <div style="width: 2rem;">
                                  <i class="fas fa-file-alt mr-1"></i>
                                </div>
                                <div>View Request</div>
                            </div>
                            <div role="button"
                                 data-toggle="modal" 
                                 data-target="#view_patient_request_modal">
                                 </div>
                            <div style="${cancel_btn};">    
                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item d-flex"
                                        role="button"
                                        onClick="editPatientRequest('${data.request_id}','cancel')"
                                        >
                                    <div style="width: 2rem;">
                                        <i class="fas fa-times-circle mr-1"></i>
                                    </div>
                                    <div>Cancel Request</div>
                                </div>
                            </div>
                            <div style="${download_btn};">    
                                <div class="dropdown-divider"></div>
                                <a href="static/app/pdf/${data.requested_file}" target="_blank">
                                    <div class="dropdown-item d-flex"
                                            role="button">
                                        <div style="width: 2rem;">
                                            <i class="fas fa-download mr-1"></i>
                                        </div>
                                        <div>Download Medical Record</div>
                                    </div>
                                </a>
                            </div>
                    </div>
                    `
                }}
        
    ],
    initComplete: function(){
      patient_pending_request_table.buttons().container().appendTo('#patient_pending_request_table_wrapper .col-md-6:eq(0)')
    }
})

  let patientrequest_table = $('#patientrequest_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    responsive: true,
    autoWidth: false,
    ajax: `/recordRequest/patientRequest/${ data }`,
    columns:[
        
        {data: 'created_at',
            render: data => {
              var humanizedCreatedAt = moment(data).format("MMMM D, YYYY");
              var humanizedDateOccured = moment(data).fromNow();
              return `
                              <div class="d-flex align-items-baseline">
                                  <div>
                                      <div>${humanizedCreatedAt}</div>
                                      <div class="text-secondary small">Requested ${humanizedDateOccured}</div>
                                  </div>
                              </div>
                          `;
            }},
        {data: null,
              render: data => {
              if(data.active_status == 'Pending') {return `
                    <div class="badge badge-info p-2 w-100"><i class="fas fa-redo mr-1"></i>${ data.active_status }</div>
                    `;}
                    else if (data.active_status == 'Approved')
                    {
                        return`
                        <div class="badge badge-primary p-2 w-100"><i class="fas fa-check mr-1"></i>${ data.active_status }</div>`;
                    }
                    else if (data.active_status == 'Cancelled')
                    {
                        return`
                        <div class="badge badge-warning p-2 w-100"><i class="fas fa-ban mr-1"></i>${ data.active_status }</div>`;
                    }
              else {return `
                  <div class="badge badge-danger p-2 w-100"><i class="fas fa-times mr-1"></i>${ data.active_status }</div>`;
                }
            }},
        {data: 'request_information',
            class: 'text-left',
            render: function ( data, type, row ) {
                var info = row.request_information.split(',');
                var request_info = '';
                for(i=0;i<info.length;i++){
                    request_info += info[i]+'<br>';
                }
                return request_info;
            }},
        {data: 'disclosure_reason'}, 

              {data: null,
                class: 'text-center',
                render: data => {
                    var cancel_btn = (data.active_status != 'Pending') ? 'display: none' : 'display: block';
                    var download_btn = (data.active_status != 'Approved') ? 'display: none' : 'display: block';
                
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
                                    onClick="editPatientRequest('${data.request_id}','view')">
                                <div style="width: 2rem;">
                                  <i class="fas fa-file-alt mr-1"></i>
                                </div>
                                <div>View Request</div>
                            </div>
                            <div role="button"
                                 data-toggle="modal" 
                                 data-target="#view_patient_request_modal">
                                 </div>
                            <div style="${cancel_btn};">    
                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item d-flex"
                                        role="button"
                                        onClick="editPatientRequest('${data.request_id}','cancel')"
                                        >
                                    <div style="width: 2rem;">
                                        <i class="fas fa-times-circle mr-1"></i>
                                    </div>
                                    <div>Cancel Request</div>
                                </div>
                            </div>
                            <div style="${download_btn};">    
                                <div class="dropdown-divider"></div>
                                <a href="static/app/pdf/${data.requested_file}" target="_blank">
                                    <div class="dropdown-item d-flex"
                                            role="button">
                                        <div style="width: 2rem;">
                                            <i class="fas fa-download mr-1"></i>
                                        </div>
                                        <div>Download Medical Record</div>
                                    </div>
                                </a>
                            </div>
                    </div>
                    `
                }}
        
    ],
    initComplete: function(){
        patientrequest_table.buttons().container().appendTo('#patientrequest_table_wrapper .col-md-6:eq(0)')
    }
})



// run on load
$(() => {

  // ADD patient request
    $('#addpatientrequestform').validate({
      debug: false,
      rules: {
        "request_info[]": {
          required: true,

        },
        reason: {
          required: true,
        },
        delivery: {
            required: true,
        }
      },
      messages: {      
        "request_info[]": {
          required: "Please choose atleast 1"
        },
        reason: {
          required: "Please choose a reason",
        },
        delivery: {
          required: "Please choose Delivery Preference"
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
      submitHandler: () => addPatientRequest()
      
      
    });
// end run on load
});

// ADD patient request
// $('#addProblembtn').click(function(e){
    addPatientRequest = () => {
  // var valid = this.form.checkValidity();

  // if(valid){
    var patient_id             = localStorage.getItem('patient_id');
    var request_information    = $('input:checkbox:checked.request_info').map(function(){return this.value; }).get().join(",");
    var disclosure_reason      = $("input[name='reason']:checked").val();
    var delivery               = $('#delivery').val();
    var email                  = $('#request_email').val();
  // }
  var data = {patient_id,request_information,disclosure_reason,delivery,email};
  console.log(data);
  // e.preventDefault();

  $.ajax({
    url: 'http://127.0.0.1:8000/recordRequest/addpatientRequest',
      type: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: result => {
        console.log(result)
        toastr.success('Request has been sent')
        document.getElementById("addpatientrequestform").reset();
        
        // reload datatable
        $('#patientrequest_table').DataTable().ajax.reload();
        setTimeout('window.location.href = "http://127.0.0.1:8000/records"', 1000)
        
    },
      error: () => console.error('GET ajax failed')
  });

// });
}


// EDIT/VIEW Patient Request
function editPatientRequest(request_id,type){
  console.log(request_id);

  $.ajax({
      url: `http://127.0.0.1:8000/recordRequest/ShowPatientRequest/${request_id}`,
      type: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      // data: JSON.stringify(prescription_id),
      success: result => {
          console.log(result)
          if(type == 'cancel'){
          $("#c_request_id").val(result.request_id);
          // show modal
          $("#c_patient_request_modal").modal('show');
          }
          else if(type == 'view'){

          // set field value
          $("#c_request_id").val(result.request_id);
          $("#v_request_information").html(result.request_information);
          $("#v_disclosure_reason").html(result.disclosure_reason);
          $("#v_delivery").html(result.delivery);
          var email = (result.email) ?  result.email : `<div class="d-flex align-items-baseline">
                                                            <div>
                                                                <div class="text-secodnary small font-italic">No data</div>
                                                            </div>
                                                        </div>`
          $("#v_email").html(email);
          $("#v_active_status").html(result.active_status);
          var created_at = moment(result.created_at).format("MMMM D, YYYY");
          var humanizedDateOccured = moment(result.created_at).fromNow();
          $("#v_created_at").html(`<div class="d-flex align-items-baseline">
                                        <div>
                                            <div>${created_at}</div>
                                            <div class="text-secondary small">Requested ${humanizedDateOccured}</div>
                                        </div>
                                    </div>`);      
            // var status_badge = "";
            switch(result.active_status) {
              case ("Pending"):
                // status_badge = `<span title="Pending" class="badge bg-warning"><i class="fas fa-exclamation-triangle ml-1"></span>`
                $('#block_reason').hide();
                $('#block_review_date').hide();
                $('#download_request_btn').hide();
                $('#cancelBtn').show();
                console.log(result.active_status)
                break;
              case ("Rejected"):
                $('#cancelBtn').hide();
                $('#download_request_btn').hide();
                $('#block_reason').show();
                $('#block_review_date').show();
                $("#v1_reivew_reason").html(result.review_reason);
                $("#v_rev_date").html(moment(result.updated_at).format("MMMM D, YYYY"));
                console.log(result.active_status)
                break;
              case ("Approved"):
                $('#cancelBtn').hide();
                $('#block_reason').hide();
                $('#block_review_date').show();
                $("#v_rev_date").html(moment(result.updated_at).format("MMMM D, YYYY"));
                $('#download_request_btn').show();
                $('#download_request_btn').html(`<a href="static/app/pdf/${result.requested_file}" target="_blank">
                                                    <button class ="btn btn-primary" role="button" >Downlad Medical Record<i class="fas fa-download  ml-1"></i></button>
                                                  </a>`)
                console.log(result.active_status)
                break;
              default:
                $('#block_reason').hide();
                $('#block_review_date').hide();
                $('#block_reason').hide();
                $('#download_request_btn').hide();
            }
          // if(result.active_status == "Approved"){
          //   $('#cancelBtn').hide();
          //   $('#download_request_btn').html(`<a href="static/app/pdf/${result.requested_file}" target="_blank">
          //                                       <button class ="btn btn-primary" role="button" >Downlad Medical Record<i class="fas fa-download  ml-1"></i></button>
          //                                     </a>`)
          // }else if(result.active_status == "Rejected"){
          //   $('#cancelBtn').hide();
          //   $('#download_request_btn').hide();
          //   $("#v_reiew_reason").html(result.review_reason);

          // }else if (result.active_status == "Pending"){
          //   $('#block_reason').hide();
          //   $('#download_request_btn').hide();
          // }

          // show modal
          $("#view_patient_request_modal").modal('show');
                // reload datatable
                $('#patientrequest_table').DataTable().ajax.reload(); 
          }
    },
      error: () => console.error('GET ajax failed')
  });

}



// # <!-- 
// # | =================================================================================
// # |                               Cancel Request
// # | =================================================================================
// # -->

$(document).ready(function () {
  $("#cancelRequestForm").validate({
      submitHandler: function (form) {
          var request_id =  $("#c_request_id").val();
          var review_reason =  $("textarea#c_reason").val();
          var active_status =  'Cancelled';
          var data = {review_reason, active_status}
          $.ajax({
              url: `http://localhost:8000/recordRequest/statusRequest/${request_id}`,
              type: 'PUT',
              mode: 'cors',
              headers: {'Content-Type': 'Application/json'},
              dataType: 'json',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify(data),
              success: function (result) {
                if (result == 202){
                  toastr.info('request deleted successfully')

                //   hide modal
                $("#c_patient_request_modal").modal('hide');
                //   remove data in form
                document.getElementById("cancelRequestForm").reset();
                // reload datatable
                $('#patientrequest_table').DataTable().ajax.reload();
                }
                else {
                toastr.info('request cannot be cancelled')

                //   hide modal
                $("#c_patient_request_modal").modal('hide');
                //   remove data in form
                document.getElementById("cancelRequestForm").reset();
                // reload datatable
                $('#patientrequest_table').DataTable().ajax.reload();
                }
                
              },
              error: function (result) {
                  toastr.error(result.responseJSON.detail);
              },
          });
      },
      errorElement: "span",
      errorPlacement: function (error, element) {
          error.addClass("invalid-feedback");
          element.closest(".input-group ").append(error);
      },
      highlight: function (element, errorClass, validClass) {
          $(element).addClass("is-invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
          $(element).removeClass("is-invalid");
      },
  });
});

