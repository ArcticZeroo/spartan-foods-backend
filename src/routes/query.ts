import { Datastore } from '@google-cloud/datastore';
import app from '../express-app';
import config from '../../config.json';

const datastore = new Datastore({
    keyFilename: config.KEY_FILE_PATH
});

app.use('/api/menu/search', function (req, res) {

});