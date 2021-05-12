function init() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: '918161823107-paedatbpv5t1tq8geqnfs02fgtipg2vd.apps.googleusercontent.com'
        });
    });
}

function signIn(){
    // alert('Test')
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn({ scope: 'profile email', prompt: 'select_account' }).then((googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
         console.log(id_token)
        $.ajax({
            type: "POST",
            url: "/verifyUser",
            
            data: { token: id_token },
            success: (response) => {
                // alert(response);
                window.location.replace(response);
            },
            error: (xhr) => {
                alert(xhr.responseText);
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}