'use server'

import mailchimp from "@mailchimp/mailchimp_marketing"

/**
 * Mailchimp API key can be generated at: https://mailchimp.com/help/about-api-keys/
 * Mailchimp server can be found in the url of mailchimp once logged in, 
 * example: https://us19.admin.mailchimp.com/ -> us19 is the server
 */
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER
});

export async function getLists(){
    const response = await mailchimp.lists.getAllLists()
    console.log(response)
    return true
}

export async function addToNewsletter(email_address: string) {
    try{
        const newletterid = process.env.NEWSLETTER_ID
        if (!newletterid){
            console.log('issue occured with api key, mailchimp newsletter id.')
            return false
        }
        
        const response = await mailchimp.lists.addListMember(newletterid, {email_address, status: "subscribed"})
        console.log(response);
        console.log('added')
        if (response.status == 200){
            return true
        }
        return false
    }
    catch(err){
        console.log(err)
        return false
    }
}

export async function removeFromNewsletter(email_address: string) {
    const newletterid = process.env.NEWSLETTER_ID
    if (!newletterid){
        console.log('issue occured with api key, mailchimp newsletter id.')
        return false
    }
    
    const response = await mailchimp.lists.addListMember(newletterid, {email_address, status: "unsubscribed"})
    console.log(response);
    if (response.status == 200){
        return true
    }
    return false
}
