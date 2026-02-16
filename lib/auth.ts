// Set login cookie
export function setLoginCookie(data: any) {
    localStorage.setItem('agent', JSON.stringify(data));
}

// Get login cookie
export function getLoginCookie() {
    const user = localStorage.getItem('agent');
    return user ? JSON.parse(user) : null;
}

// Remove login cookie
export function removeLoginCookie() {
    localStorage.removeItem('agent');
}

// Check if user is logged in
export function isLoggedIn() {
    return !!getLoginCookie();
}