export interface ICookieData {
    token?: string
    userAD?: string
    userLis?: string
    email?: string
    roleid?: string
    success?: true
}

export type KeyCookieData = 'user' | 'token'

export const BROWSER = [
    {
        browser: 'Chrome',
        support: 'ตั้งแต่เวอร์ชั่น 70 ขึ้นไป'
    },
    {
        browser: 'Safari',
        support: 'ตั้งแต่เวอร์ชั่น 10 ขึ้นไป'
    },
    {
        browser: 'iOS',
        support: 'ตั้งแต่เวอร์ชั่น 10 ขึ้นไป'
    },
    {
        browser: 'Android',
        support: 'Nougat (7.0), Marshmallow (6.0), Lollipop (5.0, 5.1)'
    }
]