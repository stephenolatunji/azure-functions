const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');


module.exports = function(context, req){

    const {email, password }= req.body || req.query;
    
    try{
        (async()=> {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const sql1 = `UPDATE supervisors SET password = '${hashed}', activated = 1 WHERE email = '${email}'`;
            const sql2 = `SELECT * FROM supervisors WHERE email = '${email}'`;
             connectDB.query(sql1, (err, results) => {
                if (err) {
                    context.res =  {status: 400, body: "Can not register"}
                    context.done()
                }
                else {
                    // (async() =>{
                    connectDB.query(sql2, 
                        (err, rows) => {
                        if(err){
                            context.res = {status: 400, body: "Can not find registered user"};
                            context.done()
                        }
                        else{
                            // const result = results;
                            const user = {
                                id: rows[0].id,
                                name: rows[0].name,
                                email: rows[0].email,
                                activated: rows[0].activated,
                                role: rows[0].role
                            };
                            const now = Math.floor(Date.now() / 1000),
                            iat = (now - 10),
                            jwtId = Math.random().toString(36).substring(7);

                            const payload = {
                                iat: iat,
                                jwtid: jwtId,
                                user
                            };
                            jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 3600,}, (err, token) => {
                                if (err) {
                                    context.res = {status: 500, body: err.message}
                                }
                                else {
                                    context.res = {status: 200, body: {token, msg: "Successfully registered"}} 
                                }
                                context.done()
                            })
                        
                        }
                    
                // })()
                    })
                }
        })
        })()
        
   
       
    }
    catch(err){
        context.res = {status: 500, body: err.message};
        context.done()
    }
    
}