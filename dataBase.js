const mysql = require('mysql2/promise');

class Database{
    constructor(){
        if(!Database.instance){
            this.pool = mysql.createPool({
                host : '127.0.0.1' ,
                user : 'root' ,
                password: '1234' ,
                database : 'mini_project'
            });

            Database.instance = this;
        }
    }

    async getConnection(){
        try{
            return await this.pool.getConnection();
        }catch(err){
            console.log('Error while getting connection',err);
            throw err;
        }
    }
}

module.exports = new Database();