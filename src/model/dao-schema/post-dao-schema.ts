import * as mongoose from "mongoose";
import { Timestamp } from "bson";

/**
 * mongoose schema for post
 * @export
 * @constant PostSchema
 */
export const PostSchema : mongoose.Schema = new mongoose.Schema({
    userEmail : {
        type : String,
        lowercase : true,
    },
    userName : {
        type : String,
        lowercase : true
    },
    userType : {
        type : String,
        default : 'anonymous'
    },
    postTitle: {
        type : String,
        unique : true
    },
    postDescription: {
        type : String
    },
    likes : {
        type: Object
    },
    comments: {
        type: Object
    },
    share: {
        type: Object
    },
    popularityCount: {
        type: Number,
        default: 0
    },
    postType: {
        type: Object
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date, 
        default: Date.now
    }

}, { collection : 'posts', strict : false});