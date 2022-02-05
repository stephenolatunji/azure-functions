const connectDB = require('../config/db');

module.exports = function(context, req){
    const email = req.params.email;
        try{
            const sql = `SELECT email, activated from supervisors WHERE email = '${email}'`;
             connectDB.query(sql, (err, results) => {
                console.log(results)
                if (results.length > 0) {
                    const rows = results[0];
                    context.res = { body: rows };
                }
                else {
                    const error = "Not found";
                    console.log('I got an error');
                    context.res = { body: error };
                }

                context.done();
            })
        }
        catch(err){
            context.log(err)
            context.res = {body: "Server Error"}
        }
}