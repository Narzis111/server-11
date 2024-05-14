const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors({
    origin: ['http://localhost:5173',
        'https://assignment-11-project-c8814.web.app',
        'https://assignment-11-project-c8814.firebaseapp.com',],

    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8ufgdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// middleware
const logger = async (req, res, next) => {
    // console.log('called:', req.host, req.originalUrl)
    console.log('log: info', req.method, req.url);
    next();
}

const verifyToken = async (req, res, next) => {
    const token = req?.cookies?.token;
    console.log(' token er value', token);
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {

            return res.status(401).send({ message: 'unauthorized access' })
        }
        //if valid decode
        console.log('value in the token', decoded);
        req.user = decoded;
        next();
    })
}

const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const assignmentCollection = client.db('assignmentDB').collection('assign');
        const submitCollection = client.db('assignmentDB').collection('submit');
        const featuresCollection = client.db('assignmentDB').collection('features');
        // auth related api
        app.post('/jwt', logger, async (req, res) => {
            const user = req.body;
            console.log('logged in', user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '365d'
            })


            res.
                cookie('token', token, cookieOption).send({ success: true })
        })
        app.post('/logout', async (req, res) => {
            const user = req.body;
            console.log('logging out', user);
            res
                .clearCookie('token', { ...cookieOption, maxAge: 0 }).send({ success: true })
        })




        // to find all assignment (read)
        app.get('/assignment', async (req, res) => {
            const cursor = assignmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // // update korbo specific 1ta id ke tai find single params lagbe new lagbe
        // // to find single (read)
        app.get('/assignment/:id', logger, verifyToken, async (req, res) => {
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
        });


        // delete korbo specific 1ta id ke tai find single params lagbe new lagbe

        app.delete('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await assignmentCollection.deleteOne(query);
            res.send(result);
        })

        // submit assignment


        app.get("/submitPending", logger, verifyToken, async (req, res) => {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const result = await submitCollection.find({ status: "Pending" }).toArray();
            console.log(result);
            res.json(result);

        });


        app.get('/submit/:id', logger, verifyToken, async (req, res) => {
            console.log('valid user', req.user);

            // Ensure that only authenticated users can access this route
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const id = req.params.id;
            const query = { _id: new ObjectId(id) }; // Ensure the submission belongs to the authenticated user
            const result = await submitCollection.findOne(query);

            if (!result) {
                return res.status(404).json({ message: 'Submission not found' });
            }

            res.send(result);
        });
        app.get('/submit', logger, verifyToken, async (req, res) => {
            console.log('valid cookies', req.cookies);
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const cursor = submitCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get("/mySubmit/:email", logger, verifyToken, async (req, res) => {
            console.log(req.params.email);
            // console.log('valid cookies', req.cookies);
            console.log('valid user', req.user);

            if (req.params.email !== req.user.email) {
                return res.status(403).send({ message: 'forbidden' })
            }
            const result = await submitCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })


        app.post('/submit', async (req, res) => {
            const submitted = req.body;
            console.log(submitted);
            const result = await submitCollection.insertOne(submitted);
            res.send(result);
        });


        app.put("/submit/:id", async (req, res) => {
            const id = req.params.id;

            const { obtained_mark, feedback } = req.body;


            const result = await submitCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: "Completed",
                        obtained_mark: obtained_mark,
                        feedback: feedback
                    }
                })
            res.send(result);
        })

        app.get('/features', async (req, res) => {
            const cursor = featuresCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

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