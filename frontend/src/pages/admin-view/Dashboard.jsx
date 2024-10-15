import ProductImageUpload from "@/components/admin-view/ImageUpload";
import { Button } from "@/components/ui/button";
import { addFeaturedImages, getFeaturedImages } from "@/store/common/FeaturedSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard () {

    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch = useDispatch();
    const { featuredImageList } = useSelector((state) => state.commonFeature);

    // console.log(uploadedImageUrl,'uploaded image url');

    function handleUploadFeaturedImage () {
        dispatch(addFeaturedImages(uploadedImageUrl)).then((data) => {
            console.log(data, 'image');
            if (data?.payload?.success) {
                dispatch(getFeaturedImages());
                setImageFile(null);
                setUploadedImageUrl('');
            }
        })
    }

    useEffect(() => {
        dispatch(getFeaturedImages());
    }, [dispatch]);

    // console.log(featuredImageList,'list');

    return (
        <div>
            <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} setImageLoadingState={setImageLoadingState} imageLoadingState={imageLoadingState} isCustomStyling={true} /> 
            <Button className='mt-5 w-full' onClick={handleUploadFeaturedImage}>Upload</Button>
            <div className="flex flex-col gap-4 mt-5">
                {featuredImageList && featuredImageList.length > 0 ? featuredImageList.map((featuredImageItem) => {
                    return <div className="relative">
                        <img src={featuredImageItem?.image} alt="feature image" className="w-full h-[300px] object-cover rounded-t-lg"/>
                    </div>
                }):null}
            </div>
        </div>
    )
}

export default AdminDashboard;