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

    export function openPopup(content: string): void {
        $.magnificPopup.open({
            items: {
                src: content,
                type: "inline"
            },
            removalDelay: 300,
            mainClass: "mfp-fade"
        });
    }
}
