import Filter from "sap/ui/model/Filter";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Sorter from "sap/ui/model/Sorter";
export type BookEntity = {
    ID: number;
    title: string;
    stock: number;
};
/**
 * @namespace be.wl.ODatav4DemoApp.controller
 */
 export default class NorthwindService{
    private model:ODataModel;
    constructor(model: ODataModel) {
        this.model = model;
    }
    public async getSuppliers(): Promise<BookEntity[]> {
        const suppliersBinding = this.model.bindList("/Books");
        const suppliersContext = await suppliersBinding.requestContexts();
        return suppliersContext.map(supplierContext => supplierContext.getObject() as BookEntity);
        // const result = await this.odata("/Suppliers").get<SuppliersEntitySet>();
        // return result.data.results;
    }
    
    public async getSuppliersWithFilter(filters: Array<Filter>): Promise<BookEntity[]> {
        const suppliersBinding = this.model.bindList("/Books").filter(filters);
        const suppliersContext = await suppliersBinding.requestContexts();
        return suppliersContext.map(supplierContext => supplierContext.getObject() as BookEntity);
        // return this.odata("/Suppliers").get<SuppliersEntitySet>({ filters: filters });
    }
    public async getSupplierById(id: number): Promise<BookEntity> {
        const supplierBinding = this.model.bindContext(`/Books(${id})`);
        return await supplierBinding.requestObject() as BookEntity;
        // const supplierPath = this.model.createKey("/Suppliers", {
        //     ID: id
        // });
        // return this.odata(supplierPath).get<SuppliersEntity>();
    }
    public async getSupplierNextID(): Promise<number> {
        const suppliersBinding = this.model.bindList("/Books").sort([new Sorter("ID", true)]);
        const suppliersContext = await suppliersBinding.requestContexts(0,1);
        if(suppliersContext.length > 0){
            const supplier = suppliersContext[0].getObject() as BookEntity;
            return ++supplier.ID;
        }
        return 1;
    //     const parameters = { sorters: [new Sorter("ID", true)], urlParameters: { "$top": "1" } };
    //     const response = await this.odata("/Suppliers").get<SuppliersEntitySet>(parameters);
    //     return response.data && response.data.results.length > 0 ? response.data.results[0].ID + 1 : 0;
    }
    public async createSupplier(supplier: BookEntity): Promise<BookEntity> {
        const suppliersBinding = this.model.bindList("/Books");
        const suppliersContext = suppliersBinding.create(supplier);
        const book = await suppliersContext.created() as BookEntity;
        return suppliersContext.getObject() as BookEntity;
        //return this.odata("/Suppliers").post<BookEntity>(supplier);
    }
 }