import { BaseDataBase } from "./data/BaseDataBase";
import { CustomError } from "./error/customError";

class Tables extends BaseDataBase {
   public async createTable(): Promise<void> {
     try {
       await BaseDataBase.connection
         .raw(
            `
      CREATE TABLE IF NOT EXISTS labook_users(
         id VARCHAR(255) PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) UNIQUE NOT NULL,
         password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS labook_posts(
         id VARCHAR(255) PRIMARY KEY,
         photo VARCHAR(255) NOT NULL,
         description VARCHAR(255) NOT NULL,
         type ENUM("normal","event") DEFAULT "normal",
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         author_id VARCHAR(255),
         FOREIGN KEY (author_id) REFERENCES labook_users (id)
      );
      
      CREATE TABLE IF NOT EXISTS labook_friends(
         id VARCHAR(255) PRIMARY KEY,
         user_id VARCHAR(255),
         friend_id VARCHAR(255),
         FOREIGN KEY (user_id) REFERENCES labook_users (id)
         );

      CREATE TABLE IF NOT EXISTS labook_likes(
         id VARCHAR(255) PRIMARY KEY,
         user_id VARCHAR(255),
         post_id VARCHAR(255),
         FOREIGN KEY (user_id) REFERENCES labook_users (id),
         FOREIGN KEY (post_id) REFERENCES labook_posts (id)
      );

      CREATE TABLE IF NOT EXISTS labook_comments(
         id VARCHAR(255) PRIMARY KEY,
         comment VARCHAR(255) NOT NULL,
         user_id VARCHAR(255),
         post_id VARCHAR(255),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY (user_id) REFERENCES labook_users (id),
         FOREIGN KEY (post_id) REFERENCES labook_posts (id)
      );
   
   `)
   .then(() => {
    console.log(`Tabelas criadas com sucesso!`)
})
.catch((error: any) => console.log(error.sqlMessage || error.message))
} catch (error: any) {
   throw new CustomError(error.statusCode, error.message);
 }
}
}

const createTable = new Tables();
createTable.createTable();