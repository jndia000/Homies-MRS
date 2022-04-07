// /**
//  * ===========================================================================
//  * * HISTORY  = EDIT
//  * ===========================================================================
//  */
// // VALIDATION
// // on load
// $(() => {
//   // EDIT HISTORY VALIDATION
//   $("#editMedicalHistoryForm").validate({
//     debug: false,
//     rules: {
//       general_physician_update: {
//         required: true,
//       },
//       chief_complaint_update: {
//         required: true,
//       },
//     },
//     messages: {
//       general_physician_update: {
//         required: "Please provide a physician",
//       },
//       chief_complaint_update: {
//         required: "Please provide chief of complaint ",
//       },
//     },
//     errorElement: "div",
//     errorPlacement: function (error, element) {
//       error.addClass("invalid-feedback");
//       element.closest(".form-group").append(error);
//     },
//     highlight: function (element, errorClass, validClass) {
//       $(element).addClass("is-invalid");
//     },
//     unhighlight: function (element, errorClass, validClass) {
//       $(element).removeClass("is-invalid");
//     },
//     submitHandler: () => editHistory(),
//   });

//   // end on load
// });

// // EDIT MEDICAL HISTORY
// // $('#editHistorybtn').click(function(e){
// editHistory = () => {
//   // var valid = this.form.checkValidity();

//   // if(valid){
//   var general_physician = $("#general_physician_update").val();
//   var chief_complaint = $("#chief_complaint_update").val();
//   var medical_history = $("#medical_history_update").val();
//   var allergy = $("#allergy_update").val();
//   var medication = $("#medication_update").val();
//   var family_history = $("#family_history_update").val();
//   var patient_history_id = $("#patient_history_id_update").val();

//   // }
//   var data = {
//     general_physician,
//     chief_complaint,
//     medical_history,
//     allergy,
//     medication,
//     family_history,
//   };
//   console.log(data);
//   // e.preventDefault();
//   // const patient_record_id_h      = $('#u_patient_record_mh').val();

//   $.ajax({
//     url: `http://127.0.0.1:8000/record/updateMedicalHistory/${patient_history_id}`,
//     type: "PUT",
//     mode: "cors",
//     headers: { "Content-Type": "Application/json" },
//     dataType: "json",
//     contentType: "application/json; charset=utf-8",
//     data: JSON.stringify(data),
//     success: (result) => {
//       console.log(result);
//       // alert
//       toastr.success("Medical History Updated");
//       // hide modal
//       $("#edit_medical_history_modal").modal("hide");
//       // remove data in form
//       document.getElementById("editMedicalHistoryForm").reset();

//       //medical history
//       $("#p_history").html(`<div class="row">
//           <div class="col-md-6">
//             <p><label>Chief of Complaint: </label>
//               ${result.chief_complaint}
//             </p>
//             <p><label>Past Illness: </label>
//               ${result.medical_history}
//             </p>

//             <p><label>Allergy: </label>
//               ${result.allergy}
//             </p>
//           </div>

//           <div class="col-md-6">
//             <p><label>General Physician: </label>
//               ${result.general_physician}
//             </p>

//             <p><label>Medication: </label>
//               ${result.medication}
//             </p>

//             <p><label>Family History: </label>
//               ${result.family_history}
//             </p>
//           </div>
//         </div>`);
//     },
//     error: () => console.error("GET ajax failed"),
//   });
// };

// /**
//  * ===========================================================================
//  * * HISTORY  = ADD
//  * ===========================================================================
//  */
// // VALIDATION
// // on load
// $(() => {
//   // ADD HISTORY VALIDATION
//   $("#addHistoryForm").validate({
//     debug: false,
//     rules: {
//       chief_complaint: {
//         required: true,
//       },
//     },
//     messages: {
//       chief_complaint: {
//         required: "Please provide chief of complaint ",
//       },
//     },
//     errorElement: "div",
//     errorPlacement: function (error, element) {
//       error.addClass("invalid-feedback");
//       element.closest(".form-group").append(error);
//     },
//     highlight: function (element, errorClass, validClass) {
//       $(element).addClass("is-invalid");
//     },
//     unhighlight: function (element, errorClass, validClass) {
//       $(element).removeClass("is-invalid");
//     },
//     submitHandler: () => addHistory(),
//   });

//   // end on load
// });

// // ADD MEDICAL HISTORY
// // $('#addHistory').click(function(e){
// addHistory = () => {
//   // var valid = this.form.checkValidity();

//   // if(valid){
//   var chief_complaint       = $("#chief_complaint").val();
//   var previous_hospital     = $("#previous_hospital").val();
//   var previous_doctor       = $("#previous_doctor").val();
//   var previous_diagnosis    = $("#previous_diagnosis").val();
//   var previous_treatment    = $("#previous_treatment").val();
//   var previous_surgeries    = $("#previous_surgeries").val();
//   var previous_medication   = $("#previous_medication").val();
//   var health_condition      = $("#health_condition").val();
//   var special_privileges    = $("#special_privileges").val();
//   var family_history        = $("#family_history").val();
//   var patient_record_id     = $("#patient_record_mh").val();
//   // }
//   var data = {
//     patient_record_id,
//     chief_complaint,
//     previous_hospital,
//     previous_doctor,
//     previous_diagnosis,
//     previous_treatment,
//     previous_surgeries,
//     previous_medication,
//     health_condition,
//     special_privileges,
//     family_history
//   };
//   console.log(data);
//   // e.preventDefault();
//   $.ajax({
//     url: "http://127.0.0.1:8000/record/medicalHistory",
//     type: "POST",
//     mode: "cors",
//     headers: { "Content-Type": "Application/json" },
//     dataType: "json",
//     contentType: "application/json; charset=utf-8",
//     data: JSON.stringify(data),
//     success: (result) => {
//       console.log(result);
//       toastr.success("Medical History Updated");
//       $("#medical_history_modal").modal("hide");
//       document.getElementById("addHistoryForm").reset();

//       $("#history_btn")
//         .html(`<button type="button" class="btn btn-info float-right" data-toggle="modal" 
//                                                       data-target="#edit_medical_history_modal">
//                                                           <span>Edit</span>
//                                                           <i class="fa fa-edit ml-1"></i>
//                                                   </button>`);

//       $("#p_history").replaceWith(`<div class = "row" id="p_history">
//                                       <div class = "col-md-6 table-responsive">
//                                           <table class="table table-borderless">
//                                               <tr>
//                                                   <th class = "text-right">Chief Complaint:</th>
//                                                   <td>${result.chief_complaint}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Previous Hospital:</th>
//                                                   <td>${result.previous_hospital}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Previous Doctor:</th>
//                                                   <td>${result.previous_doctor}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Previous Diagnosis:</th>
//                                                   <td>${result.previous_diagnosis}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Previous Treatment:</th>
//                                                   <td>${result.previous_treatment}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Previous Surgeries:</th>
//                                                   <td>${result.previous_surgeries}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Previous Medications:</th>
//                                                   <td>${result.previous_medication}</td>
//                                               </tr>
//                                           </table>
//                                       </div>
//                                       <div class = "col-md-6 table-responsive">
//                                           <table class="table table-borderless">
//                                               <tr>
//                                                   <th class = "text-right">Health Conditions:</th>
//                                                   <td>${result.health_condition}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Special Privileges:</th>
//                                                   <td>${result.special_privileges}</td>
//                                               </tr>
//                                               <tr>
//                                                   <th class = "text-right">Family History:</th>
//                                                   <td>${result.family_history}</td>
//                                               </tr>
//                                           </table>
//                                       </div>
//                                   </div>`);
//     },
//     error: () => console.error("GET ajax failed"),
//   });
//   // });
// };
