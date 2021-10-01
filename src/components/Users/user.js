class UserService {
  constructor() {  

  }

  // *** Auth API ***

//   doCreateUserWithEmailAndPassword = (email, password) =>
//     this.auth.createUserWithEmailAndPassword(email, password);

//   doSignInWithEmailAndPassword = (email, password) =>
//     this.auth.signInWithEmailAndPassword(email, password);

//   doSignOut = () => this.auth.signOut();

//   doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

//   doPasswordUpdate = password =>
//     this.auth.currentUser.updatePassword(password);

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();

            // default empty roles
            if(dbUser !== null ){
              if (!dbUser.roles) {
                dbUser.roles = {};
              }
              // merge auth and db user
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                ...dbUser,
              };

              next(authUser);
              }
              else {
                fallback();
              }                  
          });
      } else {
        fallback();
    }
 });
    
    
//   // *** User API ***

//   user = uid => this.db.ref(`users/${uid}`);

//   users = () => this.db.ref('users');
}

export default Firebase;