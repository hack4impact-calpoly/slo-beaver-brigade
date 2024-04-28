export function fallbackBackgroundImage(image: string | null, fallback: string = '/beaver-eventcard.jpeg'){
    if (!image){

        return `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url("${fallback}")`
  
    }
    return `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(${image})`
}