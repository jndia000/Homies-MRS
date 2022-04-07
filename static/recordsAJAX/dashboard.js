// run on load

$(() => {
  $.ajax({
    url: 'http://127.0.0.1:8000/dashboard/u/GetConsultation',
    type: 'Get',
    mode: 'cors',
    headers: {
      'Content-Type': 'Application/json'
    },
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: data => {
      console.log(data)
      // 1
      $("#consulation_patient_name1").html(data[0].progressnoteFK.patientrecordFK.first_name+' '+data[0].progressnoteFK.patientrecordFK.last_name);
      $("#consulation_date1").html(moment(data[0].next_appointment).fromNow());
      $("#consulation_physician1").html('Physician: Dr. '+data[0].docentryFK.first_name+' '+data[0].docentryFK.last_name);
      // 2
      $("#consulation_patient_name2").html(data[1].progressnoteFK.patientrecordFK.first_name+' '+data[1].progressnoteFK.patientrecordFK.last_name);
      $("#consulation_date2").html(moment(data[1].next_appointment).fromNow());
      $("#consulation_physician2").html('Physician: Dr. '+data[1].docentryFK.first_name+' '+data[1].docentryFK.last_name);
      // 3
      $("#consulation_patient_name3").html(data[2].progressnoteFK.patientrecordFK.first_name+' '+data[2].progressnoteFK.patientrecordFK.last_name);
      $("#consulation_date3").html(moment(data[2].next_appointment).fromNow());
      $("#consulation_physician3").html('Physician: Dr. '+data[2].docentryFK.first_name+' '+data[2].docentryFK.last_name);
      // 4
      $("#consulation_patient_name4").html(data[3].progressnoteFK.patientrecordFK.first_name+' '+data[3].progressnoteFK.patientrecordFK.last_name);
      $("#consulation_date4").html(moment(data[3].next_appointment).fromNow());
      $("#consulation_physician4").html('Physician: Dr. '+data[3].docentryFK.first_name+' '+data[3].docentryFK.last_name);


    },
    error: () => console.error('GET ajax failed')
  });
});
$(() => {

  $.ajax({
    url: 'http://127.0.0.1:8000/dashboard/GetTotal',
    type: 'Get',
    mode: 'cors',
    headers: {
      'Content-Type': 'Application/json'
    },
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: result => {
      console.log(result)
      $("#total_patient").html(result.total_patient);
      $("#total_request").html(result.total_request);
      $("#total_discharge").html(result.total_discharge);
      $("#total_call_logs").html(result.total_call_logs);
      $("#total_request").html(result.total_request);
      $("#total_pending").html(result.total_pending);
      $("#total_approved").html(result.total_approved);
      $("#total_rejected").html(result.total_rejected);
      $("#total_diagnosis").html(result.total_diagnosis);
      // $("#total_allergy").val(result.total_allergy);
      $("#total_laboratory").html(result.total_laboratory);
      $("#total_surgery").html(result.total_surgery);
      $("#total_note").html(result.total_note);
      $("#total_request_approved").html(result.total_approved);
      $("#total_request_pending").html(result.total_pending);
      $("#total_request_rejected").html(result.total_rejected);
      $("#total_request_cancelled").html(result.total_cancelled);



    },
    error: () => console.error('GET ajax failed')
  });



  // end run on load

  // bar chart
  var Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
  Jan = Feb = Mar = Apr = May = Jun = Jul = Aug = Sep = Oct = Nov = Dec = 0
  $.ajax({
    url: 'http://127.0.0.1:8000/dashboard/GetTotalRequest',
    type: "GET",
    dataType: "JSON",

    success: function (data) {
      count = data.total_request.length
      for (let i = 0; i < count; i++) {
        if (new Date(data.total_request[i].created_at).getMonth() == 0) {
          Jan += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 1) {
          Feb += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 2) {
          Mar += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 3) {
          Apr += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 4) {
          May += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 5) {
          Jun += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 6) {
          July += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 7) {
          Aug += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 8) {
          Sep += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 9) {
          Oct += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 10) {
          Nov += 1
        }
        if (new Date(data.total_request[i].created_at).getMonth() == 11) {
          Dec += 1
        }

      }

      const ctx = document.getElementById('medical_request_chart').getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
          ],
          datasets: [{
            label: 'Total Medical Request',
            data: [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec],
            backgroundColor: [
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
              'rgb(22,163,74)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

    }
  })

  //- DONUT CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  function medical_request_status(){
  $.ajax({
    url: 'http://127.0.0.1:8000/dashboard/GetTotalRequestStatus',
    type: 'Get',
    dataType: 'json',
    success: result => {
      console.log(result)
      var approved = result.total_approved
      var pending = result.total_pending
      var rejected = result.total_rejected
      var cancelled = result.total_cancelled
      // for (var i = 0; i < request.length; i++){
      //   if (request[i].active_status == "Approved"){
      //     approved++;
      //   }
      //   if (request[i].active_status == "Pending"){
      //     pending++;
      //   }
      //   if (request[i].active_status == "Cancelled" || request[i].active_status == "Rejected"){
      //     cancelled++;
      //   }
      // }
      var donutChartCanvas = $('#medical_request_status_chart').get(0).getContext('2d')
      var donutData = {
        labels: [
          'Approved',
          'Pending',
          'Rejected',
          'Cancelled',
    
        ],
        datasets: [{
          data: [approved, pending, rejected, cancelled],
          backgroundColor: ['#00a65a','#f39c12','#f56954', '#G76955'],
        }]
      }
      var donutOptions = {
        maintainAspectRatio: false,
        responsive: true,
      }
      //Create pie or douhnut chart
      // You can switch between pie and douhnut using the method below.
      new Chart(donutChartCanvas, {
        type: 'doughnut',
        data: donutData,
        options: donutOptions
      })
    },
    
    error: () => console.error('GET ajax failed')
  });
 
}

medical_request_status();


  //- PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  function immunization_type(){
    $.ajax({
      url: 'http://127.0.0.1:8000/dashboard/GetTotalImmunization',
      type: 'Get',
      dataType: 'json',
      success: result => {
        console.log(result)
        var live = result.total_live
        var inactivated = result.total_inactivated
        var toxoid = result.total_toxoid
        var subunit = result.total_subunit
        // for (var i = 0; i < request.length; i++){
        //   if (request[i].active_status == "Approved"){
        //     approved++;
        //   }
        //   if (request[i].active_status == "Pending"){
        //     pending++;
        //   }
        //   if (request[i].active_status == "Cancelled" || request[i].active_status == "Rejected"){
        //     cancelled++;
        //   }
        // }
        var donutChartCanvas = $('#immunization_type').get(0).getContext('2d')
        var donutData = {
          labels: [
            'Live, attenuated',
            'Inactivated/Killed',
            'Toxoid (inactivated toxin)',
            'Subunit/conjugate',
      
          ],
          datasets: [{
            data: [live, inactivated, toxoid, subunit],
            backgroundColor: ['#00a65a','#f39c12','#f56954', '#G76955'],
          }]
        }
        var donutOptions = {
          maintainAspectRatio: false,
          responsive: true,
        }
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        new Chart(donutChartCanvas, {
          type: 'pie',
          data: donutData,
          options: donutOptions
        })
      },
      
      error: () => console.error('GET ajax failed')
    });
   
  }
  
  immunization_type();

});
