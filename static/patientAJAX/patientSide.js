/**
* ===========================================================================
* * VIEW REQUEST FUNCTION
* ===========================================================================
*/

$(function () {
  var patient_id = localStorage.getItem('patient_id');
  $.ajax({
      url: `http://127.0.0.1:8000/patient/patientSide/${patient_id}`,
      type: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'Application/json'},
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: result => {
          console.log(result)

              $('#view_patient_name').html(result.patientrecordFK.first_name+' '+result.patientrecordFK.last_name);
              $('#view_patient_gender').html(result.patientrecordFK.sex);
              var bday = moment(result.patientrecordFK.birthday).format("MMMM D, YYYY");
              $('#view_patient_bday').html(bday);
              $('#view_patient_contact').html(result.patientrecordFK.contact_number);
              $('#view_patient_guardian').html(result.patientrecordFK.guardian);
              $('#view_patient_address').html(result.patientrecordFK.street+', '+ 
                                              result.patientrecordFK.barangay+', '+ 
                                              result.patientrecordFK.municipality+', '+ 
                                              result.patientrecordFK.province+', '+
                                              result.patientrecordFK.region);
              $('#view_patient_weight').html(result.patientrecordFK.weight);
              $('#view_patient_height').html(result.patientrecordFK.height);
              $('#view_patient_blood_type').html(result.patientrecordFK.blood_type);
              var bmi = (result.patientrecordFK.weight / ((result.patientrecordFK.height * result.patientrecordFK.height) / 10000)).toFixed(2);
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

                $('#view_patient_bmi').html(bmi);
                $('#view_patient_bmi_status').html(bmi_status);
            },
      error: () => console.error('GET ajax failed')
});
});


// // * ===========================================================================
// // * * VIEW PATIENT RECORDS
// // * ===========================================================================
// $(function () {
//   // GET PATIENT RECORDS
//   var patient_id = $('#patient_id').val();
           

//             var data = {patient_id};

//             $.ajax({
//               url: 'http://127.0.0.1:8000/patient/patientSide',
//                 type: 'GET',
//                 mode: 'cors',
//                 headers: {'Content-Type': 'Application/json'},
//                 dataType: 'json',
//                 contentType: 'application/json; charset=utf-8',
//                 data: JSON.stringify(data),
//                 success: result => {
//                   console.log(result)
                 
                 
//   // * ===========================================================================
//   // * * VIEW PATIENT RECORDS - DEMOGRAPHICS
//   // * ===========================================================================  
//                     $('#patient_name').html(result[0].patientrecordFK.last_name+', '+
//                                             result[0].patientrecordFK.first_name+' '+
//                                             result[0].patientrecordFK.middle_name);
//                     $('#patient_weight').html(result[0].patientrecordFK.weight);
//                     $('#patient_height').html(result[0].patientrecordFK.height);
//                     $('#patient_blood_type').html(result[0].patientrecordFK.blood_type);
//                     $('#patient_guardian').html(result[0].patientrecordFK.guardian);
//                     $('#patient_gender').html(result[0].patientrecordFK.gender);
//                     var bday = moment(result[0].patientrecordFK.birth_date).format("MMMM D, YYYY");
//                     $('#patient_bday').html(bday);
//                     $('#patient_contact').html(result[0].patientrecordFK.contact_number);
//                     $('#patient_address').html(result[0].patientrecordFK.street+', '+
//                                                 result[0].patientrecordFK.barangay+', '+
//                                                 result[0].patientrecordFK.municipality+', '+
//                                                 result[0].patientrecordFK.province+', '+
//                                                 result[0].patientrecordFK.region);
//                 }
//             })
// })