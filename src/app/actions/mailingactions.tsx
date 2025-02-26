'use server'

import mailchimp, { Status } from "@mailchimp/mailchimp_marketing"
import crypto from 'crypto'


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
    
    return true
}

export async function addToNewsletter(email_address: string, first_name: string, last_name: string, zipcode: string) {
    // hash email address using md5

    if (!process.env.NEWSLETTER_ID){
        console.log("No newsletter found.")
        return false
    }
    const subscriber_hash = crypto.createHash('md5').update(email_address).digest('hex');
    try{

        const newletterid = process.env.NEWSLETTER_ID
        console.log('trying to add user')
        if (!newletterid){
            console.log("No newsletter found.")
            return false
        }
        const body = {
            email_address: email_address,
            status: "subscribed" as Status,
            merge_fields: {
                FNAME: first_name,
                LNAME: last_name,
                MMERGE5: Number(zipcode)
            }
        }
        await mailchimp.lists.addListMember(newletterid, body)
    }
    catch (err) {
        try{
            const newletterid = process.env.NEWSLETTER_ID
            if (!newletterid){
                return false
            }
            
            await mailchimp.lists.updateListMember(newletterid, subscriber_hash, {status: "subscribed"})
        }
        catch(err){
            return false
        }

    }
    return true
}

export async function removeFromNewsletter(email_address: string) {
    debugger;
    if (!process.env.NEWSLETTER_ID){
        console.log("No newsletter found.")
        return false
    }

    const subscriber_hash = crypto.createHash('md5').update(email_address).digest('hex');
    try{

        const member = await mailchimp.lists.getListMember(process.env.NEWSLETTER_ID, subscriber_hash)
        if (member.status == 'subscribed'){
            mailchimp.lists.updateListMember(process.env.NEWSLETTER_ID , email_address, {status: "unsubscribed"})
            return true
        }
    }
    catch(err){
        console.error(err)
        return false
    }
    return true
    
}
