import BaseController from "./BaseController";

/**
 * @namespace be.wl.ODatav4DemoApp.controller
 */
export default class App extends BaseController {

	public onInit() : void {
		// apply content density mode to root view
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
	}

}
