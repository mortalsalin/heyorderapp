export class Push {
    constructor(
    public name?: string,
    public title?: string,
    public text?: boolean,
    public landingTitle?: string,
    public landingText?: string,
    public createdDate?: any,
    public updatedDate?: any,
    public runStartDate?: any,
    public runEndDate?: any,
    public $key?: string
    ) {  }
}

export class PushViewModel {
  public name?: string;
  public title?: string;
  public text?: boolean;
  public landingTitle?: string;
  public landingText?: string;
  public createdDate?: any;
  public updatedDate?: any;
  public runStartDate?: any;
  public runEndDate?: any;
  public $key?: string;
  constructor(model: Push) {
      this.name          = model.name        
      this.title         = model.title       
      this.text          = model.text        
      this.landingTitle  = model.landingTitle
      this.landingText   = model.landingText 
      this.createdDate   = model.createdDate 
      this.updatedDate   = model.updatedDate 
      this.runStartDate  = model.runStartDate
      this.runEndDate    = model.runEndDate  
      this.$key          = model.$key        
  }
}
