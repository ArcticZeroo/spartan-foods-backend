// @ts-ignore
import { DatastoreKey } from '@google-cloud/datastore/entity';
import IDataStoreData from './IDataStoreData';

export default interface IDataStoreEntity {
    key: DatastoreKey;
    data: IDataStoreData[]
}