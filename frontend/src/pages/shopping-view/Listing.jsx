import ProductFilter from "@/components/shopping-view/Filter";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { fetchAllFilteredProducts } from "@/store/shop/productsSlice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ShoppingListing () {

    const dispatch = useDispatch();
    const { productList } = useSelector((state) => state.shopProducts);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);

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

    useEffect(() => { // default value on page reload . 
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {}); // fetch the set values from sessionStorage
    }, []);

    useEffect(() => {
        dispatch(fetchAllFilteredProducts());
    }, [dispatch]);

    console.log(filters, 'filters');

    return (
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
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
                            return <ShoppingProductTile product={productItem} key={productItem._id} />
                        })
                    ) : (
                        null
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoppingListing;