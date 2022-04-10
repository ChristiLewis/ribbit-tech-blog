//IMPORT THE USER MODEL AND EXPORT AN OBJECT WITH THE USER MODEL AS ITS PROPERTY:

const User = require('./User');
const Post = require('./Post');
const Rate = require('./Rate');
const Comment = require('./Comment');

//LINK ASSOCIATIONS
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

//THE .BELONGSTOMANY() METHOD FOR THE MANY : MANY RELATIONSHIP OF MANY USERS VOTING ON MANY POSTS
User.belongsToMany(Post, {
    through: Rate,
    as: 'rated_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Rate,
    as: 'rated_posts',
    foreignKey: 'post_id'
});

//TO SEE A TOTAL COUNT OF RATINGS FOR A SINGLE POST AND OTHER FUNCTIONS CALLED AGGREGATED SQL FUNCTIONS BETWEEN MODELS, WE NEED ONE: MANY RELATIONSHIPS DEFINED
Rate.belongsTo(User, {
    foreignKey: 'user_id'
});

Rate.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Rate, {
    foreignKey: 'user_id'
});

Post.hasMany(Rate, {
    foreignKey: 'post_id'
});

//COMMENT ASSOCIATIONS MANY:MANY SIM TO RATE ASSOCIATIONS ABOVE

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});


//EACH CONSTANT ADDED ABOVE TO BE REQUIRED IS ADDED TO THE ARRAY INSIDE THE CURLY BRACKETS BELOW IN ORDER TO EXPORT EVERYTHING WE IMPORTED AFTER TRANSFORMING THEM.
module.exports = { User, Post, Rate, Comment };