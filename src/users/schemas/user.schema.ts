import { Schema, Document } from 'mongoose';

// export interface User extends Document {
//   name: string;
//   email: string;
//   avatar: string;
// }
//
// @Schema()
// export const UserSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   avatar: { type: String, required: true },
// });

// export const CatSchema = SchemaFactory.createForClass(Cat);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
