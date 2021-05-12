function init() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: '918161823107-paedatbpv5t1tq8geqnfs02fgtipg2vd.apps.googleusercontent.com'
        });
    });
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        window.location.replace('/logout');
    });
}