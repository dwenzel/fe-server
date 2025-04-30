import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { Item } from '../models/Item';
import { Metadata } from '../models/Metadata';
import { Page } from '../models/Page';
import { PageAttributesValue } from '../models/PageAttributesValue';
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete an item
     * @param id 
     */
    public itemsIdDelete(id: string, _options?: Configuration): Promise<void> {
        const result = this.api.itemsIdDelete(id, _options);
        return result.toPromise();
    }

    /**
     * Update an item
     * @param id 
     * @param item 
     */
    public itemsIdPut(id: string, item: Item, _options?: Configuration): Promise<void> {
        const result = this.api.itemsIdPut(id, item, _options);
        return result.toPromise();
    }

    /**
     * Create a new item
     * @param item 
     */
    public itemsPost(item: Item, _options?: Configuration): Promise<void> {
        const result = this.api.itemsPost(item, _options);
        return result.toPromise();
    }

    /**
     * Delete a page
     * @param id 
     */
    public pagesIdDelete(id: string, _options?: Configuration): Promise<void> {
        const result = this.api.pagesIdDelete(id, _options);
        return result.toPromise();
    }

    /**
     * Update a page
     * @param id 
     * @param page 
     */
    public pagesIdPut(id: string, page: Page, _options?: Configuration): Promise<void> {
        const result = this.api.pagesIdPut(id, page, _options);
        return result.toPromise();
    }

    /**
     * Create a new page
     * @param page 
     */
    public pagesPost(page: Page, _options?: Configuration): Promise<void> {
        const result = this.api.pagesPost(page, _options);
        return result.toPromise();
    }


}



