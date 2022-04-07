// 
// * ===========================================================================
// * * MEDICAL RECORD DATATABLE
// * ===========================================================================
let table = $('#table').DataTable({
  serverSide: true,
  processing:true,
  pageLength: 10,
  responsive: true,
  ajax: '/table/all',
  columns:[
    //   {data: 'patient_record_id'},
        {data: 'first_name',
              class: 'text-left',
              render: function ( data, type, row ) {
              return row.first_name + ' ' + row.middle_name + ' ' + row.last_name ;
              }},
        {data: null,
            render: (data) => {
                const sex = data.sex
                if (sex == 'Male') {
                    icon = '<i class="fas fa-mars text-blue"></i>'
                } else {
                    icon = '<i class="fas fa-venus text-danger"></i>'
                }
                return `
                        <a>
                        ${ icon }
                        ${ sex }
                        </a>
                    `
        }},
        {data: null,
            render: (data) => {
  
              var Bdate = data.birthday
              var Bday = +new Date(Bdate);
              var bday = ((Date.now() - Bday) / (31557600000));
              var intvalue = Math.floor( bday );
  
              return `
                ${ intvalue }
              `
        }},
        {data: null,
            render: (data) => {
              return `
                <a>
                  <i class="fas fa-burn"></i>
                  ${ data.blood_type }
                </a>
              `
        }},
        {data: null,
            render: (data) => {
              const patient_type = data.patient_type
  
              if (patient_type == 'Inpatient') {
                icon = 'procedures'
                message = 'Inpatient'
                button = 'primary'
              } else if (patient_type == 'Outpatient') {
                icon = 'hospital-user'
                message = 'Outpatient'
                button = 'info'
              } else if (patient_type == 'Discharge'){
                icon = 'door-open'
                message = 'Discharge'
                button = 'dark'
              } else {
                icon = 'dot-circle'
                message = 'Not Assigned Yet'
                button = 'dark'
              }
  
              return `
  
                <div class="badge badge-${button} p-2 w-100">
                  <i class="fas fa-${icon} mr-1"></i>
                  <span>${message}</span>
                </div>
              `
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
                          <!--<div class="dropdown-item d-flex" 
                                  role="button" 
                                  onclick="window.open( '/record','_top' ); return false;">
                              <div style="width: 2rem;">
                                  <i class="fas fa-plus mr-1"></i>
                              </div>
                              <div>Add Medical Record</div>
                          </div>-->
                          <div class="dropdown-item d-flex" 
                                  role="button" 
                                  onclick="window.open( '/record/patientRecord/${ data.patient_record_id }','_top' ); return false;">
                              <div style="width: 2rem;">
                                  <i class="fas fa-list mr-1"></i>
                              </div>
                              <div>View Medical Record</div>
                          </div>
                          <div class="dropdown-divider"></div>
                          <div class="dropdown-item d-flex" 
                                  role="button"
                                  onclick     = "window.open( '/record/patientCallLog/${ data.patient_record_id }','_top' ); return false;">
                              <div style="width: 2rem;">
                                  <i class="fas fa-file-alt mr-1"></i>
                              </div>
                              <div>View Patient Call Log</div>
                          </div>
                      </div>
                  </div>
                  `
              }}
  ],
  initComplete: function(){
      table.buttons().container().appendTo('#table_wrapper .col-md-6:eq(0)')
  }
})

// * ===========================================================================
// * * VIEW PATIENT RECORDS
// * ===========================================================================
$(function () {
        // GET PATIENT RECORDS
        var patient_record_id = $('#patient_record_id_record').val();
        var patient_id = $('#patient_id_record').val();
                  

                  var data = {patient_record_id,patient_id};

                  $.ajax({
                    url: 'http://127.0.0.1:8000/record/patientRecord',
                      type: 'POST',
                      mode: 'cors',
                      headers: {'Content-Type': 'Application/json'},
                      dataType: 'json',
                      contentType: 'application/json; charset=utf-8',
                      data: JSON.stringify(data),
                      success: result => {
                        console.log(result)
                       
                        
// * ===========================================================================
// * * VIEW PATIENT RECORDS - DEMOGRAPHICS
// * ===========================================================================   
                        $('#patient_name').html(result[0].patientrecordFK.last_name+', '+
                                                result[0].patientrecordFK.first_name+' '+
                                                result[0].patientrecordFK.middle_name);
                        $('#patient_weight').html(result[0].patientrecordFK.weight);
                        $('#patient_height').html(result[0].patientrecordFK.height);
                        $('#patient_blood_type').html(result[0].patientrecordFK.blood_type);
                        $('#patient_guardian').html(result[0].patientrecordFK.guardian);
                        $('#patient_gender').html(result[0].patientrecordFK.sex);
                         var bday = moment(result[0].patientrecordFK.birthday).format("MMMM D, YYYY");
                        $('#patient_bday').html(bday);
                        var type = result[0].patientrecordFK.patient_type;
                        if(type == "Inpatient"){
                            $('#patient_type').addClass("bg-primary");
                        }else if (type == "Outpatient"){
                            $('#patient_type').addClass("bg-info");
                        }else if (type == "Discharge"){
                            $('#patient_type').addClass("bg-dark");
                        }
                        
                        $('#patient_type').html(type);
                        $('#patient_contact').html(result[0].patientrecordFK.contact_number);
                        $('#patient_address').html(result[0].patientrecordFK.street+', '+
                                                    result[0].patientrecordFK.barangay+', '+
                                                    result[0].patientrecordFK.municipality+', '+
                                                    result[0].patientrecordFK.province+', '+
                                                    result[0].patientrecordFK.region);

                                                    var bmi = (result[0].patientrecordFK.weight / ((result[0].patientrecordFK.height * result[0].patientrecordFK.height) / 10000)).toFixed(2);
                                                    // Dividing as per the bmi conditions
                                                    var bmi_status = ""
                                                      if (bmi < 18.6) 
                                                      {
                                                          bmi_status = "Under Weight"
                                                      }
                                      
                                                      else if (bmi >= 18.6 && bmi < 24.9)
                                                      {
                                                           bmi_status = "Normal"
                                                      }
                                      
                                                      else 
                                                      {
                                                          bmi_status = "Over Weight"
                                                      }
                                      
                                                      $('#patient_bmi').html(bmi);
                                                      $('#patient_bmi_status').html(bmi_status);
                        
// * ===========================================================================
// * * VIEW PATIENT RECORDS - HISTORY
// * =========================================================================== 
                                                    
                        // var history_length = result[0].historyrecordFK.length;
                        // if(history_length === 0){
                        //   $('#history_btn').html(`<button type="button" class="btn btn-sm btn-primary float-right" data-toggle="modal" 
                        //                             data-target="#medical_history_modal">
                        //                             <span>Add Medical History</span>
                        //                             <i class="fa fa-plus ml-1"></i>
                        //                         </button>`);
                        //   $('#p_history').replaceWith(`<div class="text-center">
                        //                       <br>
                        //                       <p class="text-center text-muted history"><i class="fas fa-history"></i>&nbsp;&nbsp;No information available
                        //                       </p>
                        //                       </div`);
                        // } else if (history_length > 0) {
                        //   $('#history_btn').html(`<button type="button" class="btn btn-sm btn-primary float-right" data-toggle="modal" 
                        //                               data-target="#edit_medical_history_modal">
                        //                                   <span>Edit Medical History</span>
                        //                                   <i class="fa fa-edit ml-1"></i>
                        //                           </button>`);
                        // }
                        //   $('#history-chief_complaint').html(result[0].historyrecordFK[0].chief_complaint);

                        if(result[3] === null){
                            $('#p_history').html(`<div class="card-body"><br>
                                                        <p class="text-center text-muted history">
                                                            <i class="fas fa-history"></i>&nbsp;&nbsp;No information available
                                                        </p>
                                                    </div>`)
                        }else{
                            $('#history-chief_complaint').html(result[3].chief_complaint);
                            $('#history-prev_hospital').html(result[3].previous_hospital);
                            $('#history-prev_doctor').html(result[3].previous_doctor);
                            $('#history-prev_diagnosis').html(result[3].previous_diagnosis);
                            $('#history-prev_treatment').html(result[3].previous_treatment);
                            $('#history-prev_surgeries').html(result[3].previous_surgeries);
                            $('#history-prev_medication').html(result[3].previous_medication);
                            $('#history-health_conditions').html(result[3].health_conditions);
                            $('#history-special_privileges').html(result[3].special_privileges);
                            $('#history-family_history').html(result[3].family_history);
                        }
                        
                          
                        

          
                        
// * ===========================================================================
// * * VIEW PATIENT RECORDS - ATTACHMENT GALLERY
// * =========================================================================== 

                        for(var i=0; i<result[0].record_attachmentFK.length; i++){
                            $('#attachment_img').append(`<div class="col-sm-3">
                                                    <a href="/static/app/files/${result[0].record_attachmentFK[i].attachment}?text=${i}" data-toggle="lightbox"  data-title="${result[0].record_attachmentFK[i].type} "data-gallery="gallery">
                                                        <img src="/static/app/files/${result[0].record_attachmentFK[i].attachment}?text=${i}" class="img-fluid mb-2" alt="white sample"/>                                           
                                                        <a href="/static/app/files/${result[0].record_attachmentFK[i].attachment}" download="attachment">
                                                            <img src="/static/app/files/${result[0].record_attachmentFK[i].attachment}" alt="attachment" width="104" height="142" hidden>
                                                            <i class="fas fa-download"></i>
                                                        </a>
                                                    </a><br><br>
                                                </div>`)
                        }
                    
                       
// * ===========================================================================
// * * VIEW PATIENT RECORDS - DOCTORS = POPULATE SELECT FIELD
// * ===========================================================================  

// ADD DIAGNOSTIC RESULT
var select = $('#doc_id').empty();

        $.each(result[2], function(i,item) {
            select.append( '<option value="'
                                 + item.doc_id
                                 + '">'
                                 + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                                 + '</option>' ); 
        });   
        
// ADD PROGRESS NOTES
var select = $('#clinical_doc_id').empty();

        $.each(result[2], function(i,item) {
            select.append( '<option value="'
                                 + item.doc_id
                                 + '">'
                                 + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                                 + '</option>' ); 
        });  
        
// ADD PRESCRIPTION
var select = $('#doc_id_prescription').empty();

        $.each(result[2], function(i,item) {
            select.append( '<option value="'
                                 + item.doc_id
                                 + '">'
                                 + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                                 + '</option>' ); 
        });  
        
// ADD DISCHARGE
var select = $('#doc_id_discharge').empty();

        $.each(result[2], function(i,item) {
            select.append( '<option value="'
                                 + item.doc_id
                                 + '">'
                                 + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                                 + '</option>' ); 
        });  
// Update Prescription Supply
var select = $('#edit_doc_id_prescription_s').empty();

        $.each(result[2], function(i,item) {
            select.append( '<option value="'
                                 + item.doc_id
                                 + '">'
                                 + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                                 + '</option>' ); 
        });  
// Update Prescription Drug
var select = $('#edit_doc_id_prescription').empty();

        $.each(result[2], function(i,item) {
            select.append( '<option value="'
                                 + item.doc_id
                                 + '">'
                                 + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                                 + '</option>' ); 
        });  
// Update Patient Discharge
var select = $('#edit_doc_id_discharge').empty();

        $.each(result[2], function(i,item) {
            select.append( '<option value="'
                                 + item.doc_id
                                 + '">'
                                 + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                                 + '</option>' ); 
        });  

 // Update Diagnostic Result
var select = $('#edit_doc_id_diagnosis').empty();

$.each(result[2], function(i,item) {
    select.append( '<option value="'
                         + item.doc_id
                         + '">'
                         + 'Dr. '+ item.last_name +', '+ item.first_name +' '+item.middle_name +', '+ item.department
                         + '</option>' ); 
});  
    
// * ===========================================================================
// * * VIEW PATIENT RECORDS - MEDICINE = POPULATE SELECT FIELD
// * ===========================================================================  

// Add Prescription Drug
 var select = $('#med_id_prescription').empty();
    
 $.each(result[4], function(i,item) {
     select.append( '<option value="'
                          + item.id
                          + '">'
                          + item.med_product_name
                          + '</option>' ); 
 });

 // Add Prescription Supply
 var select = $('#supply_id_prescription').empty();
    
 $.each(result[5], function(i,item) {
     select.append( '<option value="'
                          + item.id
                          + '">'
                          + item.ms_product_name
                          + '</option>' ); 
 });

// Edit Prescription Drug
 var select = $('#edit_medication_name').empty();
    
 $.each(result[4], function(i,item) {
     select.append( '<option value="'
                          + item.id
                          + '">'
                          + item.med_product_name
                          + '</option>' ); 
 });

 // Edit Prescription Supply
 var select = $('#edit_medication_supply').empty();
    
 $.each(result[5], function(i,item) {
     select.append( '<option value="'
                          + item.id
                          + '">'
                          + item.ms_product_name
                          + '</option>' ); 
 });



                    },
                      error: () => console.error('GET ajax failed')
                  });
            });