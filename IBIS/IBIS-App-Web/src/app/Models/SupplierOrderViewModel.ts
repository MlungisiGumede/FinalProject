import { SupplierOrder } from "./SupplierOrder"
import { SupplierOrderLine } from "./SupplierOrderLine"

export class SupplierOrderViewModel{
    public supplierOrder!:SupplierOrder
    public supplierOrderLines:SupplierOrderLine[] = []
}