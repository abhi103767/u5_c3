
const  express = require('express');
const {v4 : uuidv4} = require('uuid')

const fs = require('fs');
const { parse } = require('path');
const app = express();
require('dotenv').config();
const port  = process.env.PORT || 4000;

app.use(express.urlencoded({extended : true}));

app.use(express.json())


const auth = (req,res,next) => {
    
    if(req.url==='/user/login'){
        fs.readFile('./db.json','utf-8',(err,data) => {
           const parsed = JSON.parse(data);
           let user = parsed.users.filter((user) => 
           user.email == req.body.email && user.password == req.body.password
           )
           console.log(user);

           if(user.length !== 0) next();
           else res.status(401).send({status: "Invalid Credentials" })
        })
    }

 
}

app.get('/',(req,res) => {
    res.send('Welcome to evaluation RCT201 C3')
})
app.post('/user/create',(req,res) => {

   fs.readFile('./db.json','utf-8', (err,data) => {
       const parsed = JSON.parse(data);
       const id = uuidv4()
       console.log(req.body);
       const newUsers = {
           id : id,
           ...req.body
       }
       
       parsed.users = [...parsed.users,newUsers];
       console.log(parsed.users);
      fs.writeFile('./db.json', JSON.stringify(parsed),() => {
          console.log('file is writed successfully')
          res.status(201).send({
              status: "user created",
              id : id
            })
      })
   })
})

   app.post('/user/login',auth,(req,res) => {
       const token = uuidv4()
       res.send({
        status: "Login Successful", token 
       })
   })

//    fs.readFile('./db.json','utf-8',(err,data) => {
//     const parsed = JSON.parse(data);
// })

// votes 
   app.get('/votes/party/:party',(req,res) => {
       const party = req.params.party

       fs.readFile('./db.json','utf-8',(err,data) => {
              const parsed = JSON.parse(data);
         const voters = parsed.users.filter((user) => user.party === party);
         res.send(voters);
       })
   })

   app.get('/votes/voters',(req,res) => {
   
    
    fs.readFile('./db.json','utf-8',(err,data) => {
           const parsed = JSON.parse(data);
      const voters = parsed.users.filter((user) => user.role === 'voter');
      res.send(voters);
    })

})


app.post('/user/logout',(req,res) => {
    res.send({ status: "user logged out successfully" })
})

app.post('/votes/vote/:user',(req,res) => {

    const name = req.params.user;
    console.log(name)

       fs.readFile('./db.json','utf-8',(err,data) => {
    const parsed = JSON.parse(data);
    const users = parsed.users.filter((user) => {
           return  user.name !== name
    })

    const user = parsed.users.find((user) => {
      return  user.name === name
})
console.log(user)

    const updatedUsers = [...users,
        {
            ...user ,
            votes : user.votes + 1
        }
    ];


   console.log(updatedUsers);

    parsed.users = updatedUsers;
   
    
    fs.writeFile('./db.json', JSON.stringify(parsed),() => {
        console.log('voting is done');
        res.send('voted');
    })
})
})



app.get('/votes/count/:user', (req,res) => {
    const name = req.params.user;
    console.log(name)


       fs.readFile('./db.json','utf-8',(err,data) => {
    const parsed = JSON.parse(data);
   

    const user = parsed.users.find((user) => {
      return  user.name === name
})
    
   if(user) {
       res.send({
           status : user.votes
       })
   }
   else {
    res.send({
        status : 'cannot find user'
    })
}
})
})


app.get('/db', (req,res) => {
       fs.readFile('./db.json','utf-8',(err,data) => {
    const parsed = JSON.parse(data);
    res.send(parsed.users);
})
})

app.post('/db',(req,res) => {
    const parsed = {
        users : []
    }


    parsed.users = [...req.body];
    console.log(parsed)

   
    fs.writeFile('./db.json',JSON.stringify(parsed), () => {
        console.log('file writing is successfully')
        res.send('Entire dataBase is updated ');
    })
    
})



app.listen(port,(req,res) => {
   
})



