const express = require('express')
const cors = require('cors')
const app = express()
const helper = require('./helper')
const port = process.env.PORT || 2000
const jwt = require("jsonwebtoken")
const jwtKey = process.env.TOKEN_KEY || 'secret'
const checkAuth = require("./Middleware/checkAuth.middleware")
const https = require('https');
const fs = require('fs');

// const options = {
//   key: fs.readFileSync('ssl/privkey.pem'),
//   cert: fs.readFileSync('ssl/cert.pem'),
//   ca: fs.readFileSync('ssl/chain.pem'),
// };

app.use('/Public', express.static('Public'));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const mainRoute=require('./Routes/Main')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))


app.use(function(req, res, next) {
    if(helper.isCorsEnabled()) {
        next();
    }else{
        res.json({
            success:false,
            status:403,
            message:'Unauthorized access denied',
            data:null
        })
    }    
});

app.get('/', mainRoute);

// app.post("/welcome", checkAuth, (req, res) => {
//     res.status(200).send("Welcome 🙌 ");
// });

// app.post("/generateToken", (req, res) => {
//     const token = jwt.sign(
//         { user_id: 1, email:'test@test.com' },
//         jwtKey,
//         {
//           expiresIn: "2h",
//         }
//       );
//     res.status(200).send(token);
// });

app.listen(port, function(err){
    if(err) console.log(err)
    console.log('listening', port)
});

// const server = https.createServer(options, app);

// server.listen(443, () => {
//   console.log('Server listening on port 443');
// });
