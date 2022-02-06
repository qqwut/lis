import { NgcCookieConsentConfig } from 'ngx-cookieconsent'

export const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost', // it is recommended to set your domain, for cookies to work properly
  },
  palette: {
    popup: {
      background: '#2c2825',
      text: 'white',
      link: 'white',
    },
    button: {
      background: '#ff901d',
      text: 'white',
      border: 'transparent',
    },
  },
  theme: 'classic', // edgeless
  type: 'opt-out',
  layout: 'my-custom-layout',
  layouts: {
    'my-custom-layout': '{{messagelink}}{{compliance}}',
  },
  // elements: {
  //   messagelink: `
  //   <span id="cookieconsent:desc" class="cc-message">{{message}}
  //     <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}">{{cookiePolicyLink}}</a> และ
  //     <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}">{{privacyPolicyLink}}</a>
  //   </span>
  //   `,
  // },
  // content: {
  //   message:
  //     'เว็บไซต์นี้ใช้คุกกี้เพื่อวัตถุประสงค์ในการปรับปรุงประสบการณ์ของผู้ใช้ให้ดียิ่งขึ้น ท่านสามารถศึกษารายละเอียดเพิ่มเติมเกี่ยวกับคุกกี้  เหตุผลในการใช้คุกกี้ และวิธีการตั้งค่าคุกกี้ได้ใน',

  //   cookiePolicyLink: 'นโยบายการใช้คุกกี้',
  //   cookiePolicyHref: 'cookie-policy',

  //   privacyPolicyLink: 'นโยบายการคุ้มครองข้อมูลส่วนบุคคล',
  //   privacyPolicyHref: 'privacy-policy',

  //   // tosLink: 'Terms of Service',
  //   // tosHref: 'https://tos.com',
  // },
}
