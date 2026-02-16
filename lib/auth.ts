// Set login cookie
export function setLoginCookie(data: any) {
    localStorage.setItem('user', JSON.stringify(data));
}

// Get login cookie
export function getLoginCookie() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Remove login cookie
export function removeLoginCookie() {
    localStorage.removeItem('user');
}

// Check if user is logged in
export function isLoggedIn() {
    return !!getLoginCookie();
}

// Add wishlist count
// export function addWishlistCount(action: string = 'add') {
//     const current_count: any = localStorage.getItem('wishlist_count') || 0;
//     localStorage.setItem('wishlist_count', current_count);

//     // Update count for div class
//     const wishlist_count_div = document.getElementById('wishlist_count');
//     if (wishlist_count_div) {
//         wishlist_count_div.textContent = current_count.toString();
//     }
// }

// Find tour exist in wishlist
export function findTourInWishlist(tour_id: number) {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist).includes(tour_id) : false;
}

// Update header count
export function updateHeaderWishlistCount() {
    // Get wishlist from local storage
    const wishlist = localStorage.getItem('wishlist');

    // Update count for div class
    const wishlist_count_div = document.getElementById('wishlist_count');

    // Update count
    if (wishlist_count_div) {
        wishlist_count_div.textContent = wishlist ? JSON.parse(wishlist).length.toString() : '0';
    }
}

// Get wishlist count
export function getWishlistCount() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist).length : 0;
}

// Add cart data
export function addCartData(cart_id: string) {
    localStorage.setItem('cart_id', cart_id);
}

// Get cart data
export function getCartData() {
    return localStorage.getItem('cart_id');
}

// Delete cart data
export function deleteCartData() {
    localStorage.removeItem('cart_id');
}