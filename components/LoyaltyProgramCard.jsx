'use client';
import {useLanguage} from '@/components/language-provider'
import {normalizeLoyaltyProgram} from '../lib/loyalty-program';
export default function LoyaltyProgramCard({value}){
 const {t,locale}=useLanguage();
const p=normalizeLoyaltyProgram(value);return <section aria-label={t("Programme de fidélité permanent")} style={{padding:24,background:'#f4efe8',color:'#34251e',border:'1px solid #d9cec1',borderRadius:12,overflowWrap:'anywhere',lineHeight:1.6}}><h2 style={{fontFamily:'Georgia,serif',fontSize:28,margin:'0 0 12px'}}>{p.title}</h2><p>{p.description}</p><strong>{p.clientText}</strong><p>{p.threshold} {t(" achats nécessaires · ")}{p.reward}</p>{p.rewardValue!==null&&<p>{t("Valeur : ")}{p.rewardValue.toLocaleString(locale,{style:'currency',currency:'EUR'})}</p>}{!p.enabled&&<p>{t("Programme temporairement suspendu. Vos tampons sont conservés.")}</p>}</section>}
