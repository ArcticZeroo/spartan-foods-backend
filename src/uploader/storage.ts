import { FoodFrozorClient, IFoodClient, IMenusForDay } from '@arcticzeroo/spartan-foods-api/dist';
import MenuDate from '@arcticzeroo/spartan-foods-api/dist/date/MenuDate';
import { Datastore } from '@google-cloud/datastore';
import IMongoMenuItem from '../models/food/IMongoMenuItem';
import Repository from '../repository/Repository';
import FoodUtil from '../util/FoodUtil';
import { MenuItem } from '../repository/models/food/MenuItem';

const foodClient: IFoodClient = new FoodFrozorClient();

async function saveMenuItems(menuItems: IMongoMenuItem[]) {
    return MenuItem.insertMany(menuItems);
}

async function retrieveMenusForDayAndSave(day: MenuDate) {
    console.log('Retrieving menus for day');

    console.log(FoodFrozorClient.getRequestUrlForEntireDay(day));

    let menusForDay: IMenusForDay;
    try {
        // todo: flip the order to make the array optional
        menusForDay = await foodClient.retrieveAllHallMenusForDay([], day);
    } catch (e) {
        throw e;
    }

    console.log('Got them');

    const formattedDate = day.getFormatted();

    const menusToSave: IMongoMenuItem[] = [];

    const halls = Object.keys(menusForDay);

    for (const diningHall of halls) {
        const meals = menusForDay[diningHall];

        for (let meal = 0; meal < meals.length; ++meal) {
            const menu = meals[meal];

            for (const venue of menu.venues) {
                const usedNames = {};

                for (const item of venue.menu) {
                    const foodPreferenceData = FoodUtil.getFoodPreferenceData(item);

                    if (usedNames.hasOwnProperty(item.name.toLowerCase())) {
                        continue;
                    }

                    usedNames[item.name.toLowerCase()] = true;

                    const dataStoreMenuItem: IMongoMenuItem = {
                        name: item.name,
                        nameLower: item.name.toLowerCase(),
                        venue: venue.venueName,
                        preferences: item.preferences,
                        allergens: item.allergens,
                        ...foodPreferenceData,
                        formattedDate, diningHall, meal
                    };

                    menusToSave.push(dataStoreMenuItem);
                }
            }
        }
    }

    try {
        await saveMenuItems(menusToSave);
    } catch (e) {
        throw e;
    }

    console.log('saved!');
}

async function retrieveAndSaveMenus() {
    const menuDate = new MenuDate();

    for (let i = 0; i <= 7; ++i) {
        console.log('Retrieving menu for day', i);

        console.log(menuDate.getFormatted());
        console.log(menuDate.date);

        try {
            await retrieveMenusForDayAndSave(menuDate);
        } catch (e) {
            console.error('Could not do it for day', i);
            console.error(e);
        }

        menuDate.forward();
    }
}

Repository.instance.onReady(() => retrieveAndSaveMenus().catch(console.error));
