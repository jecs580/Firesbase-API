const functions = require('firebase-functions');
const express = require('express');
const admin= require('firebase-admin');

const app = express();
admin.initializeApp({
    credential:admin.credential.cert('./permissions.json'),
    databaseURL:'https://fir-api-aa208.firebaseio.com',
})
const db = admin.firestore();

app.get('/hello-word',(req,res)=>{
    return res.status(200).json({message:'Hola Mundo'})
})

app.post('/api/products', async (req,res)=>{
    try {
        // opcional se puede colocar como id: '/'+req.body.id+'/'
        await db.collection('products').doc(req.body.id).create({
            name:req.body.name
        });
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get('/api/products/:id', async(req,res)=>{
try {
    const doc = db.collection('products').doc(req.params.id)
    const item = await doc.get();
    const product = item.data();
    return res.status(200).json(product);
} catch (error) {
    console.log(error);
    return res.status(500).send(error);
}
});

app.get('/api/products', async (req,res)=>{
    try {
        const query = db.collection('products');
        const querySnapshot= await query.get();
        const docs= querySnapshot.docs;
        const response = docs.map(doc=>({
            id:doc.id,
            name: doc.data().name
        }))
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

exports.app = functions.https.onRequest(app);  // Especificamos que nuestro backend sera ejecutado desde Firebase





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
