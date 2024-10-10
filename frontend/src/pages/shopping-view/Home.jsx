import { Button } from '@/components/ui/button';
import bannerOne from '../../assets/banner-1.webp'
import bannerTwo from '../../assets/banner-2.webp'
import bannerThree from '../../assets/banner-3.webp'
import { BabyIcon, CandyCane, Cat, Check, ChevronLeft, ChevronRight, CloudLightning, Footprints, Milk, Radiation, Shirt, ShirtIcon, WatchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/productsSlice';
import ShoppingProductTile from '@/components/shopping-view/ProductTile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cartSlice';
import { useToast } from '@/hooks/use-toast';
import ProductDetailsDialog from '@/components/shopping-view/ProductDetails';

const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: Footprints },
];

const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Check  },
    { id: "adidas", label: "Adidas", icon: Radiation  },
    { id: "puma", label: "Puma", icon: Cat },
    { id: "levi", label: "Levi's", icon: Shirt },
    { id: "zara", label: "Zara", icon: Milk  },
    { id: "h&m", label: "H&M", icon: CandyCane  },
]

function ShoppingHome () {

    const [currentSlide, setCurrentSlide] = useState(0);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { productList,productDetails } = useSelector((state) => state.shopProducts);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const slides = [bannerOne, bannerTwo, bannerThree];

    function handleNavigateToListingPage (getCurrentItem,section) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
            [section]:[getCurrentItem.id] // category:men,category:women,brand:adidas
        }
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate('/shop/listing');
    }

    function handleGetProductDetails (getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    function handleAddToCart (getCurrentProductId) {
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({ title: 'product added to cart' })
            }
        })
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
        }, 5000)
        
        return () => clearInterval(timer)
    }, []);

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    }, [dispatch]);

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails])

    // console.log(productList,'product list home page');

    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                {slides.map((slide, index) => {
                    return <img src={slide} alt="slide" key={index} className={`${index === currentSlide ? 'opacity-100' :'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`} />
                })}
                <Button variant='outline' size='icon' className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80' onClick={()=>setCurrentSlide(prevSlide=>(prevSlide - 1 + slides.length) % slides.length)}>
                    <ChevronLeft className='w-4 h-4'/>
                </Button>
                <Button variant='outline' size='icon' className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80' onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)}>
                    <ChevronRight className='w-4 h-4'/> 
                </Button>
            </div>

            <section className='py-12 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-8'>Shop by category</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {categoriesWithIcon.map((categoryItem) => {
                            return <Card onClick={() => handleNavigateToListingPage(categoryItem,'category')} key={categoryItem.id} className='cursor-pointer hover:shadow-lg transition-shadow'>
                                <CardContent className='flex flex-col items-center justify-center p-6'>
                                    <categoryItem.icon />
                                    <span className='font-bold'>{categoryItem.label}</span>
                                </CardContent>
                            </Card>
                        })}
                    </div>
                </div>  
            </section>

            <section className='py-12 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-8'>Shop by brands</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                        {brandsWithIcon.map((brandItem) => {
                            return <Card onClick={() => handleNavigateToListingPage(brandItem, 'brand')} key={brandItem.id} className='cursor-pointer hover:shadow-lg transition-shadow'>
                                <CardContent className='flex flex-col items-center justify-center p-6'>
                                    <brandItem.icon />
                                    <span className='font-bold'>{brandItem.label}</span>
                                </CardContent>
                            </Card>
                        })}
                    </div>
                </div>  
            </section>

            <section className='py-12'>
                <div className='container mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-8'>Featured Products</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer'>
                        {productList && productList.length > 0 ? productList.map((productItem) => {
                            return <ShoppingProductTile product={productItem} handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddToCart}/>
                        }):null}
                    </div>
                </div>
            </section>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}
 
export default ShoppingHome;