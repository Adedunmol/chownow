
export interface CustomerPayload {
    sub: number,
    username: string,
    iat: number,
    exp: number,
    role: string,
}

export interface RestaurantPayload {
    sub: number,
    restaurant_name: string,
    iat: number,
    exp: number,
    role: string,
}

export interface DriverPayload {
    sub: number,
    username: string,
    iat: number,
    exp: number,
    role: string,
}