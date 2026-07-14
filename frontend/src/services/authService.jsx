/*
Will contain the API call functions
*/

export function loginUser(username, password){
    if(username === "user" && password === "ADMIN"){
        return {username: "user", role: "ADMIN"};
    }
    return null;
}