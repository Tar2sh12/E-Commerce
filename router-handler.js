
import { json } from "express";
import cors from "cors";
import * as routers from "./src/modules/index.js";
import { globaleResponse } from "./src/middleware/index.js";
import { createHandler } from 'graphql-http/lib/use/express';

import {mainSchema} from './src/GraphQL/Schema/index.js'
export const routerHandler = (app)=>{
    app.use(json());
    app.use(cors());


    //GraphQL
    app.use('/graphql', createHandler({schema:mainSchema}))

    app.use("/categories", routers.categoryRouter);
    app.use("/sub-categories", routers.subCategoryRouter);
    app.use("/brands", routers.brandRouter);
    app.use("/products", routers.productRouter);
    app.use("/users", routers.UserRouter);
    app.use("/addresses", routers.addressRouter);
    app.use("/carts", routers.cartRouter);
    app.use("/coupons", routers.couponRouter);
    app.use("/orders", routers.orderRouter);
    app.use("/reviews", routers.reviewRouter);
    app.use("*", (req, res) => {
      res.status(404).json({ msg: "Not found", status: 404 });
    });
    app.use(globaleResponse);
}