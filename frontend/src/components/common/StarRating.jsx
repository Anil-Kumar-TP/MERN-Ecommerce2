import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent ({rating,handleRatingChange}) {
    return (
        [1, 2, 3, 4, 5].map((star) => {
            return <Button onClick={handleRatingChange ? ()=>handleRatingChange(star) : null} variant='outline' size='icon' className={`p-2 rounded-full transition-colors ${star <= rating ? 'text-yellow-500 hover:bg-black' :'text-black hover:bg-primary hover:text-primary-foreground' }`}>
                <StarIcon className={`h-6 w-6 ${star <= rating ? 'fill-yellow-500' : 'fill-black'}`} />
            </Button>
        })
    )
}

export default StarRatingComponent;