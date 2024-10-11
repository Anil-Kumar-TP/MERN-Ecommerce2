import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/Form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/shop/addressSlice";
import AddressCard from "./AddressCard";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
};

function Address () {

    const [formData, setFormData] = useState(initialAddressFormData);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { addressList } = useSelector((state) => state.shopAddress);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const { toast } = useToast();

    function handleManageAddress (e) {
        e.preventDefault();

        if (addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialAddressFormData);
            toast({ title: 'you can add only 3 address', variant: 'destructive' });
            return;
        }

        currentEditedId !== null ? dispatch(editAddress({ userId: user?.id, addressId: currentEditedId, formData })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddress(user?.id));
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);
                toast({ title: 'address updated successfully' });
            }
        }):
        dispatch(addNewAddress({ ...formData, userId: user?.id })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddress(user?.id))
                setFormData(initialAddressFormData);
                toast({ title: 'address added successfully' });
            }
        })
    };

    function handleDeleteAddress (getCurrentAddress) {
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddress(user?.id));
                toast({ title: 'address deleted successfully' });
            }
        })
    };

    function handleEditAddress (getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes
        });
    };

    function isFormValid () {
        return Object.keys(formData).map(key => formData[key].trim() !== '').every(item => item);
    };

    useEffect(() => {
        dispatch(fetchAllAddress(user?.id));
    }, [dispatch]);

    // console.log(addressList,'addresslist');

    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
                {addressList && addressList.length > 0 ? addressList.map((singleAddressItem) => {
                    return <AddressCard addressInfo={singleAddressItem} handleDeleteAddress={handleDeleteAddress} handleEditAddress={handleEditAddress} />
                }) : null}
            </div>
            <CardHeader>
                <CardTitle>{currentEditedId !== null ? 'Edit address' : "Add new address"}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <CommonForm formControls={addressFormControls} formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? 'Edit' : 'Add'} onSubmit={handleManageAddress} isBtnDisabled={!isFormValid()} />
            </CardContent>
        </Card>
    );
};

export default Address;