import ProductImageUpload from "@/components/admin-view/ImageUpload";
import CommonForm from "@/components/common/Form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { Fragment, useState } from "react";

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

    function onSubmit () {
        
    }

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={()=>setOpenCreateProductsDialog(true)}>Add new product</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>
            <Sheet open={openCreateProductsDialog} onOpenChange={()=>setOpenCreateProductsDialog(false)}>
                <SheetContent side='right' className='overflow-auto'>
                    <SheetHeader>
                        <SheetTitle>Add new Product</SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} setImageLoadingState={setImageLoadingState} />
                    <div className="py-6">
                        <CommonForm formControls={addProductFormElements} formData={formData} setFormData={setFormData} buttonText='Add' onSubmit={onSubmit}/>
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    )
}

export default AdminProducts;