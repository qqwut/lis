import { NgcCookieConsentConfig } from "ngx-cookieconsent";

export const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: 'not-set'
    },
    position: 'bottom',
    theme: 'classic',
    palette: {
        popup: {
            background: '#2c2825',
            text: 'white',
            link: 'white'
        },
        button: {
            background: '#ff901d',
            text: 'white',
            border: 'transparent'
        }
    },
    type: 'opt-out',
};