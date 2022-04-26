import Filter from "sap/ui/model/Filter";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
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
 export default class BookService{
    private model:ODataModel;
    private bookBinding:ODataListBinding;
    constructor(model: ODataModel) {
        this.model = model;
        this.bookBinding = this.model.bindList("/Books",null,[],[],{$$getKeepAliveContext:true});
    }
    public async getBooks(): Promise<BookEntity[]> {
        const booksContext = await this.bookBinding.requestContexts();
        return booksContext.map(bookContext => bookContext.getObject() as BookEntity);
        // const result = await this.odata("/Suppliers").get<SuppliersEntitySet>();
        // return result.data.results;
    }
    
    public async getBooksWithFilter(filters: Array<Filter>): Promise<BookEntity[]> {
        const bookBinding = this.model.bindList("/Books").filter(filters);//use new listbinding instance - otherwise not all books will be in the list
        const booksContext = await bookBinding.requestContexts();
        return booksContext.map(bookContext => bookContext.getObject() as BookEntity);
        // return this.odata("/Suppliers").get<SuppliersEntitySet>({ filters: filters });
    }
    public async getBookById(id: number): Promise<BookEntity> {
        // const bookBinding = this.model.bindContext(`/Books(${id})`);
        const bookBinding = this.model.getKeepAliveContext(`/Books(${id})`);
        return await bookBinding.requestObject() as BookEntity;
        // const supplierPath = this.model.createKey("/Suppliers", {
        //     ID: id
        // });
        // return this.odata(supplierPath).get<SuppliersEntity>();
    }
    public async getBooksNextID(): Promise<number> {
        const bookBinding = this.bookBinding.sort([new Sorter("ID", true)]);
        const bookContext = await bookBinding.requestContexts(0,1);
        if(bookContext.length > 0){
            const book = bookContext[0].getObject() as BookEntity;
            return ++book.ID;
        }
        return 1;
    //     const parameters = { sorters: [new Sorter("ID", true)], urlParameters: { "$top": "1" } };
    //     const response = await this.odata("/Suppliers").get<SuppliersEntitySet>(parameters);
    //     return response.data && response.data.results.length > 0 ? response.data.results[0].ID + 1 : 0;
    }
    public async createBook(book: BookEntity): Promise<BookEntity> {
        const bookContext = this.bookBinding.create(book);
        await bookContext.created() as BookEntity;
        return bookContext.getObject() as BookEntity;
        //return this.odata("/Suppliers").post<BookEntity>(supplier);
    }
    
    public async deleteLatestBook(): Promise<boolean> {
        const bookBinding = this.bookBinding.sort([new Sorter("ID", true)]);
        const bookContext = await bookBinding.requestContexts(0,1);
        const deletedBook = await bookContext[0].delete();
        return !deletedBook;
        // const supplierPath = this.model.createKey("/Suppliers", {
        //     ID: id
        // });
        // return this.odata(supplierPath).get<SuppliersEntity>();
    }
 }