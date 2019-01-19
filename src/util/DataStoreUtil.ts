import { Datastore } from '@google-cloud/datastore';
import { DatastoreKey } from '@google-cloud/datastore/entity';
import IDataStoreData from '../models/datastore/IDataStoreData';
import IDataStoreEntity from '../models/datastore/IDataStoreEntity';

export interface IObjectToDataStoreOptions {
    excludeIndexing?: string[];
    enableIndexing?: boolean;
}

export default abstract class DataStoreUtil {
    static objectToDatastore<T>(obj: T, options: IObjectToDataStoreOptions = {}): IDataStoreData[] {
        const { excludeIndexing = [], enableIndexing = true } = options;

        return Object.keys(obj)
            .map(key => ({
                name: key,
                value: obj[key],
                excludeFromIndexes: !enableIndexing || excludeIndexing.includes(key)
            }))
            .filter(item => item != null);
    }

    static createEntity<T>(key: DatastoreKey, obj: T, options?: IObjectToDataStoreOptions): IDataStoreEntity {
        return {
            key,
            data: DataStoreUtil.objectToDatastore(obj, options)
        }
    }

    static async saveLotsOfEntities(datastore: Datastore, entities: IDataStoreEntity[]): Promise<void> {
        const pieces: Array<IDataStoreEntity[]> = [];

        while (entities.length > 500) {
            pieces.push(entities.splice(0, Math.min(entities.length, 500)));
        }

        for (const piece of pieces) {
            try {
                await datastore.save(piece);
            } catch (e) {
                throw e;
            }
        }
    }
}