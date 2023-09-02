import { CustomerOrder } from "./CustomerOrder";
import { CustomerOrderLine } from "./CustomerOrderLine";

export class CustomerOrderViewModel{
    public customerOrder!:CustomerOrder
    public customerOrderLines:CustomerOrderLine[] = []
}