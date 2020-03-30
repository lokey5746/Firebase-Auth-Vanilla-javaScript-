//===-add admin cloud function=====//
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable("addAdminRole");
    addAdminRole({
        email: adminEmail
    }).then(result => {
        console.log(result);
    })
})

//==========Auth state change tracking=========//
auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
        })
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs);
            setupUI(user);
        }, err => {
            console.log(err.message);
        });
    } else {
        setupGuides([]);
        setupUI();
    }
});


//=========craete new guide===========//
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(() => {
        //close the modal and reset the form
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset()
    }).catch(err => {
        console.log(err.message);
    })
})

//==========Signup============//
const signup = document.querySelector('#signup-form');
signup.addEventListener("submit", (e) => {
    e.preventDefault();
    //get user info(details)
    const email = signup['signup-email'].value;
    const password = signup['signup-password'].value;


    //signup the users
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection("users").doc(cred.user.uid).set({
            bio: signup['signup-bio'].value
        });
        //console.log(cred.user);

    }).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signup.reset();
        signup.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signup.querySelector('.error').innerHTML = err.message;
    })
})

//Logout user
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})

//Sign In user

const login = document.querySelector('#login-form');
login.addEventListener('submit', (e) => {
    e.preventDefault();
    //get the user info
    const email = login['login-email'].value;
    const password = login['login-password'].value;

    //sign using firebase build in method
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        //close the login modal and reset the form data.
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        login.reset();
        signup.querySelector('.error').innerHTML = '';
    }).catch(err => {
        login.querySelector('.error').innerHTML = err.message;
    })
})
