import { MealRange } from '@arcticzeroo/spartan-foods-api/dist/enum/Meal';
import { Application, Request, Response } from 'express';
import { IMenuItemModel, MenuItem } from '../repository/models/food/MenuItem';

const MENU_DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

function BadRequest(response: Response) {
    response.status(400).send('Bad Request');
}

function handleBooleanQuery(query: any, queryParam: string, req: Request, reqQueryParam?: string): void {
    if (!reqQueryParam) {
        reqQueryParam = queryParam;
    }

    if (typeof req.query[reqQueryParam] === 'undefined') {
        return;
    }

    const value: string = (req.query[reqQueryParam] as string).toLowerCase();

    if (value === 'true') {
        query[queryParam] = true;
    } else if (value === 'false') {
        query[queryParam] = false;
    }
}

export default function useQueryRoute(app: Application) {
    app.use('/spartahack/api/menu/search', function (req, res) {
        const query: any = {};

        const nameQuery = req.query.name;

        if (nameQuery && nameQuery.trim()) {
            query.nameLower = new RegExp(nameQuery.toLowerCase());
        }

        handleBooleanQuery(query, 'isGlutenFree', req);
        handleBooleanQuery(query, 'isVegan', req);
        handleBooleanQuery(query, 'isVegetarian', req);

        if (req.query.diningHall) {
            // todo
        }

        if (req.query.dateStart && MENU_DATE_REGEX.test(req.query.dateStart)) {
            // todo
        }

        if (req.query.dateEnd && MENU_DATE_REGEX.test(req.query.dateEnd)) {
            // todo
        }

        if (req.query.dateExact && MENU_DATE_REGEX.test(req.query.dateExact)) {
            // todo
        }

        if (req.query.meal && !isNaN(req.query.meal)) {
            const meal = parseInt(query.meal);

            if (meal >= MealRange.start && meal <= MealRange.end) {
                query.meal = meal;
            }
        }

        // TODO: Configuration
        const limit = 50;

        MenuItem.find(query, { _id: false, __v: false })
            .sort({ time: 1, meal: 1 })
            .limit(limit)
            .then((docs: IMenuItemModel[] = []) => res.status(200).json(docs))
            .catch(() => res.status(500).send('Internal Server Error'));
    });
}