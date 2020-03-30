const guidesList = document.querySelector('.guides');
const logOutLinks = document.querySelectorAll('.logged-out');
const logInLinks = document.querySelectorAll('.logged-in');
const account = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

//setup ui
const setupUI = (user) => {
    if (user) {
        if (user.admin) {
            adminItems.forEach(item => item.style.display = 'block');
        }
        //account info
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
<div>Logged in as ${user.email}</div>
<div>${doc.data().bio}</div>
<div class="pink-text">${user.admin ? 'Admin' : ''}</div>
`;
            account.innerHTML = html;
        })

        //toggle ui elements
        logInLinks.forEach(item => item.style.display = 'block');
        logOutLinks.forEach(item => item.style.display = 'none');
    } else {
        //hide account info
        adminItems.forEach(item => item.style.display = 'none');
        account.innerHTML = '';
        //toggle elements
        logInLinks.forEach(item => item.style.display = 'none');
        logOutLinks.forEach(item => item.style.display = 'block');
    }
}


//setup guides
const setupGuides = (data) => {

    if (data.length) {
        let html = '';
        data.forEach(doc => {
            const guide = doc.data();
            const li = `
<li>
    <div class="collapsible-header grey lighten-4">${guide.title}</div>
    <div class="collapsible-body white">${guide.content}</div>
</li>
`;
            html += li;
        });
        guidesList.innerHTML = html;
    } else {
        guidesList.innerHTML = '<h5 class="center">Login to view Guides<h5>'
    }
}



// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});
