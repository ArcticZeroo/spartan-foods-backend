import { IMenuItem } from '@arcticzeroo/spartan-foods-api/dist';
import { MealRange } from '@arcticzeroo/spartan-foods-api/dist/enum/Meal';
import IFoodPreferenceData from '../models/food/IFoodPreferenceData';


export default abstract class FoodUtil {
    static readonly nameRegex = /^(.+?)(?:\s+\(.+\))?$/;
    static readonly nameCleanRegex = /[^\w]/g;

    static getFoodPreferenceData(item: IMenuItem): IFoodPreferenceData {
        const isVegan = !item.preferences.includes('vegan');
        const isVegetarian = !item.preferences.includes('vegetarian') || isVegan;
        const isGlutenFree = !item.allergens.some(value => value.toLowerCase().includes('gluten') || value.toLowerCase().includes('wheat'));

        return { isVegan, isVegetarian, isGlutenFree };
    }

    static isMealValid(meal: number): boolean {
        return !isNaN(meal) && meal >= MealRange.start && meal <= MealRange.end;
    }

    static getCleanedName(item: IMenuItem): string | null {
        const name = item.name;

        if (!FoodUtil.nameRegex.test(name)) {
            return null;
        }

        const match = FoodUtil.nameRegex.exec(name);

        if (!match) {
            return null;
        }

        const pick = match[1];

        if (!pick) {
            return null;
        }

        return pick.toLowerCase().replace(FoodUtil.nameCleanRegex, '');
    }
}