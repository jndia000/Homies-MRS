/**
 * ===========================================================================
 * * USERS DATATABLE
 * ===========================================================================
 */
  let user_table = $('#user_table').DataTable({
    // language: {
    //     paginate: {
    //       next: '<i class="fa fa-caret-right"/>', 
    //       previous: '<i class="fa fa-caret-left"/>'
    //     }
    //   },
    serverSide: true,
        processing:true,
        // lengthChange: false,
        pageLength: 10,
        responsive: true,
        autoWidth: false,
    // buttons:[
    //     {extend: 'excel', text: 'Save to Excel File'}
    // ],
    ajax: `/table/users`,
    columns:[
        {data: 'title'},
        {data: 'email'},
        {data: null,
              render: data => {
                if(data.active_status == 'Active') return `
                    <div class="badge badge-primary p-2 w-100 role="button" 
                    onClick="userStatus('${data.user_id}','Inactive')"><i class="fas fa-user-check mr-1"></i>${ data.active_status }</div>
                    `;
                    
                if (data.active_status == 'Inactive') return  `
                    <div class="badge badge-danger p-2 w-100 role="button" 
                    onClick="userStatus('${data.user_id}','Active')"><i class="fas fa-user-slash mr-1"></i>${ data.active_status }</div>
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
                        <div class="dropdown-item d-flex" role="button"
                            onClick="userDetails('${data.user_id}','view')">
                            <div style="width: 2rem;">
                            <i class="fas fa-users mr-1"></i>
                            </div>
                            <div>View User Details</div>
                        </div>
                        <div class="dropdown-item d-flex" role="button"
                            onClick="userDetails('${data.user_id}','edit_')">
                            <div style="width: 2rem;">
                                <i class="fas fa-edit mr-1"></i>
                            </div>
                            <div>Edit User Details</div>
                            <div class="dropdown-divider"></div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item d-flex" role="button"
                            onClick="userDetails('${data.user_id}','edit')">
                            <div style="width: 2rem;">
                            <i class="fas fa-edit mr-1"></i>
                            </div>
                            <div>Edit User Credentials</div>
                        </div>
                    </div>
                </div>
                `
            }}
        
    ],
    initComplete: function(){
        user_table.buttons().container().appendTo('#user_table_wrapper .col-md-6:eq(0)')
    }
})
/**
 * ===========================================================================
 * * USER FUNCTIONS
 * ===========================================================================
 */
// function for user status 
function userStatus(user_id,status){

  $("#statusvalue").val(status);
  $("#user_idvalue").val(user_id);

  $("#updatestatusmodal").modal('show');
}
// function for user details
function userDetails(user_id,type){
  console.log(user_id);
  // $("#statusvalue").val(type);
  // $("#user_idvalue").val(user_id);

  $.ajax({
    url: `http://127.0.0.1:8000/user/ShowUsers/${user_id}`,
    type: 'GET',
    mode: 'cors',
    headers: {'Content-Type': 'Application/json'},
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    // data: JSON.stringify(prescription_id),
    success: result => {
        console.log(result)
        
        if(type == 'edit'){ //for user credentials modal
          $("#edit_role").val(result.user_typesFK.user_type_id);
          $("#edit_user_email").val(result.email);
          $("#user_id_value").val(result.user_id);
          // $("#edit_user_password").val(result.password);
          $("#userCredentialModal").modal('show');
        }else if(type == 'edit_'){
            $("#edit_user_fname").val(result.users_profilesFK[0].first_name);
            $("#edit_user_mname").val(result.users_profilesFK[0].middle_name);
            $("#edit_user_lname").val(result.users_profilesFK[0].last_name);
            $("#edit_user_suffix").val(result.users_profilesFK[0].suffix_name);
            $("#edit_user_birthdate").val(result.users_profilesFK[0].birth_date);
            $("#edit_user_house_number").val(result.users_profilesFK[0].region);
            $("#edit_user_street").val(result.users_profilesFK[0].street);
            $("#edit_user_barangay").val(result.users_profilesFK[0].barangay);
            $("#edit_user_municipality").val(result.users_profilesFK[0].municipality);
            $("#edit_user_province").val(result.users_profilesFK[0].province);
            $("#e_user_profile_id").val(result.users_profilesFK[0].user_profile_id);

            
            $("#edit_users").modal('show');
        }else if(type == 'view'){
            $("#v_user_name").html(result.users_profilesFK[0].first_name+' '+result.users_profilesFK[0].middle_name+' '+result.users_profilesFK[0].last_name+''+result.users_profilesFK[0].suffix_name);
            $("#v_role").html(result.user_typesFK.title);
            $("#v_user_email").html(result.email);
            $("#v_user_birth_date").html(moment(result.users_profilesFK[0].birth_date).format("MMMM D, YYYY"));
            $("#v_user_address").html(result.users_profilesFK[0].region+' '+
                                      result.users_profilesFK[0].street+' '+
                                      result.users_profilesFK[0].barangay+', '+
                                      result.users_profilesFK[0].municipality+', '+
                                      result.users_profilesFK[0].province);
            // show modal
            $("#view_users").modal('show'); 
        }
  },
    error: () => console.error('GET ajax failed')
});

}

// populate user type
$.ajax({
  url: 'http://127.0.0.1:8000/user/alluserType',
    type: 'GET',
    mode: 'cors',
    headers: {'Content-Type': 'Application/json'},
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    // data: JSON.stringify(data),
    success: result => {
            console.log(result.length)
            console.log(result[0].title)
            var options = '';
            for(i=0;i<result.length;i++){
              options +=`<option value="${ result[i].user_type_id }">${ result[i].title }</option>`;
            }
            $('#role').html(options);    
            $('#edit_role').html(options);    
  },
    error: () => console.error('GET ajax failed')
});
