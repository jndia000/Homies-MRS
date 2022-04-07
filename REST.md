# AJAX

First of all, I recommend na meron kayong constants na file tapos ilagay niyo ito para hindi paulit-ulit na nadedeclare.

```
// In constants file
const AJAX_HEADERS = {
    Accept: 'application/json',
    Authorization: `Bearer ${ ACCESS_TOKEN }`
}

// When calling AJAX
$.ajax({
    ...
    headers: AJAX_HEADERS,
    ...
});

```

Pero kung wala ganito nalang gawin niyo
```
$.ajax({
    ...
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ ACCESS_TOKEN }`
    },
    ...
});
```

Of course, kung hindi naman kailangan maglogin ni user, pwede na wala na yang headers na option.


## AJAX Methods

### GET 

```
$.ajax({
    url: `${ YOUR_API_URL }`,
    type: 'GET',
    headers: AJAX_HEADERS,
    success: result => {
        console.log(result)

        // Do something here
    },
    error: () => console.error('GET ajax failed')
});
```


### POST

Medyo mas marami siyang required na options kase maarte talaga si Python. Yung data is need niyo i-stringfy `JSON.stringify(data)`. Required din yung `contentType` which is `application/json; charset=utf-8`.

```
const formData = new FormData($('#register')[0]);

const data = {
    firstName: formData.get('firstName'),
    ...
}

$.ajax({
    url: `${ YOUR_API_URL }`,
    type: 'POST',
    headers: AJAX_HEADERS,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    success: result => {
        console.log(result)

        // Do something here
    },
    error: () => console.error('POST ajax failed')
});
```

Kung may form validation kayo at ginamit niyo yung jQuery Form Validation. I suggest gamitin niyo parin yung ginawa naten na ganitong method

```
// Validate Form
$('yourFormSelector').validate({
    rules: {},
    message: {},
    ...
    submitHandler: () => yourCallableAJAXFunction()
});

// Your Callable AJAX Function
const yourCallableAJAXFunction = () => {

    // Your AJAX code here

}
```

TIP: Kung meron kayong external functions na icacall sa submit handler pero ayaw niyo na automatic nag susubmit yung form. Maglagay lang kayo ng false return

```
$().validate({
    ...
    submitHandler: () => {
        ...
        // Do something here
        ...

        return false;
    }
});
```

### PUT

Same with POST method. Need din ng ibang options

```
$.ajax({
    url: `${ YOUR_API_URL }`,
    type: 'PUT',
    headers: AJAX_HEADERS,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    success: result => {
        console.log(result)

        // Do something here
    },
    error: () => console.error('PUT ajax failed')
});
```

Kung hindi ito nag work. Try niyo iconvert sa dictionary yung request niyo `request.dict()`

```
@router.post('/update/{id}')
def update(
    request: Request, 
    db: Session = Depends(get_db)
):
    ...
    record = db.query(yourModel).filter(yourModel.id == id)
    if not record.first():
        # return error here
    else:
        record.update(request.dict())
        db.commit()
        return {"message": "Updated successfully"}
```

### DELETE

```
$.ajax({
    url: `${ YOUR_API_URL }`,
    type: 'DELETE',
    headers: AJAX_HEADERS,
    success: result => {
        console.log(result)

        // Do something here
    },
    error: () => console.error('DELETE ajax failed')
});
```

## For Login

Marami kasing way kung paano mag work yung functionality niya. Pero pwede niyo sundin yung nasa FastAPI Tutorial sa YT. I suggest na meron dapat kayong API for that. POST ang method at magrereturn dapat siya ng access token. Atleast kahit ito lang ang ireturn sa login

```
{
    access_token: YOUR_UNREADABLE_TOKEN,
    token_type: 'bearer'
}
```

Sa frontend or sa js. Ilagay niyo nalang din sa `localStorage` yung access token like sa ginawa naten sa ADET

```
// Login
$.ajax({
    ...
    type: 'POST',
    success: result => {
        
        ...

        localStorage.setItem('access_token', result.access_token);

        ...
    }
});
```

And then pwede niyo na siya magamit sa AJAX headers

```
const AJAX_HEADERS = {
    Accept: 'application/json',
    Authorization: `Bearer ${ localStorage.getItem('access_token') }`
}
```