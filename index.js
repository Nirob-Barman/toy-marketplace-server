const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xceqs5c.mongodb.net/?retryWrites=true&w=majority`;

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

        const toysCollection = await client.db('toysDb').collection('toys');

        app.get('/checking', (req, res) => {
            res.send('All is Ok');
        })

        // inserting data
        app.post("/addToys", async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toysCollection.insertOne(newToy);
            res.send(result);
        });

        // get all the toys
        app.get('/allToys', async (req, res) => {
            const toys = toysCollection.find();
            const result = await toys.toArray();
            res.send(result);
        })


        // updating the data
        // app.put('/toys/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedToysData = req.body;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };

        //     const updatedDoc = {
        //         $set: {
        //             price: updatedToysData.price,
        //             quantity: updatedToysData.quantity,
        //             description: updatedToysData.description
        //         }
        //     }
        //     const result = await toysCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result)
        // });

        // updating the data
        app.patch('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    ...updatedData
                }
            }

            const result = await toysCollection.updateOne(filter, updatedDoc)
            res.send(result)

        });



        // deleting the single data
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(filter)
            res.send(result)
        });



        // getting the single data
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })


        app.get('/toys', async (req, res) => {
            // console.log(req);
            // console.log('Hello');
            // console.log(req.query);
            console.log('Query Email = ', req.query.email);
            try {
                let query = {};
                console.log('query = ', query);
                if (req.query?.email) {
                    query = { email: req.query.email }
                    console.log('Inside query = ', 'Email = ', req.query.email, ' Query =', query);
                }
                const result = await toysCollection.find(query).toArray();
                console.log('Email result = ', result);
                res.send(result);
            }
            catch (error) {
                console.error('Error fetching toys:', error);
                res.status(500).send('Internal Server Error');
            }
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Toys Server is running')
})

app.listen(port, () => {
    console.log(`Toys Server is running on port ${port}`)
})
