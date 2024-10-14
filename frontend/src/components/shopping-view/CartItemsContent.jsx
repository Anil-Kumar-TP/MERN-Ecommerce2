import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cartSlice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent ({ cartItem }) {

    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { productList } = useSelector((state) => state.shopProducts);
    
    function handleCartItemDelete (getCartItem) {
        console.log(getCartItem); // cartItem is a single product and it has productId
        dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })).then((data) => {
            if (data?.payload?.success) {
                toast({ title: 'item deleted' });
            }
        })
    }

    function handleUpdateQuantity (getCartItem, typeOfAction) {
        if (typeOfAction === 'plus') {
            let getCartItems = cartItems.items || [];
            if (getCartItems.length) {
                const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === getCartItem?.productId);
                const getCurrentProductIndex = productList.findIndex(product => product._id === getCartItem?.productId);
                const getTotalStock = productList[getCurrentProductIndex].totalStock;
                if (indexOfCurrentCartItem > -1) {
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                    if (getQuantity + 1 > getTotalStock) {
                        toast({ title: `only ${getQuantity} quantity can be added for this item`, variant: 'destructive' })
                        return;
                    }
                }
            }
        }
        dispatch(updateCartQuantity({ userId: user?.id, productId: getCartItem.productId, quantity: typeOfAction === 'plus' ? getCartItem?.quantity + 1 : getCartItem.quantity - 1 })).then((data) => {
            if (data?.payload?.success) {
                toast({ title: 'item updated' });
            }
        })
    }

    return (
        <div className="flex items-center space-x-4">
            <img src={cartItem?.image} alt="cart item image" className="w-20 h-20 rounded object-cover" />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem?.title}</h3>
                <div className="flex items-center mt-1 gap-2">
                    <Button onClick={()=>handleUpdateQuantity(cartItem,'minus')} variant='outline' size='icon' className='h-8 w-8 rounded-full' disabled={cartItem?.quantity === 1}>
                        <Minus className="w-4 h-4"/>
                        <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="font-semibold">{cartItem?.quantity}</span>
                    <Button onClick={()=>handleUpdateQuantity(cartItem,'plus')} variant='outline' size='icon' className='h-8 w-8 rounded-full'>
                        <Plus className="w-4 h-4"/>
                        <span className="sr-only">Decrease</span>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}</p>
                <Trash2 onClick={()=>handleCartItemDelete(cartItem)} className="cursor-pointer mt-1" size={20}/>
            </div>
        </div>
    )
}

export default UserCartItemsContent;