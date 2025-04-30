import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { Item } from '../models/Item';
import { Metadata } from '../models/Metadata';
import { Page } from '../models/Page';
import { PageAttributesValue } from '../models/PageAttributesValue';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiItemsIdDeleteRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApiitemsIdDelete
     */
    id: string
}

export interface DefaultApiItemsIdPutRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApiitemsIdPut
     */
    id: string
    /**
     * 
     * @type Item
     * @memberof DefaultApiitemsIdPut
     */
    item: Item
}

export interface DefaultApiItemsPostRequest {
    /**
     * 
     * @type Item
     * @memberof DefaultApiitemsPost
     */
    item: Item
}

export interface DefaultApiPagesIdDeleteRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApipagesIdDelete
     */
    id: string
}

export interface DefaultApiPagesIdPutRequest {
    /**
     * 
     * @type string
     * @memberof DefaultApipagesIdPut
     */
    id: string
    /**
     * 
     * @type Page
     * @memberof DefaultApipagesIdPut
     */
    page: Page
}

export interface DefaultApiPagesPostRequest {
    /**
     * 
     * @type Page
     * @memberof DefaultApipagesPost
     */
    page: Page
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete an item
     * @param param the request object
     */
    public itemsIdDelete(param: DefaultApiItemsIdDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.itemsIdDelete(param.id,  options).toPromise();
    }

    /**
     * Update an item
     * @param param the request object
     */
    public itemsIdPut(param: DefaultApiItemsIdPutRequest, options?: Configuration): Promise<void> {
        return this.api.itemsIdPut(param.id, param.item,  options).toPromise();
    }

    /**
     * Create a new item
     * @param param the request object
     */
    public itemsPost(param: DefaultApiItemsPostRequest, options?: Configuration): Promise<void> {
        return this.api.itemsPost(param.item,  options).toPromise();
    }

    /**
     * Delete a page
     * @param param the request object
     */
    public pagesIdDelete(param: DefaultApiPagesIdDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.pagesIdDelete(param.id,  options).toPromise();
    }

    /**
     * Update a page
     * @param param the request object
     */
    public pagesIdPut(param: DefaultApiPagesIdPutRequest, options?: Configuration): Promise<void> {
        return this.api.pagesIdPut(param.id, param.page,  options).toPromise();
    }

    /**
     * Create a new page
     * @param param the request object
     */
    public pagesPost(param: DefaultApiPagesPostRequest, options?: Configuration): Promise<void> {
        return this.api.pagesPost(param.page,  options).toPromise();
    }

}
