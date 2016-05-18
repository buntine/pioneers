namespace Helpers {
  export function imageSource(category:string, file:string) : string {
    return `/static/images/${category}/${file}`;
  }
}
