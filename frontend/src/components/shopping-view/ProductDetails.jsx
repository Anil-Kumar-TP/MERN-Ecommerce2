import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/productsSlice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/StarRating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/reviewSlice";

function ProductDetailsDialog ({ open, setOpen, productDetails }) {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);

    const { toast } = useToast();

    const [reviewMsg, setReviewMsg] = useState('');
    const [rating, setRating] = useState(0);
    const { reviews } = useSelector((state) => state.shopReview);

    function handleRatingChange (getRating) {
        setRating(getRating);
    }

    function handleAddReview () {
        dispatch(addReview({ productId: productDetails?._id, userId: user?.id, userName: user?.userName, reviewMessage: reviewMsg, reviewValue: rating })).then((data) => {
            if (data?.payload?.success) {
                setRating(0)
                setReviewMsg('');
                dispatch(getReviews(productDetails?._id));
                toast({ title: 'review added successfully' });
            }
        })
    }

    function handleAddToCart (getCurrentProductId,getTotalStock) {
        console.log(getCurrentProductId, 'addtocart'); // id and not _id bcz it is changed in login controller
        let getCartItems = cartItems.items || [];
        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId);
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast({ title: `only ${getQuantity} quantity can be added for this item`, variant: 'destructive' })
                    return;
                }
            }
        }
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({ title: 'product added to cart' })
            }
        })
    }

    function handleDialogClose () {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg('');
    }

    useEffect(() => {
        if (productDetails !== null) dispatch(getReviews(productDetails?._id));
    }, [productDetails]);

    const averageReview = reviews && reviews.length > 0 ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length : 0;


    // console.log(reviews,'reviews');

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]'>
                <div className="relative overflow-hidden rounded-lg">
                    <img src={productDetails?.image} alt="detail image" width={600} height={600} className="aspect-square w-full object-cover" />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">{productDetails?.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={`${productDetails?.salePrice > 0 ? 'line-through' : ''} text-3xl font-bold text-primary`}>${productDetails?.price}</p>
                        {productDetails?.salePrice > 0 && <p className="text-2xl font-bold text-muted-foreground">${productDetails?.salePrice}</p>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={averageReview}/>
                        </div>
                        <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
                    </div>
                    <div className="mt-5 mb-5">
                        {productDetails?.totalStock === 0 ? (
                            <Button className='w-full cursor-not-allowed opacity-60'>Out of Stock</Button>
                        ): (
                            <Button className = 'w-full' onClick = {()=> handleAddToCart(productDetails?._id,productDetails?.totalStock)}>Add to cart</Button>     
                        )}
                        
                    </div>
                    <Separator />
                    <div className="max-h-[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <div className="grid gap-6">
                            {reviews && reviews.length > 0 ? reviews.map((reviewItem) => {
                                return <div className="flex gap-4">
                                    <Avatar className='w-10 h-10 border'>
                                        <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold">{reviewItem?.userName}</h3>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                           <StarRatingComponent rating={reviewItem?.reviewValue}/>
                                        </div>
                                        <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                                    </div>
                                </div>
                            }):<h1>No reviews</h1>}
                           
                        </div>
                        <div className="flex mt-10 gap-2 flex-col">
                            <Label>write a review...</Label>
                            <div className="flex gap-1">
                                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange}/>
                            </div>
                            <Input placeholder='leave a review' name='reviewMsg' value={reviewMsg} onChange={(e)=>setReviewMsg(e.target.value)} />
                            <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ''}>Submit</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog;