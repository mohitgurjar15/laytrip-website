import { environment } from "../../environments/environment"

  
const s3BucketUrl=environment.s3BucketUrl
export const cardObject = {
    visa: `${s3BucketUrl}assets/images/card_visa.svg`,
    master: `${s3BucketUrl}assets/images/master_cards_img.svg`,
    american_express: `${s3BucketUrl}assets/images/card_amex.svg`,
    discover: `${s3BucketUrl}assets/images/card_discover.svg`,
    dankort: `${s3BucketUrl}assets/images/card_dankort.svg`,
    maestro: `${s3BucketUrl}assets/images/card_maestro.svg`,
    jcb: `${s3BucketUrl}assets/images/card_jcb.svg`,
    diners_club: `${s3BucketUrl}assets/images/card_dinners_club.svg`,
  }

  export const cardType = {
    visa: 'Visa',
    master: 'Master Card',
    american_express: 'American Express',
    discover: 'Discover',
    dankort: 'Dankort',
    maestro: 'Maestro',
    jcb: 'JCB',
    diners_club: 'Diners Club',
  }