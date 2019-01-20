/*declare module '@google-cloud/datastore' {
    import { DatastoreKey } from '@google-cloud/datastore/entity';
    import IDataStoreEntity from '../../interfaces/datastore/IDataStoreEntity';

    type OneOrMany<T> = T | T[];

    class Query {
        filter(property: string, operator: string, value: any): this;
        order(property: string, options: { descending?: boolean, ascending?: boolean }): this;
    }

    interface IDataStoreOptions {
        keyFilename: string;
    }

    export class Datastore {
        constructor(options?: Partial<IDataStoreOptions>);

        key(name: string | string[]): DatastoreKey;
        save(entity: OneOrMany<IDataStoreEntity>): Promise<void>;
        createQuery(kind: string): Query;
        runQuery(query: Query): Promise<>
    }
}*/