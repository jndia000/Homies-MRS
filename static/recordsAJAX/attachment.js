// 
// * ===========================================================================
// * * ATTACHMENT DATATABLE
// * ===========================================================================
var data = $('#patient_record_id_record').val();
let attachments_table = $('#attachments_table').DataTable({
    serverSide: true,
    processing:true,
    pageLength: 10,
    responsive: true,
    autoWidth: false,
    ajax: `/table/attachment/${ data }`,
    columns:[
        {data: 'type'},
        {data: null,
            class: 'text-center',
            render: data => {
                // return `<img src="/static/app/files/${data.attachment}" class="img-fluid mb-2" />`
                return `
                <div class="filtr-item col-sm-2" data-category="1" data-sort="white sample">
                      <a href="/static/app/files/${data.attachment}?text=1" data-toggle="lightbox" data-title="sample 1 - white">
                        <img src="/static/app/files/${data.attachment}?text=1" class="img-fluid mb-2" alt="white sample"/>
                      </a>
                    </div>
                `
            }},
    ],
    initComplete: function(){
        attachments_table.buttons().container().appendTo('#attachments_table_wrapper .col-md-6:eq(0)')
    }
  })



 // run on load
 $(() => {

    // ADD ATTACHMENT VALIDATION
      $('#addAttachmentForm').validate({
        debug: false,
        rules: {
            a_attachment_file: {
            required: true,
            extension: "png|jpe?g|gif"
          },
          attachment_type: {
            required: true
          }
        },
        messages: {      
            a_attachment_file: {
                required: "This field is required",
                extension: "the file must be an image"
              },
              attachment_type: {
                required: "This field is required"
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
        submitHandler: () => addAttachment()
        
        
      });
  // end run on load
  });
  
  // ADD ATTACHMENT
      addAttachment = () => {
  
      var patient_record_id       = $('#patient_record_id').val();
    


    var attachment = $('#attachment_file')[0].files[0];
    var fd = new FormData();
    fd.append('file', attachment);
  
    $.ajax({
      url: `http://127.0.0.1:8000/record/uploadAttachment/upload/${patient_record_id}`,
      type: 'POST',
      processData: false,
      contentType: false,
      data: fd,
        success: result => {
            console.log(result)
            attachment_id = result.attachment_id
            
            var type                    = $('#attachment_type').val();
            var data = { type };
            console.log(data);
            // AJAX FOR ATTACHMENT     
            $.ajax({
                url: `http://127.0.0.1:8000/record/recordAttachment/${ attachment_id }`,
                type: 'PUT',
                mode: 'cors',
                headers: {'Content-Type': 'Application/json'},
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                success: result => {
                    console.log(result)
                    toastr.success('Attachment Added')
                    $("#attachment_modal").modal('hide');
                    document.getElementById("addAttachmentForm").reset();
                    
                    // reload datatable
                    $('#attachments_table').DataTable().ajax.reload();

                    $('#attachment_img').append(`<div class="col-sm-3">
                                                    <a href="/static/app/files/${result.attachment}?text=" data-toggle="lightbox"  data-title="${result.type} "data-gallery="gallery">
                                                        <img src="/static/app/files/${result.attachment}?text=" class="img-fluid mb-2" alt="white sample"/>
                                                        <a href="/static/app/files/${result.attachment}" download="attachment">
                                                            <img src="/static/app/files/${result.attachment}" alt="attachment" width="104" height="142" hidden>
                                                            <i class="fas fa-download"></i>
                                                        </a>
                                                    </a><br><br>
                                                </div>`)
                    
                },
                error: () => console.error('GET ajax failed')
            });
          
      },
        error: () => console.error('GET ajax failed')
    });
  
  // });
  }
  