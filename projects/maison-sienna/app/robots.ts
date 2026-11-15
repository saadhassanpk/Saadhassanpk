import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:'*',allow:'/',disallow:['/checkout','/order-confirmation','/reservations/manage']}],sitemap:'https://maison-sienna-restaurant.vercel.app/sitemap.xml'}}
