/**
 * ===========================================================================
 * * Surgery  = DATATABLE
 * ===========================================================================
 */
// DATATABLE
var data = $('#patient_record_id_record').val();
// console.log(data);
  let surgery_table = $('#surgery_table').DataTable({
        serverSide: true,
        processing:true,
        pageLength: 10,
        buttons: true,
        responsive: true,
        autoWidth: false,
    ajax: `/table/surgery_list/${ data }`,
    columns:[
      {data: 'name'},
      // {data: 'detailed_result'}, 
      {data: 'description'},
      {data: null,
        render: data => {
        if(data.status == 'Done') return `
              <div class="badge badge-success p-2 w-100" ><i class="fas fa-check mr-1"></i>${ data.status }</div>
              `;
        else if (data.status == 'Pending') return  `
            <div class="badge badge-warning p-2 w-100"><i class="fas fa-redo-alt mr-1"></i>${ data.status }</div>`;
            
        else if (data.status == 'Processing') return  `
            <div class="badge badge-info p-2 w-100"><i class="fas fa-spinner mr-1"></i>${ data.status }</div>`;
        else return  `
            <div class="badge badge-danger p-2 w-100"><i class="fas fa-ban mr-1"></i> ${ data.status }</div>`;
      }},
      // {data: 'status'},
    //   {data: null,
    //     render: data => {
    //     if(data.status == 'Unclaimed') return `
    //           <div class="badge badge-danger p-2 w-100" ><i class="fas fa-times mr-1"></i>${ data.status }</div>
    //           `;
    //     else if (data.status == 'Claimed') return  `
    //         <div class="badge badge-primary p-2 w-100"><i class="fas fa-check mr-1"></i>${ data.status }</div>`;
    //     else return  `
    //         <div class="badge badge-warning p-2 w-100"><i class="fas fa-redo-alt mr-1"></i> ${ data.status }</div>`;
    //   }},
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
                            onClick="viewSurgeryModal('${data.id}','view')"
                    >
                        <div style="width: 2rem;">
                            <i class="fas fa-file-alt mr-1"></i>
                        </div>
                        <div>View Surgery Record</div>
                    </div>
                </div>
            </div>
            `
        }}


    ],
    initComplete: function(){
      surgery_table.buttons().container().appendTo('#surgery_table_wrapper .col-md-6:eq(0)')
    }
})



// View Surgery
function viewSurgeryModal(id,type){
    console.log(id);
  
    $.ajax({
        url: `http://127.0.0.1:8000/record/ShowSurgery/${id}`,
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
            $("#v_surgery_type").html(result.surgery_type.name);
            $("#v_surgery_description").html(result.description);
            $("#v_surgery_status").html(result.status);
            $("#v_start_time").html(result.start_time);
            if (result.start_time == null){
                $("#v_start_time").html(`<div class="text-secodnary small font-italic">No date/time available</div>`);
              }
            else 
              {
                $("#v_start_time").html(moment(result.start_time).format("MMMM D, YYYY - hh:mm A"));
              }

            $("#v_end_time").html(result.end_time);
            if (result.end_time == null){
                $("#v_end_time").html(`<div class="text-secodnary small font-italic">No date/time available</div>`);
              }
            else 
              {
                $("#v_end_time").html(moment(result.end_time).format("MMMM D, YYYY - hh:mm A"));
              }
           
  
            // show modal
            $("#view_surgery").modal('show');
            }
      },
        error: () => console.error('GET ajax failed')
    });
  
  }