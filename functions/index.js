const functions = require('firebase-functions');
const admin = require('firebase-admin');

const app = require('express')();
admin.initializeApp();

const config = {
        apiKey: "AIzaSyB6Zrm7d_YB6Boqc7ejyM34akU55ZRigLg",
        authDomain: "social-media-app-65361.firebaseapp.com",
        databaseURL: "https://social-media-app-65361.firebaseio.com",
        projectId: "social-media-app-65361",
        storageBucket: "social-media-app-65361.appspot.com",
        messagingSenderId: "585549525715",
        appId: "1:585549525715:web:ace1c3bf5513b1dbd9da26",
        measurementId: "G-Z87LYZHWB0"
};

const firebase = require ('firebase');
firebase.initializeApp(config); 

app.get('/posts', (req, res) => {
    admin.firestore().collection('posts').orderBy('createdAt', 'desc').get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    postId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(posts);
        })
        .catch(err => console.error(err));
})

app.post('/post', (req, res) => {

    const newPosts = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };
    admin.firestore().collection('posts').add(newPosts).then((doc) => {
            res.json({
                message: `document ${doc.id} created sucessful`
            });
        })
        .catch(err => {
            res.status(500).json({
                error: 'something went wrong'
            })
            console.error(err);
        });
});

app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
    
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            return res.status(201).json({ message: `user ${data.user.uid} signed up sucessful`}); 
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
});

exports.api = functions.https.onRequest(app);