declare module '@google-cloud/datastore' {
    import { DatastoreKey } from '@google-cloud/datastore/entity';
    import IDataStoreEntity from '../../interfaces/datastore/IDataStoreEntity';

    type OneOrMany<T> = T | T[];

    interface IDataStoreOptions {
        keyFilename: string;
    }

    export class Datastore {
        constructor(options?: Partial<IDataStoreOptions>);

        key(name: string | string[]): DatastoreKey;

        save(entity: OneOrMany<IDataStoreEntity>): Promise<void>;
    }
}