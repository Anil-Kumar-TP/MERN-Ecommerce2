import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard ({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress,selectedId }) {
    return (
        <Card onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null} className={`cursor-pointer ${selectedId?._id === addressInfo?._id ? 'border-red-600 border-[4px]' :'border-black'}`}>
            <CardContent className={`grid gap-4 p-4 ${selectedId === addressInfo?._id ? 'border-black' :''}`}>
                <Label>Address: {addressInfo?.address}</Label>
                <Label>City: {addressInfo?.city}</Label>
                <Label>Pincode: {addressInfo?.pincode}</Label>
                <Label>Phone: {addressInfo?.phone}</Label>
                <Label>Notes: {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className='flex justify-between p-3'>
                <Button onClick={()=>handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={()=>handleDeleteAddress(addressInfo)}>Delete</Button>
            </CardFooter>
        </Card>
    )
}

export default AddressCard;