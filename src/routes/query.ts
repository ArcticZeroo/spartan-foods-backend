import { Datastore } from '@google-cloud/datastore';
import app from '../express-app';
import { Response } from 'express';

function BadRequest(response: Response) {
    response.status(400).send('Bad Request');
}

app.use('/api/menu/search', function (req, res) {
    const foodName = req.query.name;

    if (!foodName || !foodName.trim()) {
        return BadRequest(res);
    }

});