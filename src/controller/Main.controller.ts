import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MessageToast from "sap/m/MessageToast";
import NorthwindService from "../service/NorthwindService";
import Log from "sap/base/Log";
import UI5Event from "sap/ui/base/Event";

/**
 * @namespace be.wl.ODatav4DemoApp.controller
 */
export default class Main extends BaseController {
	private northwindService:NorthwindService;
	public onInit() : void {
		this.northwindService = new NorthwindService(this.getOwnerComponent().getModel() as ODataModel);
		this.getRouter().getRoute("main").attachPatternMatched((event: UI5Event) => this.onObjectMatched(event), this);
		
	}
	
	private onObjectMatched(oEvent: UI5Event): void {
		void this.runActions();
	}
	public sayHello() : void {
		MessageBox.show("Hello World!");
	}
	public async runActions(): Promise<void> {
		const model = (this.getView().getModel("view") as JSONModel);
		const filters = [new Filter("Address/City", FilterOperator.EQ, "Redmond")];
		try {
			const metaModel = (this.getOwnerComponent().getModel() as ODataModel).getMetaModel();
			const meta = metaModel.getMetadata();
			
			try {
				const supplier = await this.northwindService.getSupplierById(1);
				model.setProperty("/progress", 30);
				MessageToast.show("Company name of the first Supplier:" + supplier.Name);
			} catch (error) {
				console.error(error);
				MessageToast.show("Supplier with ID 20 does not exist");
			}
			const suppliersFiltered = await this.northwindService.getSuppliersWithFilter(filters);
			model.setProperty("/progress", 70);
			MessageToast.show(`Suppliers in Redmond: ${suppliersFiltered.length}`);

			const suppliers = await this.northwindService.getSuppliers();
			model.setProperty("/progress", 100);
			this.getView().setModel(new JSONModel({
				Suppliers: suppliers
			}), "nw");
		} catch (error) {
			console.error(error);
			Log.error("This should never have happened");
		}
	}
	public async generateNewSupplier(event:Event): Promise<void> {
		const model = (this.getView().getModel("view") as JSONModel);
		const newSupplier: SuppliersEntity = {
			ID:0,
			Name: `Test ${new Date().getTime()}`,
			Concurrency:1,
			Address: {
				Street: "TestStreet",
				City: "TestCity",
				State: "TestState",
				ZipCode: "TestZip",
				Country: "Belgium"
			}
		};
		try {
			model.setProperty("/progress", 20);
			newSupplier.ID = await this.northwindService.getSupplierNextID();
			model.setProperty("/progress", 40);
			const response = await this.northwindService.createSupplier(newSupplier);
			model.setProperty("/progress", 60);
			MessageToast.show(`Supplier ${response.data.Name} created!`);
		} catch (error) {
			MessageToast.show("Error when creating Suppliers!");
		}
		const response = await this.northwindService.getSuppliers();
		model.setProperty("/progress", 80);
		this.getView().setModel(new JSONModel({
			Suppliers: response.data.results
		}), "nw");
		model.setProperty("/progress", 100);
	}
}
