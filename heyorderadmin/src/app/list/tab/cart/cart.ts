export class Cart {
    constructor(
        public itemKey?: string,
        public categoryKey?: string,
        public name?: string,
        public type?: string,
        public price?: number,
        public img?: string,
        public uid?: string,
      public qty?: string,
      public selectedOptions?: string,
      public selectedSize?: string
    ) { }
}
