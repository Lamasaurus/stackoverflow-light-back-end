import mongoose, { Document, Schema } from 'mongoose';

// Export a class that just extends ObjectId to make includes easier
export class ObjectId extends mongoose.Types.ObjectId{
  constructor(...args){
    super(...args);
  }
};

// A base interface for Document Schemas
export interface ISchemaBasis extends Document {
  _id: ObjectId;
}