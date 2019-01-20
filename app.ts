import Logger from 'frozor-logger';
import app from './src/express-app';
import Repository from './src/repository/Repository';
import useQueryRoute from './src/routes/query';

const log = new Logger();

log.info('Starting query server...');

Repository.instance.start();

useQueryRoute(app);

const port = 2783;

app.listen(port, function () {
    log.info('Now listening on port ' + log.chalk.magenta(port.toString()) + '!');
});