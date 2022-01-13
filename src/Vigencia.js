function check(axios, location, navigate) {
    const token = localStorage.getItem('TOKEN_PROYECTO');

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    
    const bodyParameters = {
        key: "value"
    };

    axios.post(
        "http://localhost:4000/api/usuario/vigencia",
        bodyParameters,
        config
    )
    .then(
        (response) => {
            if (response.status === 200 && location.pathname === '/admin') {
                navigate('/admin/horario', { replace: true });
            }
        }            
    )
    .catch((err) => {
        if (err.response) {
            if (err.response.status === 401) {
                localStorage.removeItem('TOKEN_PROYECTO');
                if (location.pathname !== '/admin') {
                    navigate('/admin', { replace: true });
                }
            }
        }
        else if (err.request) {
            // client never received a response, or request never left
        } 
        else {
            // anything else
        }
    });

    return true;
}

module.exports = {
    check
};
