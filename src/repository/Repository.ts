import Logger from 'frozor-logger';
import mongoose from 'mongoose';
import databaseConfig from '../../vault/database.json';
import ReadyState from '../enum/ReadyState';

const log = new Logger('DATABASE');

type onReadyCallback = () => void;

export default class Repository {
    static get url(): string {
        return `mongodb://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`;
    }

    static instance: Repository = new Repository();

    private onReadyCallbacks: onReadyCallback[] = [];

    get isReady(): boolean {
        return mongoose.connection.readyState === ReadyState.connected;
    }

    private constructor() {}

    private connect(): Promise<void> {
        // @ts-ignore - Unsure why this is an error, it's correct according to docs
        return mongoose.connect(Repository.url, { useNewUrlParser: true });
    }

    public onReady(): Promise<void>;
    public onReady(callback: onReadyCallback): void;
    public onReady(callback?: onReadyCallback): Promise<void> | void {
        if (!callback) {
            return new Promise(resolve => this.onReady(resolve));
        }

       if (this.isReady) {
           callback();
           return;
       }

       this.onReadyCallbacks.push(callback);
    }

    public start(): void {
        log.info('Starting database...');

        this.connect()
            .then(() => {
                log.info('Connected to MongoDB!');
                this.onReadyCallbacks.forEach(callback => callback());
                this.onReadyCallbacks.splice(0);
            })
            .catch(e => console.error('Could not connect to mongodb:', e));
    }
}