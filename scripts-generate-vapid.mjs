import webpush from 'web-push'
const keys = webpush.generateVAPIDKeys()
console.log('\nCopiez ces deux valeurs dans les variables Vercel :\n')
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
console.log('\nAjoutez aussi : VAPID_SUBJECT=mailto:lebistrotducoin41220@gmail.com\n')
