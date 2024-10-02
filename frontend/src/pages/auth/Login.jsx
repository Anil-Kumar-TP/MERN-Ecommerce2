import CommonForm from "@/components/common/Form";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { Link } from "react-router-dom";

const initialState = {
    email: '',
    password: ''
}

function AuthLogin () {
    const [formData, setFormData] = useState(initialState);

    function onSubmit () {

    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
                <p className="mt-2">
                    Don't have an account?
                    <Link to='/auth/register' className="font-medium text-primary ml-2 hover:underline">Register</Link>
                </p>
            </div>
            <CommonForm formControls={loginFormControls} buttonText={'Sign In'} formData={formData} setFormData={setFormData} onSubmit={onSubmit} />
        </div>
    )
}

export default AuthLogin;