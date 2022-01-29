import {API} from "../../backend";

// Sign up method
export const signup = user =>{
    return fetch(`${API}/signup`, {
        method : "POST",
        headers : {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body : JSON.stringify(user)
    }) 
    .then(response => {
        return response.json();
    }).catch(err => console.log(err));
}

// Sign in method
export const signin = user =>{
    return fetch(`${API}/signin`, {
        method : "POST",
        headers : {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body : JSON.stringify(user)
    }) 
    .then(response => {
        return response.json();
    }).catch(err => console.log(err));
}

// set a token in localstorage during signin to authenticate user 
export const authenticate = (data, next) =>{
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(data))
        next();
    }
}

// Sign out method
// remove the token from localstorage
export const signout = next =>{
    if(typeof window !== "undefined"){
        localStorage.removeItem("jwt")
        next();

        // signout user from backend also
        return fetch(`${API}/signout`, {
            method : "GET",
        })
        .then(response => console.log("Signout success"))
        .catch(err => console.log(err))
    }    
}

// check if user is authenticated or not
export const isAuthenticated = () =>{
    if(typeof window === "undefined"){
        return false
    } 
    // return jwt values
    if(localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"))
    } 
    else {
        return false;
    }
}