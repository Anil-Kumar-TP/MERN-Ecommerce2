import ProductFilter from "@/components/shopping-view/Filter";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/productsSlice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

/**
 * Creates a URL query string from a given object of filter parameters.
 * If a filter parameter value is an array, it will be joined with a comma and
 * URL encoded. If the array is empty, the parameter will be omitted from the
 * query string.
 * @param {Object} filterParams - An object of filter parameters with string keys
 * and string or string array values.
 * @returns {string} A URL query string of the given filter parameters.
 */
function createSearchParamsHelper (filterParams) {
    const queryParams = [];
    for(const[key,value] of Object.entries(filterParams)) {
        if(Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',');
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }
    return queryParams.join('&');
}


function ShoppingListing () {

    const dispatch = useDispatch();
    const { productList, productDetails } = useSelector((state) => state.shopProducts);
    const { user } = useSelector((state) => state.auth);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { toast } = useToast();

    const categorySearchParam = searchParams.get('category');

    function handleSort (value) {
        setSort(value);
    }

    function handleFilter (getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId); // check if category/brand is present
        if (indexOfCurrentSection === -1) {
            cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption] }
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
            if (indexOfCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOption);
            else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }

        setFilters(cpyFilters);
        sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
    }

    function handleGetProductDetails (getCurrentProductId) {
        console.log(getCurrentProductId);
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    function handleAddToCart (getCurrentProductId){
        console.log(getCurrentProductId, 'addtocart'); // id and not _id bcz it is changed in login controller
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({title:'product added to cart'})
            }
        })
    }

    useEffect(() => { // default value on page reload . 
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {}); // fetch the set values from sessionStorage
    }, [categorySearchParam]);

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const createQueryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString))
        }
    }, [filters]);

    useEffect(() => {
        if(filters !== null && sort !== null) dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }, [dispatch, sort, filters]);
    
    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    },[productDetails])

    console.log(productDetails);
    // console.log(cartItems,'cartitems');

    return (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
            <div className="w-full rounded-lg shadow-sm bg-background">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Products</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{productList?.length} Products</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' size='sm' className='flex items-center gap-1'>
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span>Sort by</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-[200px]'>
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {sortOptions.map((sortItem) => {
                                        return <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    })}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
                    {productList && productList.length > 0 ? (
                        productList.map((productItem) => {
                            return <ShoppingProductTile product={productItem} key={productItem._id} handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddToCart}/>
                        })
                    ) : (
                        null
                    )}
                </div>
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}/>
        </div>
    );
};

export default ShoppingListing;