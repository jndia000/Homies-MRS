
// // Populate Region Select Input
// $.ajax({
//     url: `https://psgc-api.wareneutron.com/api/region`,
//     type: 'GET',
//     success: result => {
//         if(result) {
//             const data = result.data;
//             const region = data[0].region;
//             let options = '';
//             region.forEach(r => options += `<option value="${ r.code }">${ r.name }</option>`);
//             $('#regionsDropdown').html(options);
//             $('#regionsDropdown').selectpicker('refresh');
//         }
//     }
// });

// // On change (or select) region select input
// $('#regionsDropdown').change(function(e){
//     code = $('#regionsDropdown').val();

//     $('#provincesDropdown').html(`
//         <option class="text-center small" disabled>
//             <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//             <span>Loading... Please wait</span>
//         </option>
//     `);
//     $('#provincesDropdown').selectpicker('refresh');


//     $.ajax({
//         url: `https://psgc-api.wareneutron.com/api/region/${ code }/province`,
//         type: 'GET',
//         success: result => {
//             if(result) {
//                 const provinces = result;

//                 var options = '';
//                 provinces.forEach(p => options += `
//                     <option 
//                         value="${ p.code }"
//                         data-content="<div>${ p.name }</div>"
//                         title="${ p.name }"
//                     >${ p.name }</option>`
//                 );
                
//                 // Reset provinces dropdown
//                 $('#provincesDropdown').html(options);
//                 $('#provincesDropdown').selectpicker('refresh');
                
//                 // Reset cities dropdown
//                 $('#citiesDropdown').html(`
//                     <option class="text-center small" disabled>Please select a province first</option>
//                 `);
//                 $('#citiesDropdown').selectpicker('refresh');

//                 // Reset barangay, street, and specific location inputs
//                 $('#barangay').val('');
//                 $('#street').val('');
//                 $('#specificLocation').val('');
//             }
//         }
//     });
    
//     $.ajax({
//         url: `https://psgc-api.wareneutron.com/api/region/${ code }`,
//         type: 'GET',
//         success: result => {
//             if(result) {
//                 $('#regionName').val(result.name);
//             }
//         }
//     })
// });
