/**
 * ===========================================================================
 * * REQUEST DATATABLE
 * ===========================================================================
 */
// request datatable
let request_table = $('#request_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    responsive: true,
    autoWidth: false,
    ajax: '/recordRequest/allPatientRequest',
    columns:[
        {data: 'first_name',
                class: 'text-left',
                render: function ( data, type, row ) {
                return row.first_name + ` ` + row.last_name;
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
        {data: null,
            render: data => {
            if(data.active_status == 'Pending') return `
                  <div class="badge badge-info p-2 w-100" role="button" 
                        onClick="">
                        <i class="fas fa-redo mr-1"></i>${ data.active_status }</div>`;
            else  if(data.active_status == 'Approved') return  `
                <div class="badge badge-primary p-2 w-100"><i class="fas fa-check mr-1"></i>${ data.active_status }</div>`;
            else  if(data.active_status == 'Cancelled') return  `
                <div class="badge badge-warning p-2 w-100"><i class="fas fa-ban mr-1"></i>${ data.active_status }</div>`;
            else return  `
                <div class="badge badge-danger p-2 w-100"><i class="fas fa-times mr-1"></i>${ data.active_status }</div>`;
          }},
        {data: null,
            render: data => {
              const date_occured = moment(data.created_at).format("MMMM D, YYYY");
              const humanizedDateOccured = moment(data.created_at).fromNow();
              return `
                              <div class="d-flex align-items-baseline">
                                  <div>
                                      <div>${date_occured}</div>
                                      <div class="text-secondary small">Requested ${humanizedDateOccured}</div>
                                  </div>
                              </div>
                          `;
            }},
        {data: null,
                class: 'text-center',
                render: data => {
                    var cancel_btn = (data.active_status != 'Pending') ? 'display: none' : 'display: block';
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
                                    onClick="viewRequest('${data.request_id}','view')">
                                <div style="width: 2rem;">
                                    <i class="fas fa-eye mr-1"></i>
                                </div>
                                <div>View Request</div>
                            </div>

                            <div style="${cancel_btn};">   
                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item d-flex" 
                                        role="button"
                                        onClick="viewRequest('${data.request_id}','approve')">
                                    
                                    <div style="width: 2rem;">
                                        <i class="fas fa-check mr-1"></i>
                                    </div>
                                    <div>Approve Request</div>
                                </div>

                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item d-flex" 
                                        role="button"
                                        onClick="viewRequest('${data.request_id}','reject')">
                                    
                                    <div style="width: 2rem;">
                                        <i class="fas fa-times mr-1"></i>
                                    </div>
                                    <div>Reject Request</div>
                                </div>
                            
                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item d-flex" 
                                        role="button"
                                        onClick="viewRequest('${data.request_id}','cancel')">
                                    
                                    <div style="width: 2rem;">
                                        <i class="fas fa-times-circle mr-1"></i>
                                    </div>
                                    <div>Cancel Request</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                }}
    ],
    initComplete: function(){
        request_table.buttons().container().appendTo('#request_table_wrapper .col-md-6:eq(0)')
    }
  })


/**
 * ===========================================================================
 * * REQUEST DATATABLE - PENDING
 * ===========================================================================
 */
// request datatable
let pending_request_table = $('#pending_request_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    responsive: true,
    autoWidth: false,
    ajax: '/recordRequest/pendingPatientRequest',
    columns:[
        {data: 'first_name',
                class: 'text-left',
                render: function ( data, type, row ) {
                return row.first_name + ` ` + row.last_name;
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
        {data: null,
            render: data => {
            if(data.active_status == 'Pending') return `
                  <div class="badge badge-info p-2 w-100" role="button" 
                        onClick="">
                        <i class="fas fa-redo mr-1"></i>${ data.active_status }</div>`;
            else  if(data.active_status == 'Approved') return  `
                <div class="badge badge-primary p-2 w-100"><i class="fas fa-check mr-1"></i>${ data.active_status }</div>`;
            else return  `
                <div class="badge badge-danger p-2 w-100"><i class="fas fa-times mr-1"></i>${ data.active_status }</div>`;
          }},
        {data: null,
            render: data => {
              const date_occured = moment(data.created_at).format("MMMM D, YYYY");
              const humanizedDateOccured = moment(data.created_at).fromNow();
              return `
                              <div class="d-flex align-items-baseline">
                                  <div>
                                      <div>${date_occured}</div>
                                      <div class="text-secondary small">Requested ${humanizedDateOccured}</div>
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
                                    onClick="viewRequest('${data.request_id}','view')">
                                <div style="width: 2rem;">
                                    <i class="fas fa-eye mr-1"></i>
                                </div>
                                <div>View Request</div>
                            </div>
                           
                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item d-flex" 
                                    role="button"
                                    onClick="viewRequest('${data.request_id}','approve')">
                                  
                                <div style="width: 2rem;">
                                    <i class="fas fa-check mr-1"></i>
                                </div>
                                <div>Approve Request</div>
                            </div>

                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item d-flex" 
                                    role="button"
                                    onClick="viewRequest('${data.request_id}','reject')">
                                  
                                <div style="width: 2rem;">
                                    <i class="fas fa-times mr-1"></i>
                                </div>
                                <div>Reject Request</div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item d-flex" 
                                    role="button"
                                    onClick="viewRequest('${data.request_id}','cancel')">
                                  
                                <div style="width: 2rem;">
                                    <i class="fas fa-times-circle mr-1"></i>
                                </div>
                                <div>Cancel Request</div>
                            </div>
                        </div>
                    </div>
                    `
                }}
    ],
    initComplete: function(){
        pending_request_table.buttons().container().appendTo('#pending_request_table_wrapper .col-md-6:eq(0)')
    }
  })


/**
 * ===========================================================================
 * * VIEW REQUEST FUNCTION
 * ===========================================================================
 */
 function viewRequest(request_id,type){

    $.ajax({
        url: `http://127.0.0.1:8000/recordRequest/GetOnePatientRequest/${request_id}`,
        type: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'Application/json'},
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: result => {
            console.log(result)
            console.log(type)
            if (type == 'view'){

                // request details
                var info = result.request_information.split(',');
                var info_r = '';
                for(i=0;i<info.length;i++){
                    info_r += info[i]+'<br>';
                }
                // requester
                $('#view_requester_name').html(result.requesterFK.first_name+' '+result.requesterFK.last_name);
                $('#view_request_information').html(info_r);
                $('#view_disclosure_reason').html(result.disclosure_reason);
                $('#view_delivery').html(result.delivery);
                var email = (result.email) ?  result.email : `<div class="d-flex align-items-baseline">
                                                            <div>
                                                                <div class="text-secodnary small font-italic">No data</div>
                                                            </div>
                                                        </div>`
                $("#view_email").html(email);    
                var created_at = moment(result.created_at).format("MMMM D, YYYY");
                var humanizedDateOccured = moment(result.created_at).fromNow();
                $("#view_created_at").html(`<div class="d-flex align-items-baseline">
                                                <div>
                                                    <div>${created_at}</div>
                                                    <div class="text-secondary small">Requested ${humanizedDateOccured}</div>
                                                </div>
                                            </div>`);
                $('#view_active_status').html(result.active_status);


                
                // if(result.active_status != "Pending"){
                //     var date = moment(result.updated_at).format("MMMM D, YYYY")
                //     $('#request_action_btn').hide();
                //     if(result.active_status == "Rejected"){
                //         $('#ShowStat').html(`
                //                         <label>Status:</label> ${result.active_status}<br>
                //                         <label>Date reviewed:</label> ${date}<br>
                //                         <label>Reason for Rejection:</label> ${result.reason}<br><hr> `);
                //     }
                    
                // }
                
                switch(result.active_status) {
                    case ("Pending"):
                        $('#request_close_action_btn').hide();
                        $('#request_action_btn').show();
                        $('#v_review_reason').hide();
                        $('#v_review_date').hide();
                      console.log(result.active_status)
                      break;
                    case ("Rejected"):
                        $('#request_close_action_btn').show();
                        $('#request_action_btn').hide();
                        $('#v_review_reason').show();
                        $('#view_review_reason').html(result.review_reason);
                        $('#v_review_date').show();
                        $('#view_review_date').html( moment(result.updated_at).format("MMMM D, YYYY"));
                      console.log(result.active_status)
                      break;
                    case ("Cancelled"):
                        $('#request_close_action_btn').show();
                        $('#request_action_btn').hide();
                        $('#v_review_reason').show();
                        $('#view_review_reason').html(result.review_reason);
                        $('#v_review_date').show();
                        $('#view_review_date').html( moment(result.updated_at).format("MMMM D, YYYY"));
                      console.log(result.active_status)
                      break;
                    case ("Approved"):
                        $('#request_close_action_btn').show();
                        $('#request_action_btn').hide();
                        $('#v_review_reason').hide();
                        $('#v_review_date').show();
                        $('#view_review_date').html( moment(result.updated_at).format("MMMM D, YYYY"));
                      console.log(result.active_status)
                      break;
                    default:
                        $('#request_close_action_btn').hide();
                        $('#request_action_btn').show();
                        $('#v_review_reason').hide();
                        $('#v_review_date').hide();
                  }
                // set value for hidden input - approve modal
                $('#r_approve_request_id').val(result.request_id);
                $('#r_approve_patient_id').val(result.patient_id);
                $('#r_approve_delivery').val(result.delivery);
                $('#r_approve_email').val(result.email);

                // set value for hidden input - reject modal
                $('#r_request_id').val(result.request_id);

              $("#medical_request").modal('show');
            } else if (type == 'cancel'){
                // set value for hidden input - cancel request modal
                $('#cancel_request_id').val(result.request_id);
                $("#request_cancel_modal").modal('show');

                
            } else if (type == 'reject'){
                // set value for hidden input - reject modal
                $('#r_request_id').val(result.request_id);
                // show modal
                $("#r_medical_request").modal('show');
            } else if (type == 'approve'){
                // set value for hidden input - approve modal
                $('#r_approve_request_id').val(result.request_id);
                $('#r_approve_patient_id').val(result.patient_id);
                $('#r_approve_delivery').val(result.delivery);
                $('#r_approve_email').val(result.email);
                // show modal
                $("#approve_medical_request").modal('show');
            }
      },
        error: () => console.error('GET ajax failed')
    });
  
}


//run on load
$(document).ready(function () {
// # <!-- 
// # | =================================================================================
// # |                               Cancel Request -Admin
// # | =================================================================================
// # -->
    $("#requestCancelForm").validate({
        submitHandler: function (form) {
            console.log(1)
            var request_id =  $("#cancel_request_id").val();
            var review_reason =  $("textarea#a_reason").val();
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
                        toastr.info('Request deleted successfully')
  
                        //   hide modal
                        $("#request_cancel_modal").modal('hide');
                        //   remove data in form
                        document.getElementById("requestCancelForm").reset();
                        // reload datatable
                        $('#pending_request_table').DataTable().ajax.reload();
                        $('#request_table').DataTable().ajax.reload();
                    }else {
                        toastr.info('Request cannot be cancelled')
        
                        //   hide modal
                        $("#c_patient_request_modal").modal('hide');
                        //   remove data in form
                        document.getElementById("cancelRequestForm").reset();
                        // reload datatable
                        $('#pending_request_table').DataTable().ajax.reload();
                        $('#request_table').DataTable().ajax.reload();
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

/**
 * ===========================================================================
 * * REJECT REQUEST AJAX
 * ===========================================================================
 */
    $("#rejectRequestForm").validate({
        submitHandler: function (form) {
            console.log(1)
            var request_id      =  $("#r_request_id").val();
            var review_reason   = $('#r_reason').val();
            var active_status   = "Rejected";
            var data = {review_reason,active_status};
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
                        toastr.info('Request rejected')
  
                        //   hide modal
                        $("#r_medical_request").modal('hide');
                        //   remove data in form
                        document.getElementById("rejectRequestForm").reset();
                        // reload datatable
                        $('#pending_request_table').DataTable().ajax.reload();
                        $('#request_table').DataTable().ajax.reload();
                    }else {
                        toastr.info('Request cannot be rejected')
  
                        //   hide modal
                        $("#r_medical_request").modal('hide');
                        //   remove data in form
                        document.getElementById("rejectRequestForm").reset();
                        // reload datatable
                        $('#pending_request_table').DataTable().ajax.reload();
                        $('#request_table').DataTable().ajax.reload();
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
    
/**
 * ===========================================================================
 * * APPROVE REQUEST AJAX
 * ===========================================================================
*/
 $("#approveRequestForm").validate({
    submitHandler: function (form) {
        var request_id      = $("#r_approve_request_id").val();
        var patient_id      = $("#r_approve_patient_id").val();
        var email           = $('#r_approve_email').val();
        var delivery        = $('#r_approve_delivery').val();
        var data = {patient_id,email,delivery};
        console.log(data)
        $.ajax({
            url: `http://localhost:8000/recordRequest/approveRequest/${request_id}`,
            type: 'PUT',
            mode: 'cors',
            headers: {'Content-Type': 'Application/json'},
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            success: function (result) {
                if (result == 202){
                    toastr.success('Request approved')

                    //   hide modal
                    $("#approve_medical_request").modal('hide');
                    //   remove data in form
                    document.getElementById("approveRequestForm").reset();
                    // reload datatable
                    $('#pending_request_table').DataTable().ajax.reload();
                    $('#request_table').DataTable().ajax.reload();
                }else {
                    toastr.info('Request cannot be approved')

                    //   hide modal
                    $("#approve_medical_request").modal('hide');
                    //   remove data in form
                    document.getElementById("approveRequestForm").reset();
                    // reload datatable
                    $('#pending_request_table').DataTable().ajax.reload();
                    $('#request_table').DataTable().ajax.reload();
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
    




// end run on load
  });





 