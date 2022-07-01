const fs = require('fs');
const path = require('path');
const queryDB = require('../../../queries/queryDB');

class Takeout{
    constructor(userId){
        this.userId = userId;
    }

    async export(columns){
        for(const column of columns){
            let identification;
            let cells;
            switch(column){
                case 'users':
                    identification = 'id';
                    break;
                case 'posts':
                    identification = 'author_id';
                    break;
                case 'comments':
                    identification = 'author_id';
                    break;
                case 'chat_membership':
                    identification = 'user_id';
                    break;
                case 'connections':
                    cells = await queryDB(column, 'get', { where: ['user_a_id', 'user_b_id'], whereCondition: 'OR' }, [this.userId, this.userId]);
                    break;
                case 'images':
                    cells = [];
                    const posts = await queryDB('posts', 'get', { where: ['author_id'] }, [this.userId]);
                    for(const post of posts){
                        cells = [
                            ...cells,
                            ...await queryDB('images', 'get', { where: ['post_id'] }, [post.id])
                        ];
                    }
                    break;
                case 'chats':
                    cells = [];
                    const chatIds = (await (await queryDB('chat_membership', 'get', { where: ['user_id'] }, [this.userId]))).map(chat => chat.chat_id);
                    for(const chatId of chatIds){
                        cells = [
                            ...cells,
                            ...await queryDB('chats', 'get', { where: ['chat_id'] }, [chatId])
                        ];
                    }
                    break;
            }
            if(identification) cells = await queryDB(column, 'get', { where: [identification] }, [this.userId]);
            this.writeCSV(column, cells);
        }
    }

    writeCSV(name, cells){
        let takeoutDirectory = path.resolve(path.join(__dirname, '../../../takeouts'));
        if (!fs.existsSync(takeoutDirectory)) fs.mkdirSync(takeoutDirectory);

        if(cells.length > 0){

            takeoutDirectory = path.resolve(path.join(__dirname, `../../../takeouts/${this.userId}`));
            if (!fs.existsSync(takeoutDirectory)) fs.mkdirSync(takeoutDirectory);

            const writeStream = fs.createWriteStream(`${takeoutDirectory}/${name}.csv`);
            writeStream.write(Object.keys(cells[0]).join(','));

            for (const cell of cells){
                writeStream.write(`\n`);
                writeStream.write(Object.values(cell).join(','));
            }

            writeStream.close();
        }
    }
}

module.exports = Takeout;