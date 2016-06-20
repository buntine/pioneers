namespace Helpers {
    export function imageSource(category: string, file: string): string {
        return `/static/images/${category}/${file}`;
    }

    export function onHighRes(resolution: Structure.Resolution, f: () => void): void {
        if (resolution == "High") {
            requestAnimationFrame(f);
        } else {
            f();
        }
    }
}
