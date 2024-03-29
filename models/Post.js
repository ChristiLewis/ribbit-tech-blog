//IMPORT LIBRARIES
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//CREATE POST MODEL
class Post extends Model {
    static uprate(body, models) {
        return models.Rate.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM rate WHERE post.id = rate.post_id)'),
                        'rate_count'
                    ]
                ]
            });
        });
    }
}

Post.init({
    //FIRST PARAMETER - MAKE COLUMNS
    id: {
        //SEQUELIZE DATA
        type: DataTypes.INTEGER,
        //SQL=NOT NULL
        allowNull: false,
        //SQL SIM
        primaryKey: true,
        //SQL SIM
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        //VERIFY THE LINK
        validate: {
            isURL: true
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        reference: {
            //REFERENCES THE MODELS/USER.JS FILE TO SET THE KEY ID OF THE USER MAKING THE POST
            model: 'user',
            //SQL FOREIGN KEY
            key: 'id'
        }
    },
},
    //SECOND PARAMETER DEFINE THE METADATA
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;