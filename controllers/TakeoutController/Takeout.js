const fs = require('fs');
const path = require('path');
const axios = require('axios');
const queryDB = require('../../queries/queryDB');
const { getTakeoutDirectory } = require('@froyo-api/constants');

class Takeout{
    constructor(userId){
        this.userId = userId;
        this.takeoutDirectory = `${getTakeoutDirectory()}/${this.userId}`;
    }

    exportToZip(){}
    
    downloadImages(){}

    async downloadProfilePicture(){
        const [{
            profile_picture_bucket_key
        }] = await queryDB('users', 'get', { where: ['id'] }, [this.userId]);

        if(!profile_picture_bucket_key) return;

        this.writeImage('profile_picture', profile_picture_bucket_key);
    }

    async downloadCells(columns){
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
                case 'messages':
                    identification = 'author_id';
                    break;
                case 'chat_membership':
                    identification = 'user_id';
                    break;
                case 'connections':
                    cells = await queryDB(column, 'get', { where: ['user_a_id', 'user_b_id'], whereCondition: 'OR' }, [this.userId, this.userId]);
                    break;
                case 'images':
                    cells = await this.getImageCells();
                    break;
                case 'chats':
                    cells = await this.getChatCells();
                    break;
                case 'likeness':
                    cells = await this.getLikenessCells();
                    break;
            }
            if(identification) cells = await queryDB(column, 'get', { where: [identification] }, [this.userId]);
            this.writeCSV(column, cells);
        }
    }

    async getLikenessCells(){
        let cells = await queryDB('likeness', 'get', { where: ['user_id'] }, [this.userId]);

        const likenessPosts = await queryDB('posts', 'get', { where: ['author_id'] }, [this.userId]);
        for(const post of likenessPosts){
            cells = [
                ...cells,
                ...await queryDB('likeness', 'get', { where: ['content_id'] }, [post.id])
            ];
        };


        const likenessComments = await queryDB('posts', 'get', { where: ['author_id'] }, [this.userId]);
        for(const comment of likenessComments){
            cells = [
                ...cells,
                ...await queryDB('likeness', 'get', { where: ['content_id'] }, [comment.id])
            ];
        }
        return cells;
    }

    async getChatCells(){
        let cells = [];
        const chatIds = (await (await queryDB('chat_membership', 'get', { where: ['user_id'] }, [this.userId]))).map(chat => chat.chat_id);
        for(const chatId of chatIds){
            cells = [
                ...cells,
                ...await queryDB('chats', 'get', { where: ['chat_id'] }, [chatId])
            ];
        }
        return cells;
    }

    async getImageCells(){
        let cells = [];
        const imagePosts = await queryDB('posts', 'get', { where: ['author_id'] }, [this.userId]);
        for(const post of imagePosts){
            cells = [
                ...cells,
                ...await queryDB('images', 'get', { where: ['post_id'] }, [post.id])
            ];
        }
        return cells;
    }

    writeCSV(name, cells){
        if(cells.length <= 0) return;

        if (!fs.existsSync(this.takeoutDirectory)) fs.mkdirSync(this.takeoutDirectory);

        const writeStream = fs.createWriteStream(`${this.takeoutDirectory}/${name}.csv`);
        writeStream.write(Object.keys(cells[0]).join(','));

        for (const cell of cells){
            writeStream.write(`\n`);
            writeStream.write(Object.values(cell).join(','));
        }

        writeStream.close();
    }

    writeImage(name, bucket_id){
        const imageDirectory = `${this.takeoutDirectory}/images`;
        if (!fs.existsSync(imageDirectory)) fs.mkdirSync(imageDirectory);

        axios({ url: `https://api.froyo.social/images/${bucket_id}`, responseType: 'stream' })
        .then(response => {
            response.data.pipe(fs.createWriteStream(`${imageDirectory}/${name}.png`));
        }).catch(err => {
            return new Error(err.message);
        });
    }
}

module.exports = Takeout;