import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  // Define your OAuth 2.0 details
const client_id = '"498545015992-st7jbs4etps3j8hhho4r9a87i69vcbfu.apps.googleusercontent.com"';
const client_secret = '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';
const redirect_uri = 'http://localhost:5000/auth/google/callback';
const authorization_code = 'authorization_code_received_from_login';

// Token endpoint
const tokenEndpoint = 'https://accounts.google.com/o/oauth2/token';

fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        code: authorization_code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    })
})
.then(response => response.json())
.then(data => {
    const accessToken = data.access_token;
    console.log('Access Token:', accessToken);
})
.catch(error => {
    console.error('Error fetching access token:', error);
});

};

export {GoogleCallback};