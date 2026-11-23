const {supabase, createUserClient} = require("../config/database");

const signup = async (userData) => {
    const { full_name, email, password, phone_number, role} = userData;

    const { data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name,
                phone_number,
                role
            }
        }
    });

    if(error){
        throw error;
    }

    return data;
};

const login = async (userData) => {
    const { email, password} = userData;

    const { data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(error){
        throw error;
    }

    return data;
};

const getUserProfile = async (userId, accessToken) => {

    const userSupabase = createUserClient(accessToken);

    const { data, error} = await userSupabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();

    if(error){
        throw error;
    }

    return data;
}
module.exports = {
    signup,
    login,
    getUserProfile
}
