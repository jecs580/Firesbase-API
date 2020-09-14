const { Router } = require('express');
const router= Router();
const admin= require('firebase-admin');
admin.initializeApp({
    credential:admin.credential.cert('./permissions.json'),
    databaseURL:'https://fir-api-aa208.firebaseio.com',
})
const db = admin.firestore();

 router.post('/api/products', async (req,res)=>{
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

router.get('/api/products/:id', async(req,res)=>{
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

router.get('/api/products', async (req,res)=>{
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

router.delete('/api/products/:id',async (req,res)=>{
    try {
        const doc = db.collection('products').doc(req.params.id);
        await doc.delete();
        return res.status(200).json()
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

router.put('/api/products/:id', async (req,res)=>{
    try {
        const doc = db.collection('products').doc(req.params.id);
        await doc.update({name:req.body.name});
        const item = await doc.get();
        const response = item.data();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})
 module.exports= router;