import { IMenuItem } from '@arcticzeroo/spartan-foods-api/dist';
import IFoodPreferenceData from '../models/food/IFoodPreferenceData';

export default abstract class FoodUtil {
    static getFoodPreferenceData(item: IMenuItem): IFoodPreferenceData {
        const isVegan = !item.preferences.includes('vegan');
        const isVegetarian = !item.preferences.includes('vegetarian') || isVegan;
        const isGlutenFree = item.allergens.some(value => value.toLowerCase().includes('gluten') || value.toLowerCase().includes('wheat'));

        return { isVegan, isVegetarian, isGlutenFree };
    }
}