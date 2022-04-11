import Filter from "sap/ui/model/Filter";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Sorter from "sap/ui/model/Sorter";
export type ProductEntity = {
    ID: number;
    Name: string;
    Description: string;
    ReleaseDate: Date;
    DiscontinuedDate: Date;
    Rating: number;
    Price: number;
};
export type AddressEntity = {
    Street: string;
    City: string;
    State: string;
    ZipCode: string;
    Country: string;
};
export type SuppliersEntity = {
    ID: number;
    Name: string;
    Address: AddressEntity;
    Concurrency: number;
    Products?: { results: Array<ProductEntity> } | Array<ProductEntity>;
};

/**
 * @namespace be.wl.ODatav4DemoApp.controller
 */
 export default class NorthwindService{
    private model:ODataModel;
    constructor(model: ODataModel) {
        this.model = model;
    }
    public async getSuppliers(): Promise<SuppliersEntity[]> {
        const suppliersBinding = this.model.bindList("/Suppliers");
        const suppliersContext = await suppliersBinding.requestContexts();
        return suppliersContext.map(supplierContext => supplierContext.getObject() as SuppliersEntity);
        // const result = await this.odata("/Suppliers").get<SuppliersEntitySet>();
        // return result.data.results;
    }
    
    public async getSuppliersWithFilter(filters: Array<Filter>): Promise<SuppliersEntity[]> {
        const suppliersBinding = this.model.bindList("/Suppliers").filter(filters);
        const suppliersContext = await suppliersBinding.requestContexts();
        return suppliersContext.map(supplierContext => supplierContext.getObject() as SuppliersEntity);
        // return this.odata("/Suppliers").get<SuppliersEntitySet>({ filters: filters });
    }
    public async getSupplierById(id: number): Promise<SuppliersEntity> {
        const supplierBinding = this.model.bindContext(`/Suppliers(${id})`);
        const supplierContext = await supplierBinding.requestObject();
        return supplierContext.getObject() as SuppliersEntity;
        // const supplierPath = this.model.createKey("/Suppliers", {
        //     ID: id
        // });
        // return this.odata(supplierPath).get<SuppliersEntity>();
    }
    public async getSupplierNextID(): Promise<number> {
        const suppliersBinding = this.model.bindList("/Suppliers").sort([new Sorter("ID", true)]);
        const suppliersContext = await suppliersBinding.requestContexts(0,1);
        if(suppliersContext.length > 0){
            const supplier = suppliersContext[0].getObject() as SuppliersEntity;
            return ++supplier.ID;
        }
        return 1;
    //     const parameters = { sorters: [new Sorter("ID", true)], urlParameters: { "$top": "1" } };
    //     const response = await this.odata("/Suppliers").get<SuppliersEntitySet>(parameters);
    //     return response.data && response.data.results.length > 0 ? response.data.results[0].ID + 1 : 0;
    }
    // public createSupplier(supplier: SuppliersEntity): Promise<response<SuppliersEntity>> {
    //     return this.odata("/Suppliers").post<SuppliersEntity>(supplier);
    // }
 }