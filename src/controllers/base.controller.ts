import { Router } from "express";
import { wrap } from "async-middleware";
abstract class BaseController {
  public router = Router();
  constructor() {
    this.initRoutes(this.router);
  }
  abstract initRoutes(router: Router): void;
  public handler(func: any): any {
    return wrap(func);
  }
}

export default BaseController;
