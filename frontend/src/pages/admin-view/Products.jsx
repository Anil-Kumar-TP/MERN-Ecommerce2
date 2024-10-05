import ProductImageUpload from "@/components/admin-view/ImageUpload";
import AdminProductTile from "@/components/admin-view/ProductTile";
import CommonForm from "@/components/common/Form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/productsSlice";
import { data } from "autoprefixer";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: ''
};

function AdminProducts () {

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const { productList } = useSelector((state) => state.adminProducts);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function onSubmit (e) {  // formData was a part of commonForm and image is added with it
        e.preventDefault();
        currentEditedId !== null ? dispatch(editProduct({ id: currentEditedId, formData })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
                setFormData(initialFormData);
                setOpenCreateProductsDialog(false);
                setCurrentEditedId(null);
            }
        }) :
        dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
                setOpenCreateProductsDialog(false);
                setImageFile(null);
                setFormData(initialFormData);
                toast({ title: 'product added successfully' });
            }
        })
    }

    function handleDelete (getCurrentProductId) {
        dispatch(deleteProduct(getCurrentProductId)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
            }
        })
    }

    function isFormValid () {
        return Object.keys(formData)
            .map((key) => formData[key] !== "")
            .every((item) => item);
    }


    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    console.log(productList, 'productlist');

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductsDialog(true)}>Add new product</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {productList && productList.length > 0 ? productList.map((productItem) => {
                    return <AdminProductTile key={productItem._id} product={productItem} setCurrentEditedId={setCurrentEditedId} setOpenCreateProductsDialog={setOpenCreateProductsDialog} setFormData={setFormData} handleDelete={handleDelete} />
                }) : null}
            </div>
            <Sheet open={openCreateProductsDialog} onOpenChange={() => {
                setOpenCreateProductsDialog(false);
                setCurrentEditedId(null);
                setFormData(initialFormData);
            }}>
                <SheetContent side='right' className='overflow-auto'>
                    <SheetHeader>
                        <SheetTitle>{currentEditedId !== null ? 'Edit Product' :'Add new Product'}</SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} setImageLoadingState={setImageLoadingState} imageLoadingState={imageLoadingState} isEditMode={currentEditedId !== null} />
                    <div className="py-6">
                        <CommonForm formControls={addProductFormElements} formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? 'Edit' : 'Add'} onSubmit={onSubmit} isBtnDisabled={!isFormValid()} />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    )
}

export default AdminProducts;