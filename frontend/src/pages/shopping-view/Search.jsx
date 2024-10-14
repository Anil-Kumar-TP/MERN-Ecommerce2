import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { fetchProductDetails } from "@/store/shop/productsSlice";
import { getSearchResults, resetSearchResults } from "@/store/shop/searchSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts () {

    const [keyword, setKeyword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchResults } = useSelector((state) => state.shopSearch);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { productDetails } = useSelector((state) => state.shopProducts);

    useEffect(() => {
        if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(getSearchResults(keyword));
            }, 1000);
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(resetSearchResults());
        }
    }, [keyword]);

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails])


    function handleAddToCart (getCurrentProductId, getTotalStock) {
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

    function handleGetProductDetails (getCurrentProductId) {
        console.log(getCurrentProductId);
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    // console.log(searchResults , 'searchResults');

    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full items-center flex">
                    <Input placeholder='Search...' className='py-6' value={keyword} name='keyword' onChange={(e)=>setKeyword(e.target.value)} />
                </div>
            </div>
            {!searchResults.length ? (
                <h1 className="text-5xl font-extrabold">No Product found</h1>
            ):null}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                { searchResults.map((item) => {
                    return <ShoppingProductTile product={item} handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails}/>
                })}
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}

export default SearchProducts;