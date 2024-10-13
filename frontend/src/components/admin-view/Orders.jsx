import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./OrderDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetailsForAdmin } from "@/store/admin/orderSlice";
import { Badge } from "../ui/badge";

function AdminOrdersView () {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const { orderList, orderDetails } = useSelector((state) => state.adminOrder);

    function handleFetchOrderDetails (getId) {
        dispatch(getOrderDetailsForAdmin(getId));
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    },[orderDetails])

    // console.log(orderList,'orderlist for admin');
    // console.log(orderDetails,'order details for admin');

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className='sr-only'>Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0 ? orderList.map((orderItem) => {
                            return <TableRow>
                                <TableCell>{orderItem?._id}</TableCell>
                                <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                <TableCell>
                                    <Badge className={`py-1 px-3 text-center cursor-pointer ${orderItem?.orderStatus === 'confirmed' ? 'bg-green-500' : orderItem?.orderStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>{orderItem?.orderStatus}</Badge>
                                </TableCell>
                                <TableCell>${orderItem?.totalAmount}</TableCell>
                                <TableCell>
                                    <Dialog open={openDetailsDialog} onOpenChange={() => {
                                        setOpenDetailsDialog(false);
                                        dispatch(resetOrderDetailsForAdmin());
                                    }}>
                                        <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>View Details</Button>
                                        <AdminOrderDetailsView orderDetails={orderDetails} />
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        }) : null}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default AdminOrdersView;