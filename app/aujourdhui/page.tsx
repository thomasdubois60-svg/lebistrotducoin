'use client'
import DailyMenuView from '@/components/DailyMenuView'
import {useSiteContent} from '@/components/content-provider'
export default function TodayPage(){const {daily,pageTexts,general,sectionPhotos}=useSiteContent();return <DailyMenuView daily={daily} introduction={pageTexts.todayIntro} phone={general.phone} photo={sectionPhotos?.today}/>}
