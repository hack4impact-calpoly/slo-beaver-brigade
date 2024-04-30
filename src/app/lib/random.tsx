
export function fallbackBackgroundImage(image: string | null, fallback: string){
    if (!image){

        return `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url("${fallback}")`
  
    }
    return `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(${image})`
}
export function getBaseUrl(){
    if (process.env.DEV_MODE == 'true'){
        if (!process.env.DEV_BASE_URL){
            return "http://localhost:3000"
        }
        return process.env.DEV_BASE_URL
    }
    return process.env.BASE_URL
}