import IMongoMenuItem from '../../../models/food/IMongoMenuItem';
import { Document, Schema, Model, model } from 'mongoose';

export interface IMenuItemModel extends IMongoMenuItem, Document {}

export const MenuItemSchema: Schema = new Schema({
    name: String,
    nameLower: { type: String, index: true },
    venue: String,
    formattedDate: { type: String, index: true },
    meal: { type: Number, index: true },
    diningHall: { type: String, index: true },
    preferences: [String],
    allergens: [String],
    isVegetarian: { type: Boolean, index: true },
    isVegan: { type: Boolean, index: true },
    isGlutenFree: { type: Boolean, index: true }
});

export const MenuItem: Model<IMenuItemModel> = model<IMenuItemModel>('MenuItem', MenuItemSchema);