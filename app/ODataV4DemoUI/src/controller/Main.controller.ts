import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MessageToast from "sap/m/MessageToast";
import BookService, { BookEntity } from "../service/BookService";
import Log from "sap/base/Log";
import UI5Event from "sap/ui/base/Event";

/**
 * @namespace be.wl.ODatav4DemoApp.controller
 */
export default class Main extends BaseController {
	private bookService:BookService;
	public onInit() : void {
		this.bookService = new BookService(this.getOwnerComponent().getModel() as ODataModel);
		this.getRouter().getRoute("main").attachPatternMatched((event: UI5Event) => this.onObjectMatched(event), this);
		this.getView().setModel(new JSONModel({progress:0}),"view");
	}
	
	private onObjectMatched(oEvent: UI5Event): void {
		void this.runActions();
	}
	public sayHello() : void {
		MessageBox.show("Hello World!");
	}
	public async runActions(): Promise<void> {
		const model = (this.getView().getModel("view") as JSONModel);
		const filters = [new Filter("title", FilterOperator.Contains, "Jane")];
		try {
			const metaModel = (this.getOwnerComponent().getModel() as ODataModel).getMetaModel();
			const meta = metaModel.getMetadata();
			
			try {
				const book = await this.bookService.getBookById(1);
				model.setProperty("/progress", 30);
				MessageToast.show("Name of the first Book:" + book.title);
			} catch (error) {
				console.error(error);
				MessageToast.show("Book with ID 20 does not exist");
			}
			const booksFiltered = await this.bookService.getBooksWithFilter(filters);
			model.setProperty("/progress", 70);
			MessageToast.show(`Books in Redmond: ${booksFiltered.length}`);

			const books = await this.bookService.getBooks();
			model.setProperty("/progress", 100);
			this.getView().setModel(new JSONModel({
				Books: books
			}), "nw");
		} catch (error) {
			console.error(error);
			Log.error("This should never have happened");
		}
	}
	public async generateNewBook(event:Event): Promise<void> {
		const model = (this.getView().getModel("view") as JSONModel);
		const newBook: BookEntity = {
			ID:0,
			title: `Test ${new Date().getTime()}`,
			stock:1
		};
		try {
			model.setProperty("/progress", 20);
			newBook.ID = await this.bookService.getBooksNextID();
			model.setProperty("/progress", 40);
			const response = await this.bookService.createBook(newBook);
			model.setProperty("/progress", 60);
			MessageToast.show(`Book ${response.title} created!`);
		} catch (error) {
			MessageToast.show("Error when creating new book!");
		}
		const books = await this.bookService.getBooks();
		model.setProperty("/progress", 80);
		this.getView().setModel(new JSONModel({
			Books: books
		}), "nw");
		model.setProperty("/progress", 100);
	}
}
