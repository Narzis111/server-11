const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8ufgdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // const itemCollection = client.db('craftDB').collection('item');
        // const categoryCollection = client.db('craftDB').collection('category');

        // =====================================================

        // ok oldone

        // // to find all (read)
        // app.get('/item', async (req, res) => {
        //     const cursor = itemCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })
        // // update korbo specific 1ta id ke tai find single params lagbe new lagbe
        // // to find single (read)
        // app.get('/item/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await categoryCollection.findOne(query) || await itemCollection.findOne(query);
        //     res.send(result);
        // })


        // // to find category (read)
        // app.get('/category', async (req, res) => {
        //     const cursor = categoryCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })
        // // to find single  (read)
        // app.get('/category/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await categoryCollection.findOne(query);
        //     res.send(result);
        // })
        // app.get("/category/:catID", async (req, res) => {
        //     console.log(req.params.catID);
        //     const result = await categoryCollection.find({ catID: req.params.catID }).toArray();
        //     res.send(result)
        // })
        // // deatil
        // app.get('/detailcat/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const clickedCategory = await categoryCollection.findOne({ _id: new ObjectId(id) });
        //     const subcategory = clickedCategory.subcategory;
        //     const categoryData = await categoryCollection.find({ subcategory }).toArray();
        //     const itemsData = await itemCollection.find({ subcategory }).toArray();

        //     const combinedData = {
        //         category: categoryData,
        //         item: itemsData
        //     };

        //     res.json(combinedData);
        // })

        // // to find single user (read)
        // app.get("/myItems/:email", async (req, res) => {
        //     console.log(req.params.email);
        //     const result = await itemCollection.find({ email: req.params.email }).toArray();
        //     res.send(result)
        // })

        // //   create data
        // app.post('/item', async (req, res) => {
        //     const newItem = req.body;
        //     console.log(newItem);
        //     const result = await itemCollection.insertOne(newItem);
        //     res.send(result);
        // })
        // // update specific id 

        // app.put('/item/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updateItem = req.body;

        //     const item = {

        //         $set: {
        //             image: updateItem.image,
        //             item_name: updateItem.item_name,
        //             subcategory: updateItem.subcategory,
        //             shortDescription: updateItem.shortDescription,
        //             price: updateItem.price,
        //             rating: updateItem.rating,
        //             customization: updateItem.customization,
        //             processing_time: updateItem.processing_time,
        //             stockStatus: updateItem.stockStatus,

        //         }
        //     }

        //     const result = await itemCollection.updateOne(filter, item, options);
        //     res.send(result);
        // })

        // // delete korbo specific 1ta id ke tai find single params lagbe new lagbe

        // app.delete('/item/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await itemCollection.deleteOne(query);
        //     res.send(result);
        // })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Assignment-11 server is running')
})

app.listen(port, () => {
    console.log(`Assignment-11 Server is running on port: ${port}`)
})