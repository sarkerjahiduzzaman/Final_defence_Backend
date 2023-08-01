const express=require('express');
const cors=require('cors');
const jwt=require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port=process.env.PORT|| 5000;

const Token="8544bd632fc1ed7f334d2f2898724e0b4e998ad1703a4e9f169f5988118e256bdee71a6bbd76b9699408541b2a93ccb7f247dec7db63f8b628c25482be077b99"

//This is payment stripe key
const stripe = require("stripe")('sk_test_51NVGVVKDHIU8nOaxIj5Kryzc2JPmRZDtB1fLUfZix8z2GSyTIAQaCRb0g6qoe8PwylUX6JtkiFGDBO2Xw1A1GTTf00ym7K1Ydz');

const app=express();
//mongodb://localhost:27017

//middlewire
app.use(cors());
app.use(express.json());


// Mongo db link 
//const uri=`mongodb://localhost:27017`
const uri = `mongodb+srv://dbuser101:C68ciBl6tvZR24nE@cluster0.a3ye7y2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{ 

        // This is all rent collection
        const rentCollection=client.db('rentsite').collection('rentCollection');
        //All User Store in database
        const usersCollection=client.db('rentsite').collection('userCollection');
        //All shifting data is store in database
        const shiftingDataCollection=client.db('rentsite').collection('shiftingDataCollection');
        //All Car Rent data is store in database
        const carRentDataCollection=client.db('rentsite').collection('CarRentDataCollection');
        //Add rent post collection 
        const addPostDataCollection=client.db('rentsite').collection('addRentPostDataCollection')
        // Add technician order in database
        const addTechnicianOrder=client.db('rentsite').collection('addTechnicianOrder');
        //add user payment 
        const paymentsCollection=client.db('rentsite').collection('payments');




    


        //geting data from server
        app.get('/rentCollection', async(req, res) => {
            const query = {};
            const allRent = await rentCollection.find(query).toArray();
            res.send(allRent);
        });

       //for profile get data

       app.get('/profile/:email', async (req, res) => {
        const email=req.params.email;
        console.log(email)
            const query = {email :email};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });
        
        // getting renter data
        app.get('/allrenters', async (req, res) => {
            const query = {"role": "renter"};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });


         // getting allselers data
         app.get('/allowners', async (req, res) => {
            const query = {"role": "howner"};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        // getting all technician data
        app.get('/alltechnician',async(req,res)=>{
            const query ={"role":"technician"};
            const users =await usersCollection.find(query).toArray();
            res.send(users);
        });
        //getting all carowner data
        app.get('/allcarowner',async(req,res)=>{
            const query ={"role":"rentcar"};
            const users =await usersCollection.find(query).toArray();
            res.send(users);
        });
        //getting all Shift owner data
        app.get('/allcshiftowner',async(req,res)=>{
            const query ={"role":"shifting"};
            const users =await usersCollection.find(query).toArray();
            res.send(users);
        });


        //access Token is create
        app.get('/jwt',async(req,res)=>{

            const email=req.query.email;
            const query={email: email}
            const user=await usersCollection.findOne(query);
            console.log(user)
            
            if(user){
             const token=jwt.sign({email},Token,{expiresIn:'1h'})
                console.log(token)
                return res.send({accesToken: token});
            }
            console.log(user);
            res.status(403).send({accessToken:'token'})
        });


                // get admin role
                app.get('/users/admin/:email', async (req, res) => {
                    const email = req.params.email;
                    const query = { email }
                    const user = await usersCollection.findOne(query);

                    res.send({ isAdmin: user?.role === 'admin' });
                });

                //get renter role
                app.get('/users/renter/:email', async (req, res) => {
                    const email = req.params.email;
                    const query = { email }
                    const user = await usersCollection.findOne(query);

                    res.send({ isRenter: user?.role === 'renter' });
                });
                //get Technician  role
                app.get('/users/technician/:email', async (req, res) => {
                    const email = req.params.email;
                    const query = { email }
                    const user = await usersCollection.findOne(query);

                    res.send({ isTechnician: user?.role === 'technician' });
                });
                //get house owner role
               
                app.get('/users/owner/:email', async (req, res) => {
                    const email = req.params.email;
                    const query = { email }
                    const user = await usersCollection.findOne(query);
                   console.log(user)
                    res.send({ isHouseOwner: user?.role === 'howner' });
                });
                //get rent car owner role
                app.get('/users/carowner/:email', async (req, res) => {
                    const email = req.params.email;
                    const query = { email }
                    const user = await usersCollection.findOne(query);
                   console.log(user)
                    res.send({ isCarOwner: user?.role === 'rentcar' });
                });
                //get shifting truck owner role
                app.get('/users/shiftowner/:email', async (req, res) => {
                    const email = req.params.email;
                    const query = { email }
                    const user = await usersCollection.findOne(query);
                   console.log(user)
                    res.send({ isShiftOwner: user?.role === 'shifting' });
                });

        //User Collection collect from database
        app.get('/users',async (req,res)=>{
            const query={}
            const allUser=await usersCollection.find(query).toArray();
            console.log(allUser)
            res.send(allUser);
        });


        //user collection store in database
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
           const query = {email: user.email};
           const data = await usersCollection.find(query).toArray();
            if(data.length === 0){
                const result = await usersCollection.insertOne(user);
                res.send(result);
                console.log(user);
            }
            else {
                res.send("User Alredy added");
                console.log("User Alredy added");
            } 

        });

       // delete a user from added product
       app.delete('/users/:id', async (req, res) => {
        const id = req = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(filter);
        console.log('This is delete',result);
        res.send(result);
    })


   


    //Add Shifting data in data base
       
       app.post('/addedShiftingData', async (req, res) => {
        const shiftingData = req.body;
        const result = await shiftingDataCollection.insertOne(shiftingData);
        res.send(result);
      })

      //get/collect shifting order from database
       app.get('/addedShiftingData', async(req, res) => {
        const query = {};
        const allShiftingData = await shiftingDataCollection.find(query).toArray();
        res.send(allShiftingData);
    });



     //delete shifting order from shifting data collection

     app.delete('/addedShiftingData/:id', async (req, res) => {
        const id = req = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await shiftingDataCollection.deleteOne(filter);
        console.log('This is delete',result);
        res.send(result);
    })



       
       //Add Car Rent data in database
       
       app.post('/addedCarRentData', async (req, res) => {
        const shiftingData = req.body;
        const result = await carRentDataCollection.insertOne(shiftingData);
        res.send(result);
      })

      app.get('/addedCarRentData',async(req,res)=>{
        const query={};
        const carRentData=await carRentDataCollection.find(query).toArray();
        console.log(carRentData)
        res.send(carRentData);
      })
      //delete shifting order from shifting data collection

     app.delete('/addedCarRentData/:id', async (req, res) => {
        const id = req = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await shiftingDataCollection.deleteOne(filter);
        console.log('This is delete',result);
        res.send(result);
    })





    // //add post data in a new data collection
    
    //  app.post('/addedrentpost', async (req, res) => {
    //     const rentpost= req.body;
    //     const result = await addPostDataCollection.insertOne(rentpost);
    //     res.send(result);
    //   })

      // data is added also rentcollection data This is not worke in this time 
      app.post('/addedrentpost', async (req, res) => {
        const rentpost= req.body;
        const result = await rentCollection.insertOne(rentpost);
        res.send(result);
      })


      //here added technician order
      app.post('/addtechnicianorder',async (req,res)=>{
        const techpost=req.body;
        const result=await addTechnicianOrder.insertOne(techpost);
        res.send(result);
      })
      //This is get from database
      app.get('/addtechnicianorder', async(req,res)=>{
        const query={};
        const techorder=await addTechnicianOrder.find(query).toArray();
        res.send(techorder);
      })

      //update ordertechnician data
      app.put('/addtechnicianorder/:id/:email', async (req,res)=>{
        const id=req.params.id;
        const email=req.params.email;
        const filter={ _id:new ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
            $set:{
                approvee:`${email}`
            }
        }
        const result=await addTechnicianOrder.updateOne(filter,updateDoc,options);
        res.send(result)
      })


      app.put('/addtechnicianorde/:id/:email', async (req,res)=>{
        const id=req.params.id;
        const email=req.params.email;
        const filter={ _id:new ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
            $set:{
                done:"done"
            }
        }
        const result=await addTechnicianOrder.updateOne(filter,updateDoc,options);
        res.send(result)
      })

       //update shifting order data
       app.put('/addedShiftingData/:id/:email', async (req,res)=>{
        const id=req.params.id;
        const email=req.params.email;
        const filter={ _id:new ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
            $set:{
                approvee:`${email}`
            }
        }
        const result=await shiftingDataCollection.updateOne(filter,updateDoc,options);
        res.send(result);
      })

      //update order rent_acar data
      app.put('/addcarrentorder/:id/:email', async (req,res)=>{
        const id=req.params.id;
        const email=req.params.email;
        const filter={ _id:new ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
            $set:{
                approvee:`${email}`
            }
        }
        const result=await carRentDataCollection.updateOne(filter,updateDoc,options);
        res.send(result)
      })


       //get trent a car order which email is login in this time as a technician

       app.get('/addrentcarorder/approve/:email',async(req,res)=>{
        const email=req.params.email;
       
      const query = {"approvee": `${email}`};
      console.log(query)
            const users = await carRentDataCollection.find(query).toArray();
            res.send(users);
        

      })
      //get technicnian order which email is login in this time as a technician

      app.get('/addtechnicianorder/approve/:email',async(req,res)=>{
        const email=req.params.email;
       
      const query = {"approvee": `${email}`};
      console.log(query)
            const users = await addTechnicianOrder.find(query).toArray();
            res.send(users);
        

      })

      //get my shifting order which email is login in this time as a shifting truck driver
      app.get('/addshiftingorder/approve/:email',async(req,res)=>{
        const email=req.params.email;
       
      const query = {"approvee": `${email}`};
      console.log(query)
            const users = await shiftingDataCollection.find(query).toArray();
            res.send(users);
        

      })
      //This is for query email payment or not
      app.get('/payment/:email',async (req,res)=>{
       const email=req.params.email;
       const query={email};
       const result=await usersCollection.findOne(query)
      
       res.send(result)
       console.log(result)
      })


    //This is create for payment post
    app.post('/create-payment-intent',async(req,res)=>{
        const amount=20*100;

        const paymentIntent= await stripe.paymentIntents.create({
            currency:'usd',
            amount:amount,
            "payment_method_types":[
                "card"
            ]
              
        });
        
        res.send({
            clientSecret: paymentIntent.client_secret,
          });
    });

    app.post('/payments',async (req,res)=>{
        const payment=req.body;
        console.log(payment)
        const result=await paymentsCollection.insertOne(payment);
        const id=payment.bookingId
     
        const filter={_id: new ObjectId(id)}
        console.log(filter)
        const updateDoc={
            $set:{
                paid:true ,
                transactionId:payment.transactionId
            } 
        }
       const updatedResult=await usersCollection.updateOne(filter,updateDoc)
        res.send(result)
    });


    //This is email paid or not
    app.get('/users/paid/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);

        res.send(user);
    });

    }
    finally{

    }
}
run().catch(console.log)

app.get('/',async(req,res)=>{
    res.send('Bashskhuji.com server is running')
})
app.listen(port,()=>console.log(`Bashakhuji.com port running on ${port}`))