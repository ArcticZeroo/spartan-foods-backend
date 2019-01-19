import { FoodFrozorClient, IFoodClient, IMenusForDay } from '@arcticzeroo/spartan-foods-api/dist';
import MenuDate from '@arcticzeroo/spartan-foods-api/dist/date/MenuDate';
import { Datastore } from '@google-cloud/datastore';
import config from '../config.json';
import IDataStoreEntity from '../models/datastore/IDataStoreEntity';
import IDatastoreMenuItem from '../models/food/IDatastoreMenuItem';
import DataStoreUtil from '../util/DataStoreUtil';
import FoodUtil from '../util/FoodUtil';

const datastore = new Datastore({
    keyFilename: config.KEY_FILE_PATH
});

const foodClient: IFoodClient = new FoodFrozorClient();

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
    const menusToSave: IDataStoreEntity[] = [];

    const halls = Object.keys(menusForDay);
    const menuItemKey = datastore.key(['MenuItem']);

    for (const diningHall of halls) {
        const meals = menusForDay[diningHall];

        for (let meal = 0; meal < meals.length; ++meal) {
            const menu = meals[meal];

            for (const venue of menu.venues) {
                for (const item of venue.menu) {
                    const foodPreferenceData = FoodUtil.getFoodPreferenceData(item);

                    const dataStoreMenuItem: IDatastoreMenuItem = {
                        name: item.name,
                        nameLower: item.name.toLowerCase(),
                        venue: venue.venueName,
                        preferences: item.preferences,
                        allergens: item.allergens,
                        ...foodPreferenceData,
                        formattedDate, diningHall, meal
                    };

                    menusToSave.push(DataStoreUtil.createEntity<IDatastoreMenuItem>(menuItemKey, dataStoreMenuItem, { excludeIndexing: ['preferences', 'allergens', 'venueName', 'name'] }));
                }
            }
        }
    }

    console.log(`Preparing to save ${menusToSave.length} menus (${Math.ceil(menusToSave.length / 500)} chunk(s))`);

    try {
        await DataStoreUtil.saveLotsOfEntities(datastore, menusToSave);
    } catch (e) {
        throw e;
    }

    console.log('saved!');
}

async function retrieveAndSaveMenus() {
    const menuDate = new MenuDate();

    for (let i = 0; i < 7; ++i) {
        console.log('Retrieving menu for day', i);

        try {
            await retrieveMenusForDayAndSave(menuDate);
        } catch (e) {
            console.error('Could not do it for day', i);
            console.error(e);
            continue;
        }

        menuDate.forward();
    }
}

retrieveAndSaveMenus().catch(console.error);