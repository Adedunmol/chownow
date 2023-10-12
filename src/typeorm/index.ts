import { Address } from './Address';
// import { Country } from './Country';
import { Customer } from './Customer';
import { CustomerAddress } from './Customer_Address';
import { DeliveryDriver } from './Delivery_Driver';
import { FoodOrder } from './Food_Order';
import { MenuItem } from './Menu_Item';
import { OrderMenuItem } from './Order_Menu_Item';
import { OrderStatus } from './Order_Status';
import { Restaurant } from './Restaurant';
const entities = [Customer, FoodOrder, Address, CustomerAddress, DeliveryDriver, MenuItem, OrderMenuItem, OrderStatus, Restaurant];

export { Customer, FoodOrder, Address, CustomerAddress, DeliveryDriver, MenuItem, OrderMenuItem, OrderStatus, Restaurant };

export default entities;