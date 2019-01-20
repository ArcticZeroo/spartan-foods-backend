import { IMenuItem } from '@arcticzeroo/spartan-foods-api/dist';
import IFoodPreferenceData from './IFoodPreferenceData';

export default interface IMongoMenuItem extends IMenuItem, IFoodPreferenceData {
    nameLower: string;
    nameCleaned: string;
    venue: string;
    time: number;
    formattedDate: string;
    meal: number;
    // search name
    diningHall: string;
}