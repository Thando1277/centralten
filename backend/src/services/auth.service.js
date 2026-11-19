const supabase = require("../config/database");

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

module.exports = {
    signup
}
