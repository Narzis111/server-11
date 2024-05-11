const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const assignmentCollection = client.db('assignmentDB').collection('assign');
        const submitCollection = client.db('assignmentDB').collection('submit');
      

      // to find all (read)
        app.get('/assignment', async (req, res) => {
            const cursor = assignmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // // update korbo specific 1ta id ke tai find single params lagbe new lagbe
        // // to find single (read)
        app.get('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.findOne(query);
            res.send(result);
        })

        //   create data
        app.post('/assignment', async (req, res) => {
            const newAssign = req.body;
            console.log(newAssign);
            const result = await assignmentCollection.insertOne(newAssign);
            res.send(result);
        })
        // update specific id 

        app.put('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const update = req.body;

            const assign = {

                $set: {
                    thumbnail_url: update.thumbnail_url,
                    title: update.title,
                    marks: update.marks,
                    description: update.description,
                    difficulty_level: update.difficulty_level,
                    due_date: update.due_date
                   
                }
            }

            const result = await assignmentCollection.updateOne(filter, assign, options);
            res.send(result);
        })

        // delete korbo specific 1ta id ke tai find single params lagbe new lagbe

        app.delete('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query);
            res.send(result);
        })

        // submit assignment

        
        // app.delete('/submit/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await submitCollection.deleteOne(query);
        //     res.send(result);
        // })
        // app.get('/submit', async (req, res) => {
        //     const cursor = submitCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })
           // to find single user (read)
        // app.get("/mySubmit/:email", async (req, res) => {
        //     console.log(req.params.email);
        //     const result = await submitCollection.find({ email: req.params.email }).toArray();
        //     res.send(result)
        // })

        app.get('/submit', async (req, res) => {
            console.log(req.query.email);
        
            let query = {}
            if(req.query?.email){
                query = {email:req.query.email}
            }
            const result = await submitCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/submit', async (req, res) => {
            const submitted = req.body;
            console.log(submitted);
            const result = await submitCollection.insertOne(submitted);
            res.send(result);
        });

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