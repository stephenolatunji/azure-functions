const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const sendgrid = require('@sendgrid/mail')

module.exports = function (context, req) {
    const email = (req.query.email || (req.body && req.body.email));
        
    try{
        const sql = `SELECT email FROM supervisors WHERE email = '${email}'`
        connectDB.query(sql,
            (err, results) => {
                if(results.length > 0) {
                    const now = Math.floor(Date.now() / 1000),
                    iat = (now - 10),
                    jwtId = Math.random().toString(36).substring(7);
                    const payload = {
                        iat: iat,
                        jwtid: jwtId,
                        email
                    };

                    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 3600}, (err, token) => {
                        if (err) {
                            context.res = {status: 401, body: "Invalid Credentials"}
                        }
                        else{
                            // const url = `https://dms-dev-test.azurewebsites.net/password-reset/${token}`;
                            const url = `http://localhost:3000/password-reset/${token}`;
                            sendgrid.setApiKey(process.env.SEND_GRID_TOKEN);
                            const msg = {
                            to: email,
                            from: 'info@dms.com',
                            subject: 'DMS: Password Reset',
                            html: `<h4>Dear User, Kindly click on the link below to reset your password <b> ${url} </b></h4>`
                            };

                            (async () => {
                            try {
                                await sendgrid.send(msg);
                                
                            } catch (error) {
                                context.res = {status: 500, body: "Message was not sent"}
                            }
                            })();
                        context.res = {status: 200, body: "Message Sent Successfully"}
                        }
                        context.done()
                    }); 
                }
                else{
                    context.res = {status: 404, body: "User not found!"}
                    context.done() 
                }
                    
        })    
        
    }
    catch(err){
        context.res = {status: 500, body: "Server Error"}
        context.done()
    }
}