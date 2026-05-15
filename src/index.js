const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/../.env' });
console.log('KEY:', process.env.PAYMONGO_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/',(req,res) => {
 res.json({message: 'SaveYour backend is running!'});
});

app.post('/create-paymongo-payment', async(req,res)=>{
 try{
  const {amount} = req.body;

  const response = await fetch('https://api.paymongo.com/v1/links',{
   method: 'POST',
   headers:{
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`,

   },
   body: JSON.stringify({
    data:{
     attributes: {
      amount:amount,
      currency: 'PHP',
      description: 'SaveYour App Donation',
      remarks: 'Buy me a coffee!',
     },
    },
   }),
  });

  const data = await response.json();
   console.log('PayMongo response:', JSON.stringify(data));
  res.json(data);
 }catch(error){
  console.log('PayMongo error:', error);
  res.status(500).json({error: 'Payment failed'})
 }
})

app.listen(PORT, ()=> {
 console.log(`Server running on port ${PORT}`);
});

