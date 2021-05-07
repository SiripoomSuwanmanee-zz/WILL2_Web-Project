function init(){
    gapi.load('auth2', function(){
        gapi.auth2.init({
            client_id: '245681331591-2c0gt7snpgeqgfh68d56bcflnguin0k3.apps.googleusercontent.com'
        });
    });
}

function signIn(){
    // alert('Test')
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn({ scope: 'profile email', prompt: 'select_account'}).then(function(googleUser){
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());
    });
}