const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db')


module.exports = function(context, req){
    const email = req.body.email;
    const password = req.body.password;
    try{
        const sql = `SELECT * FROM supervisors WHERE email = '${email}'`
        connectDB.query(sql, (err, results) => {
            if (results.length > 0){
                (async () =>{
                    let isMatch;
                    const rows = results[0];
                    isMatch = await bcrypt.compare(password, rows.password);
                    if (!isMatch) {
                        context.res = {status: 401, body: "Invalid Credential"}
                        context.done()
                    }
                    else{
                        const user = {
                            id: rows.id,
                            name: rows.name,
                            email: rows.email,
                            role: rows.role,
                            activated: rows.activated
                        };
                        const now = Math.floor(Date.now() / 1000),
                        iat = (now - 10),
                        jwtId = Math.random().toString(36).substring(7);

                        const payload = {
                            iat,
                            jwtId,
                            user
                        };
                        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 3600}, (err, token) => {
                            if (token) {
                                context.res = {status: 200, body: {token, msg: "Successfully signed in"}}
                                // context.res = {status: 200, body: "Success"}
                            }
                            else {
                                context.res = {status: 500, body: "Error Validating!"}
                            }
                            context.done()
                        })
                   }
            })()
            
            }
            else{
                
                context.res = {status: 404, body: "User not found"}
            }
        })
        
    }
    catch(err){
        context.log(err)
        context.res = {status: 500, body: "Server Error"}
    }
   
}