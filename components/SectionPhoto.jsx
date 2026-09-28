'use client';
import {siteImage} from '../lib/site-image';
import styles from './SectionPhoto.module.css';
export default function SectionPhoto({photo,home=false,lazy=false}){const src=photo?.image;if(typeof src!=='string'||!(/^(https:\/\/|\/photos\/)/i.test(src)))return null;return <img className={home?styles.home:styles.banner} src={src.startsWith('/photos/')?'https://raw.githubusercontent.com/thomasdubois60-svg/lebistrotducoin/main/public'+src:siteImage(src,1600)} alt={photo.alt||''} loading={lazy?'lazy':'eager'} fetchPriority={home?'high':'auto'} decoding="async"/>}
