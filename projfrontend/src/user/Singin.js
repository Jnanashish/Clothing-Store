import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, isAuthenticated, authenticate } from "../auth/helper/index"

const Signup = () => {
    // state of form
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        didRedirect: false
    });

    const { email, password, error, loading, didRedirect } = values;
    const { user } = isAuthenticated();

    // higher order function
    const handleChange = (name) => (event) => {
        setValues({...values, error: false, [name]: event.target.value});
    };

    // when submit is clicked
    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });

        // function from api call
        signin({ email, password })
        .then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: true });
            } else {
		        authenticate(data, () => {
			        setValues({
			            ...values,
			            didRedirect: true
			        });
		        });
            }
        })
        .catch(console.log("Sign in request failed"));
    };

    // sign up form for existing user
    const signInForm = () => {
        return (
        <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
            <form>
                <div className="form-group">
                    <label className="text-light">Email</label>
                    <input
                        className="form-control"
                        onChange={handleChange("email")}
                        type="email"
                        value={email}
                    />
                </div>
                <div className="form-group">
                    <label className="text-light">Password</label>
                    <input
                        onChange={handleChange("password")}
                        className="form-control"
                        type="password"
                        value={password}
                    />
                </div>
                <button onClick={onSubmit} className="btn btn-success btn-block">
                    Submit
                </button>
            </form>
            </div>
        </div>
    );
    };

    const performRedirect = () => {
	    //TODO: do a redirect here
	    if (didRedirect) {
	        if (user && user.role === 1) {
		        return <p>redirect to admin</p>;
	        } else {
		        return <p>redirect to user dashboard</p>;
	        }
	    }
	    if (isAuthenticated()) {
	        return <Redirect to="/" />;
	    }
    };

    const loadingMessage = () => {
        return (
	        loading && (
		        <div className="alert alert-info">
		            <h2>Loading...</h2>
		        </div>
	        )
        );
    };
    
    const errorMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger"
                        style={{ display: error ? "" : "none" }}
                    > {error} </div>
                </div>
            </div>
        );
    };

return (
    <Base title="Sign up page" description="A page for user to sign up!">
        {loadingMessage()}
        {errorMessage()}
        {signInForm()}
        {performRedirect()}
        <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signup;
